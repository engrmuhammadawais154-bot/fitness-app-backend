package com.auraflow.app

import android.content.Intent
import android.net.Uri
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import android.util.Log
import java.time.Instant

@CapacitorPlugin(name = "HealthConnect")
class HealthConnectPlugin : Plugin() {
    
    private var healthConnectClient: HealthConnectClient? = null
    
    private val permissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(DistanceRecord::class),
        HealthPermission.getReadPermission(TotalCaloriesBurnedRecord::class),
        HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(WeightRecord::class),
        HealthPermission.getWritePermission(WeightRecord::class)
    )
    
    override fun load() {
        super.load()
        initializeClient()
    }
    
    private fun initializeClient() {
        try {
            val availabilityStatus = HealthConnectClient.getSdkStatus(context)
            if (availabilityStatus == HealthConnectClient.SDK_AVAILABLE) {
                healthConnectClient = HealthConnectClient.getOrCreate(context)
            }
        } catch (e: Exception) {
            // Health Connect SDK not available
        }
    }
    
    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val ret = JSObject()
        try {
            val availabilityStatus = HealthConnectClient.getSdkStatus(context)
            when (availabilityStatus) {
                HealthConnectClient.SDK_AVAILABLE -> {
                    ret.put("available", true)
                    ret.put("status", "available")
                    if (healthConnectClient == null) {
                        healthConnectClient = HealthConnectClient.getOrCreate(context)
                    }
                }
                HealthConnectClient.SDK_UNAVAILABLE -> {
                    ret.put("available", false)
                    ret.put("status", "unavailable")
                }
                HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> {
                    ret.put("available", false)
                    ret.put("status", "update_required")
                }
                else -> {
                    ret.put("available", false)
                    ret.put("status", "unknown")
                }
            }
        } catch (e: Exception) {
            ret.put("available", false)
            ret.put("status", "error")
            ret.put("error", e.message)
        }
        call.resolve(ret)
    }
    
    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not initialized. Please install Health Connect from Play Store.")
            return
        }
        
        CoroutineScope(Dispatchers.Main).launch {
            try {
                // Check current permissions
                val granted = client.permissionController.getGrantedPermissions()
                
                if (granted.containsAll(permissions)) {
                    val ret = JSObject()
                    ret.put("granted", true)
                    ret.put("message", "All permissions already granted")
                    call.resolve(ret)
                } else {
                    // Request permissions using the permission controller
                    try {
                        // Create the permission request intent
                        val permissionContract = PermissionController.createRequestPermissionResultContract()
                        val intent = permissionContract.createIntent(context, permissions)
                        
                        // Launch the Health Connect permission screen
                        activity.startActivity(intent)
                        
                        val ret = JSObject()
                        ret.put("granted", false)
                        ret.put("message", "Permission request opened")
                        call.resolve(ret)
                    } catch (e: Exception) {
                        // Fallback: Open Health Connect settings
                        try {
                            val packageManager = context.packageManager
                            val intent = packageManager.getLaunchIntentForPackage("com.google.android.apps.healthdata")
                            if (intent != null) {
                                activity.startActivity(intent)
                            }
                        } catch (ex: Exception) {
                            // Last resort: Open on Play Store
                            val playStoreIntent = Intent(Intent.ACTION_VIEW).apply {
                                data = Uri.parse("market://details?id=com.google.android.apps.healthdata")
                            }
                            activity.startActivity(playStoreIntent)
                        }
                        
                        val ret = JSObject()
                        ret.put("granted", false)
                        ret.put("message", "Please grant permissions manually in Health Connect")
                        call.resolve(ret)
                    }
                }
            } catch (e: Exception) {
                call.reject("Failed to request permissions: ${e.message}")
            }
        }
    }
    
    @PluginMethod
    override fun checkPermissions(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not initialized")
            return
        }
        
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                val allGranted = granted.containsAll(permissions)
                
                val ret = JSObject()
                ret.put("granted", allGranted)
                ret.put("grantedCount", granted.size)
                ret.put("requiredCount", permissions.size)
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to check permissions: ${e.message}")
            }
        }
    }
    
    @PluginMethod
    fun fetchHealthData(call: PluginCall) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val context = activity.applicationContext
                if (healthConnectClient == null) {
                    healthConnectClient = HealthConnectClient.getOrCreate(context)
                }
                
                val client = healthConnectClient
                if (client == null) {
                    val ret = JSObject()
                    ret.put("success", false)
                    ret.put("error", "Health Connect client not available")
                    call.resolve(ret)
                    return@launch
                }

                // --- RETRY LOGIC START ---
                // Try 3 times to see if permissions are ready (Health Connect service may be waking up)
                var attempts = 0
                var permissionsReady = false
                
                while (attempts < 3 && !permissionsReady) {
                    val granted = client.permissionController.getGrantedPermissions()
                    if (granted.containsAll(permissions)) {
                        Log.d("HealthConnect", "Permissions ready on attempt ${attempts + 1}")
                        permissionsReady = true
                    } else {
                        attempts++
                        Log.w("HealthConnect", "Permissions not ready, attempt $attempts/3")
                        if (attempts < 3) {
                            // Wait 500ms before trying again
                            delay(500)
                        }
                    }
                }

                if (!permissionsReady) {
                    Log.e("HealthConnect", "Permissions not granted after $attempts attempts")
                    val ret = JSObject()
                    ret.put("success", false)
                    ret.put("error", "Permissions not granted after retries")
                    call.resolve(ret)
                    return@launch
                }
                // --- RETRY LOGIC END ---

                // Get today's date range
                val startOfDay = Instant.now().atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant()
                val now = Instant.now()
                val timeRangeFilter = TimeRangeFilter.between(startOfDay, now)

                // Fetch steps
                var totalSteps = 0L
                try {
                    val stepsResponse = client.readRecords(
                        ReadRecordsRequest(
                            StepsRecord::class,
                            timeRangeFilter = timeRangeFilter
                        )
                    )
                    totalSteps = stepsResponse.records.sumOf { it.count }
                } catch (e: Exception) {
                    // Log but continue - user might not have step data
                }

                // Fetch calories
                var totalCalories = 0.0
                try {
                    val caloriesResponse = client.readRecords(
                        ReadRecordsRequest(
                            TotalCaloriesBurnedRecord::class,
                            timeRangeFilter = timeRangeFilter
                        )
                    )
                    totalCalories = caloriesResponse.records.sumOf { it.energy.inKilocalories }
                } catch (e: Exception) {
                    // Log but continue
                }

                // Fetch distance
                var totalDistance = 0.0
                try {
                    val distanceResponse = client.readRecords(
                        ReadRecordsRequest(
                            DistanceRecord::class,
                            timeRangeFilter = timeRangeFilter
                        )
                    )
                    totalDistance = distanceResponse.records.sumOf { it.distance.inKilometers }
                } catch (e: Exception) {
                    // Log but continue
                }

                // Fetch heart rate (average)
                var avgHeartRate = 0L
                try {
                    val heartRateResponse = client.readRecords(
                        ReadRecordsRequest(
                            HeartRateRecord::class,
                            timeRangeFilter = timeRangeFilter
                        )
                    )
                    val allSamples = heartRateResponse.records.flatMap { it.samples }
                    if (allSamples.isNotEmpty()) {
                        avgHeartRate = allSamples.map { it.beatsPerMinute }.average().toLong()
                    }
                } catch (e: Exception) {
                    // Log but continue
                }

                val ret = JSObject()
                ret.put("steps", totalSteps.toInt())
                ret.put("calories", totalCalories.toInt())
                ret.put("distance", totalDistance)
                ret.put("heartRate", avgHeartRate.toInt())
                ret.put("success", true)
                call.resolve(ret)

            } catch (e: Exception) {
                val ret = JSObject()
                ret.put("success", false)
                ret.put("error", e.message ?: "Unknown error")
                call.resolve(ret)
            }
        }
    }
    
    @PluginMethod
    fun getSteps(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not available")
            return
        }
        
        val startTime = call.getLong("startTime") ?: 0L
        val endTime = call.getLong("endTime") ?: System.currentTimeMillis()
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = client.readRecords(
                    ReadRecordsRequest(
                        StepsRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(
                            Instant.ofEpochMilli(startTime),
                            Instant.ofEpochMilli(endTime)
                        )
                    )
                )
                
                val totalSteps = response.records.sumOf { it.count }
                val ret = JSObject()
                ret.put("steps", totalSteps.toInt())
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to read steps: ${e.message}")
            }
        }
    }
    
    @PluginMethod
    fun getCalories(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not available")
            return
        }
        
        val startTime = call.getLong("startTime") ?: 0L
        val endTime = call.getLong("endTime") ?: System.currentTimeMillis()
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = client.readRecords(
                    ReadRecordsRequest(
                        TotalCaloriesBurnedRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(
                            Instant.ofEpochMilli(startTime),
                            Instant.ofEpochMilli(endTime)
                        )
                    )
                )
                
                val totalCalories = response.records.sumOf { record ->
                    record.energy.inKilocalories.toInt().toLong()
                }
                val ret = JSObject()
                ret.put("calories", totalCalories.toInt())
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to read calories: ${e.message}")
            }
        }
    }
    
    @PluginMethod
    fun getDistance(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not available")
            return
        }
        
        val startTime = call.getLong("startTime") ?: 0L
        val endTime = call.getLong("endTime") ?: System.currentTimeMillis()
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = client.readRecords(
                    ReadRecordsRequest(
                        DistanceRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(
                            Instant.ofEpochMilli(startTime),
                            Instant.ofEpochMilli(endTime)
                        )
                    )
                )
                
                val totalDistance = response.records.sumOf { record ->
                    record.distance.inKilometers
                }
                val ret = JSObject()
                ret.put("distance", totalDistance.toInt())
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to read distance: ${e.message}")
            }
        }
    }
    
    @PluginMethod
    fun getActiveMinutes(call: PluginCall) {
        val ret = JSObject()
        ret.put("minutes", 0)
        call.resolve(ret)
    }
    
    @PluginMethod
    fun getHeartRate(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not available")
            return
        }
        
        val startTime = call.getLong("startTime") ?: 0L
        val endTime = call.getLong("endTime") ?: System.currentTimeMillis()
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = client.readRecords(
                    ReadRecordsRequest(
                        HeartRateRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(
                            Instant.ofEpochMilli(startTime),
                            Instant.ofEpochMilli(endTime)
                        )
                    )
                )
                
                val allSamples = response.records.flatMap { record -> record.samples }
                val avgHeartRate = if (allSamples.isNotEmpty()) {
                    allSamples.map { sample -> sample.beatsPerMinute }.average().toInt()
                } else {
                    0
                }
                
                val ret = JSObject()
                ret.put("heartRate", avgHeartRate)
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to read heart rate: ${e.message}")
            }
        }
    }
}
