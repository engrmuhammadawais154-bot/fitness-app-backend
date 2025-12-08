package com.auraflow.app

import android.os.Bundle
import android.widget.TextView
import android.widget.LinearLayout
import android.view.Gravity
import androidx.appcompat.app.AppCompatActivity

class HealthConnectPermissionActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Create a simple layout explaining why we need health permissions
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(48, 48, 48, 48)
            setBackgroundColor(0xFFFFFFFF.toInt())
        }
        
        val title = TextView(this).apply {
            text = "AuraFlow Health Data Access"
            textSize = 24f
            setTextColor(0xFF1F2937.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 32)
        }
        
        val description = TextView(this).apply {
            text = """
                AuraFlow uses Health Connect to sync your fitness data from your wearable devices.
                
                We access:
                • Steps - Track your daily activity
                • Distance - Monitor your movement
                • Calories - Track energy burned
                • Heart Rate - Monitor your heart health
                • Weight - Track your progress
                
                Your data is stored securely and never shared with third parties.
                
                Privacy Policy: https://auraflow.app/privacy
            """.trimIndent()
            textSize = 16f
            setTextColor(0xFF4B5563.toInt())
            gravity = Gravity.CENTER
        }
        
        layout.addView(title)
        layout.addView(description)
        
        setContentView(layout)
    }
}
