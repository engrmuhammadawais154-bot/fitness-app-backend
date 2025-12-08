package com.auraflow.app

import androidx.health.connect.client.HealthConnectClient
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
        // Don't initialize here, do it on-demand
    }
    
    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val ret = JSObject()
        try {
            // Check if Health Connect package is installed
            val packageManager = context.packageManager
            val healthConnectPackage = "com.google.android.apps.healthdata"
            packageManager.getPackageInfo(healthConnectPackage, 0)
            
            // Package is installed, Health Connect is available
            ret.put("available", true)
            
            // Initialize client if not already done
            if (healthConnectClient == null) {
                healthConnectClient = HealthConnectClient.getOrCreate(context)
            }
        } catch (e: Exception) {
            // Health Connect not installed
            ret.put("available", false)
        }
        call.resolve(ret)
    }
    
    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        val client = healthConnectClient
        if (client == null) {
            call.reject("Health Connect not available")
            return
        }
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Check current permissions
                val granted = client.permissionController.getGrantedPermissions()
                
                val ret = JSObject()
                if (granted.containsAll(permissions)) {
                    ret.put("granted", true)
                } else {
                    ret.put("granted", false)
                    ret.put("message", "Please grant permissions in Health Connect app")
                }
                call.resolve(ret)
            } catch (e: Exception) {
                call.reject("Failed to check permissions: ${e.message}")
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
