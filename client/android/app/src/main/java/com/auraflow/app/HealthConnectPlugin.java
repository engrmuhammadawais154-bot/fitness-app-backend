package com.auraflow.app;

import android.content.Intent;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.health.connect.client.HealthConnectClient;
import androidx.health.connect.client.permission.HealthPermission;
import androidx.health.connect.client.records.*;
import androidx.health.connect.client.request.ReadRecordsRequest;
import androidx.health.connect.client.time.TimeRangeFilter;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@CapacitorPlugin(name = "HealthConnect")
public class HealthConnectPlugin extends Plugin {

    private HealthConnectClient healthConnectClient;
    private ActivityResultLauncher<Set<String>> requestPermissions;

    @Override
    public void load() {
        // Initialize Health Connect client
        if (HealthConnectClient.isAvailable(getContext())) {
            healthConnectClient = HealthConnectClient.getOrCreate(getContext());
        }

        // Setup permission request launcher
        requestPermissions = bridge.getActivity().registerForActivityResult(
            new ActivityResultContracts.RequestMultiplePermissions(),
            isGranted -> {
                // Handle permission results
            }
        );
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", HealthConnectClient.isAvailable(getContext()));
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (healthConnectClient == null) {
            call.reject("Health Connect not available");
            return;
        }

        Set<String> permissions = new HashSet<>();
        permissions.add(HealthPermission.READ_STEPS);
        permissions.add(HealthPermission.READ_DISTANCE);
        permissions.add(HealthPermission.READ_TOTAL_CALORIES_BURNED);
        permissions.add(HealthPermission.READ_ACTIVE_CALORIES_BURNED);
        permissions.add(HealthPermission.READ_HEART_RATE);
        permissions.add(HealthPermission.READ_WEIGHT);
        permissions.add(HealthPermission.WRITE_WEIGHT);

        try {
            Intent intent = HealthConnectClient.getOrCreate(getContext())
                .permissionController
                .createRequestPermissionActivityIntent(permissions);
            
            bridge.getActivity().startActivityForResult(intent, 1000);
            
            JSObject ret = new JSObject();
            ret.put("granted", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to request permissions", e);
        }
    }

    @PluginMethod
    public void getSteps(PluginCall call) {
        if (healthConnectClient == null) {
            call.reject("Health Connect not available");
            return;
        }

        long startTime = call.getLong("startTime", 0L);
        long endTime = call.getLong("endTime", System.currentTimeMillis());

        try {
            TimeRangeFilter timeRange = new TimeRangeFilter.Builder()
                .setStartTime(Instant.ofEpochMilli(startTime))
                .setEndTime(Instant.ofEpochMilli(endTime))
                .build();

            ReadRecordsRequest<StepsRecord> request = new ReadRecordsRequest.Builder<>(
                StepsRecord.class, timeRange
            ).build();

            healthConnectClient.readRecords(request)
                .addOnSuccessListener(response -> {
                    long totalSteps = 0;
                    for (StepsRecord record : response.getRecords()) {
                        totalSteps += record.getCount();
                    }
                    JSObject ret = new JSObject();
                    ret.put("steps", totalSteps);
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to read steps", e);
                });
        } catch (Exception e) {
            call.reject("Error reading steps", e);
        }
    }

    @PluginMethod
    public void getCalories(PluginCall call) {
        if (healthConnectClient == null) {
            call.reject("Health Connect not available");
            return;
        }

        long startTime = call.getLong("startTime", 0L);
        long endTime = call.getLong("endTime", System.currentTimeMillis());

        try {
            TimeRangeFilter timeRange = new TimeRangeFilter.Builder()
                .setStartTime(Instant.ofEpochMilli(startTime))
                .setEndTime(Instant.ofEpochMilli(endTime))
                .build();

            ReadRecordsRequest<TotalCaloriesBurnedRecord> request = new ReadRecordsRequest.Builder<>(
                TotalCaloriesBurnedRecord.class, timeRange
            ).build();

            healthConnectClient.readRecords(request)
                .addOnSuccessListener(response -> {
                    double totalCalories = 0;
                    for (TotalCaloriesBurnedRecord record : response.getRecords()) {
                        totalCalories += record.getEnergy().getKilocalories();
                    }
                    JSObject ret = new JSObject();
                    ret.put("calories", (int) totalCalories);
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to read calories", e);
                });
        } catch (Exception e) {
            call.reject("Error reading calories", e);
        }
    }

    @PluginMethod
    public void getDistance(PluginCall call) {
        if (healthConnectClient == null) {
            call.reject("Health Connect not available");
            return;
        }

        long startTime = call.getLong("startTime", 0L);
        long endTime = call.getLong("endTime", System.currentTimeMillis());

        try {
            TimeRangeFilter timeRange = new TimeRangeFilter.Builder()
                .setStartTime(Instant.ofEpochMilli(startTime))
                .setEndTime(Instant.ofEpochMilli(endTime))
                .build();

            ReadRecordsRequest<DistanceRecord> request = new ReadRecordsRequest.Builder<>(
                DistanceRecord.class, timeRange
            ).build();

            healthConnectClient.readRecords(request)
                .addOnSuccessListener(response -> {
                    double totalDistance = 0;
                    for (DistanceRecord record : response.getRecords()) {
                        totalDistance += record.getDistance().getMeters();
                    }
                    JSObject ret = new JSObject();
                    ret.put("distance", (int) (totalDistance / 1000)); // Convert to km
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to read distance", e);
                });
        } catch (Exception e) {
            call.reject("Error reading distance", e);
        }
    }

    @PluginMethod
    public void getActiveMinutes(PluginCall call) {
        // For now, return 0 - this would require calculating from exercise sessions
        JSObject ret = new JSObject();
        ret.put("minutes", 0);
        call.resolve(ret);
    }

    @PluginMethod
    public void getHeartRate(PluginCall call) {
        if (healthConnectClient == null) {
            call.reject("Health Connect not available");
            return;
        }

        long startTime = call.getLong("startTime", 0L);
        long endTime = call.getLong("endTime", System.currentTimeMillis());

        try {
            TimeRangeFilter timeRange = new TimeRangeFilter.Builder()
                .setStartTime(Instant.ofEpochMilli(startTime))
                .setEndTime(Instant.ofEpochMilli(endTime))
                .build();

            ReadRecordsRequest<HeartRateRecord> request = new ReadRecordsRequest.Builder<>(
                HeartRateRecord.class, timeRange
            ).build();

            healthConnectClient.readRecords(request)
                .addOnSuccessListener(response -> {
                    long totalBPM = 0;
                    int count = 0;
                    for (HeartRateRecord record : response.getRecords()) {
                        for (HeartRateRecord.Sample sample : record.getSamples()) {
                            totalBPM += sample.getBeatsPerMinute();
                            count++;
                        }
                    }
                    int avgHeartRate = count > 0 ? (int) (totalBPM / count) : 0;
                    JSObject ret = new JSObject();
                    ret.put("heartRate", avgHeartRate);
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to read heart rate", e);
                });
        } catch (Exception e) {
            call.reject("Error reading heart rate", e);
        }
    }
}
