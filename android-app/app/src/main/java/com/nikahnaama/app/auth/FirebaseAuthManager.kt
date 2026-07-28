package com.nikahnaama.app.auth

import android.app.Activity
import android.os.Handler
import android.os.Looper
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import java.util.concurrent.TimeUnit

class FirebaseAuthManager(private val activity: Activity) {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private var storedVerificationId: String? = null

    fun sendVerificationCode(phoneNumber: String, callbacks: PhoneAuthProvider.OnVerificationStateChangedCallbacks) {
        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(activity)
            .setCallbacks(callbacks)
            .build()
        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    fun verifyCode(verificationId: String, code: String, onComplete: (Boolean, Exception?) -> Unit) {
        try {
            val credential = PhoneAuthProvider.getCredential(verificationId, code)
            signInWithCredential(credential, onComplete)
        } catch (e: Exception) {
            onComplete(false, e)
        }
    }

    private fun signInWithCredential(credential: PhoneAuthCredential, onComplete: (Boolean, Exception?) -> Unit) {
        auth.signInWithCredential(credential).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                onComplete(true, null)
            } else {
                onComplete(false, task.exception)
            }
        }
    }
}
