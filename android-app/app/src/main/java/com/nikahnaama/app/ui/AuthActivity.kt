package com.nikahnaama.app.ui

import android.widget.Toast
import androidx.activity.compose.setContent
import androidx.appcompat.app.AppCompatActivity
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
import com.google.firebase.auth.PhoneAuthProvider
import com.nikahnaama.app.auth.FirebaseAuthManager

class AuthActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val authManager = FirebaseAuthManager(this)

        setContent {
            var phone by remember { mutableStateOf("") }
            var code by remember { mutableStateOf("") }
            var verificationId by remember { mutableStateOf("") }

            val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                override fun onVerificationCompleted(credential: com.google.firebase.auth.PhoneAuthCredential) {
                    // Auto-retrieval or instant verification
                    authManager.verifyCode(verificationId, credential.smsCode ?: "", { success, ex ->
                        if (success) Toast.makeText(this@AuthActivity, "Signed in", Toast.LENGTH_SHORT).show()
                    })
                }

                override fun onVerificationFailed(e: FirebaseException) {
                    Toast.makeText(this@AuthActivity, "Verification failed: ${e.message}", Toast.LENGTH_LONG).show()
                }

                override fun onCodeSent(vId: String, token: PhoneAuthProvider.ForceResendingToken) {
                    verificationId = vId
                    Toast.makeText(this@AuthActivity, "Code sent", Toast.LENGTH_SHORT).show()
                }
            }

            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Phone number (+CountryCode) e.g. +9198...") }, modifier = Modifier.fillMaxWidth())
                Button(onClick = { authManager.sendVerificationCode(phone, callbacks) }, modifier = Modifier.padding(top = 8.dp)) {
                    Text("Send OTP")
                }
                OutlinedTextField(value = code, onValueChange = { code = it }, label = { Text("Enter OTP") }, modifier = Modifier.fillMaxWidth())
                Button(onClick = {
                    if (verificationId.isNotEmpty()) {
                        authManager.verifyCode(verificationId, code) { success, ex ->
                            if (success) {
                                Toast.makeText(this@AuthActivity, "Authentication successful", Toast.LENGTH_SHORT).show()
                                finish()
                            } else {
                                Toast.makeText(this@AuthActivity, "Auth failed: ${ex?.message}", Toast.LENGTH_LONG).show()
                            }
                        }
                    } else {
                        Toast.makeText(this@AuthActivity, "Please request OTP first", Toast.LENGTH_SHORT).show()
                    }
                }, modifier = Modifier.padding(top = 8.dp)) {
                    Text("Verify OTP")
                }
            }
        }
    }
}
