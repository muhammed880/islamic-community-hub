package com.nikahnaama.app.ui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import android.os.Bundle
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.nikahnaama.app.data.FirestoreRepository

class MasjidRegistrationActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            var name by remember { mutableStateOf("") }
            var phone by remember { mutableStateOf("") }
            var address by remember { mutableStateOf("") }
            var upiId by remember { mutableStateOf("") }
            var utr by remember { mutableStateOf("") }
            var fee by remember { mutableStateOf("") }

            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Masjid name") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Contact mobile") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = address, onValueChange = { address = it }, label = { Text("Address") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = upiId, onValueChange = { upiId = it }, label = { Text("Masjid UPI ID") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = fee, onValueChange = { fee = it }, label = { Text("Registration fee (e.g. 1000)") }, modifier = Modifier.fillMaxWidth())

                Button(onClick = {
                    // Launch UPI intent
                    val uri = Uri.parse("upi://pay?pa=${Uri.encode(upiId)}&pn=${Uri.encode(name)}&am=${Uri.encode(fee)}&cu=INR")
                    val intent = Intent(Intent.ACTION_VIEW, uri)
                    try {
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this@MasjidRegistrationActivity, "No UPI app found", Toast.LENGTH_SHORT).show()
                    }
                }, modifier = Modifier.padding(top = 8.dp)) {
                    Text("Make Payment (opens UPI app)")
                }

                OutlinedTextField(value = utr, onValueChange = { utr = it }, label = { Text("Enter UTR/Txn ID (required)") }, modifier = Modifier.fillMaxWidth())

                Button(onClick = {
                    if (name.isBlank() || phone.isBlank() || upiId.isBlank() || utr.isBlank()) {
                        Toast.makeText(this@MasjidRegistrationActivity, "Please fill required fields", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    val data = mapOf(
                        "name" to name,
                        "contactPhone" to phone,
                        "address" to address,
                        "upiId" to upiId,
                        "registrationFee" to fee,
                        "paymentUtr" to utr,
                        "creatorAnonymous" to false
                    )
                    FirestoreRepository.submitMasjidRegistration(data) { success, ex ->
                        if (success) {
                            Toast.makeText(this@MasjidRegistrationActivity, "Submitted for approval", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@MasjidRegistrationActivity, "Submit failed: ${ex?.message}", Toast.LENGTH_LONG).show()
                        }
                    }
                }, modifier = Modifier.padding(top = 8.dp)) {
                    Text("Submit Registration")
                }
            }
        }
    }
}
