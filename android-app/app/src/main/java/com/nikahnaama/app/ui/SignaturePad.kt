package com.nikahnaama.app.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput

@Composable
fun SignaturePad(onSave: (Path) -> Unit) {
    var paths by remember { mutableStateOf(listOf<Path>()) }
    var currentPath by remember { mutableStateOf<Path?>(null) }

    Box(modifier = Modifier
        .fillMaxSize()
        .background(Color.White)) {
        Canvas(modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectDragGestures(onDragStart = { offset ->
                    val p = Path().apply { moveTo(offset.x, offset.y) }
                    currentPath = p
                    paths = paths + p
                }, onDrag = { change, _ ->
                    currentPath?.let { it.lineTo(change.position.x, change.position.y) }
                }, onDragEnd = {
                    currentPath = null
                })
            }) {
            for (p in paths) {
                drawPath(path = p, color = Color.Black, style = Stroke(width = 4f))
            }
        }

        Button(onClick = { paths = listOf(); onSave(Path()) }, modifier = Modifier.align(Alignment.BottomCenter)) {
            Text("Clear / Save")
        }
    }
}
