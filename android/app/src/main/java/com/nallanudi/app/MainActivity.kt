package com.nallanudi.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.nallanudi.app.data.WordEntry
import com.nallanudi.app.ui.DictionaryScreen
import com.nallanudi.app.ui.FlashcardMode
import com.nallanudi.app.ui.WordDetailScreen
import com.nallanudi.app.viewmodel.WordViewModel
import com.nallanudi.app.viewmodel.WordViewModelFactory

class MainActivity : ComponentActivity() {
    
    private val viewModel: WordViewModel by viewModels {
        WordViewModelFactory((application as NallaNudiApplication).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation(viewModel)
                }
            }
        }
    }
}

@Composable
fun AppNavigation(viewModel: WordViewModel) {
    val words by viewModel.filteredWords.collectAsState()
    val savedWords by viewModel.savedWords.collectAsState()
    
    var selectedWord by remember { mutableStateOf<WordEntry?>(null) }
    var isFlashcardMode by remember { mutableStateOf(false) }

    when {
        isFlashcardMode -> {
            FlashcardMode(
                savedWords = savedWords,
                onClose = { isFlashcardMode = false }
            )
        }
        selectedWord != null -> {
            WordDetailScreen(
                word = selectedWord!!,
                onBack = { selectedWord = null },
                onToggleSave = { viewModel.toggleSave(selectedWord!!) }
            )
        }
        else -> {
            DictionaryScreen(
                words = words,
                onSearch = { viewModel.setSearchQuery(it) },
                onToggleSave = { viewModel.toggleSave(it) },
                onWordClick = { selectedWord = it }
            )
            // Note: In a full app, we'd add buttons to enter flashcard mode
            // or see saved words only.
        }
    }
}

