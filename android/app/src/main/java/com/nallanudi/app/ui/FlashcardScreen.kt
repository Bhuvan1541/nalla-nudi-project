/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.nallanudi.app.data.WordEntry

@Composable
fun FlashcardMode(
    savedWords: List<WordEntry>,
    onClose: () -> Unit
) {
    var currentIndex by remember { mutableStateOf(0) }
    var rotated by remember { mutableStateOf(false) }
    
    val rotation by animateFloatAsState(
        targetValue = if (rotated) 180f else 0f,
        animationSpec = tween(durationMillis = 600)
    )

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (savedWords.isNotEmpty()) {
            val currentWord = savedWords[currentIndex]

            // 3D Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(350.dp)
                    .graphicsLayer {
                        rotationY = rotation
                        cameraDistance = 12f * density
                    }
                    .clickable { rotated = !rotated },
                shape = MaterialTheme.shapes.extraLarge,
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    if (rotation <= 90f) {
                        // Front
                        Column(
                            modifier = Modifier.fillMaxSize().padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text("ENGLISH WORD", style = MaterialTheme.typography.labelMedium)
                            Spacer(Modifier.height(16.dp))
                            Text(
                                currentWord.englishWord,
                                style = MaterialTheme.typography.headlineLarge,
                                fontWeight = FontWeight.Black
                            )
                        }
                    } else {
                        // Back
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(24.dp)
                                .graphicsLayer { rotationY = 180f },
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text("KANNADA MEANING", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                            Spacer(Modifier.height(16.dp))
                            Text(
                                currentWord.kannadaMeaning,
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(Modifier.height(16.dp))
                            Text(
                                currentWord.explanationKannada,
                                style = MaterialTheme.typography.bodyMedium,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(48.dp))

            // Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = { if(currentIndex > 0) { currentIndex--; rotated = false } },
                    enabled = currentIndex > 0
                ) {
                    Text("Previous")
                }

                Text("${currentIndex + 1} / ${savedWords.size}", fontWeight = FontWeight.Bold)

                Button(
                    onClick = { if(currentIndex < savedWords.size - 1) { currentIndex++; rotated = false } },
                    enabled = currentIndex < savedWords.size - 1
                ) {
                    Text("Next")
                }
            }
        }
        
        Spacer(Modifier.height(24.dp))
        TextButton(onClick = onClose) {
            Text("Close Flashcards")
        }
    }
}
