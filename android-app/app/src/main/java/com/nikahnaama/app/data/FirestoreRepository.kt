package com.nikahnaama.app.data

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.Timestamp

object FirestoreRepository {
    private val db = FirebaseFirestore.getInstance()

    fun submitMasjidRegistration(data: Map<String, Any>, onComplete: (Boolean, Exception?) -> Unit) {
        val doc = db.collection("masjids").document()
        val payload = data.toMutableMap()
        payload["createdAt"] = Timestamp.now()
        payload["registrationStatus"] = "PENDING"
        doc.set(payload).addOnCompleteListener { task ->
            if (task.isSuccessful) onComplete(true, null) else onComplete(false, task.exception)
        }
    }
}
