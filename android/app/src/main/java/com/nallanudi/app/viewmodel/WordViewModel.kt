/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app.viewmodel

import androidx.lifecycle.*
import com.nallanudi.app.data.WordEntry
import com.nallanudi.app.data.WordRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class WordViewModel(private val repository: WordRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _selectedSubject = MutableStateFlow("All")
    val selectedSubject: StateFlow<String> = _selectedSubject

    val filteredWords: StateFlow<List<WordEntry>> = combine(
        repository.allWords,
        _searchQuery,
        _selectedSubject
    ) { words, query, subject ->
        var list = if (query.isBlank()) {
            words
        } else {
            // Simplistic search for now, better handled by FTS in Repository if needed
            words.filter { 
                it.englishWord.contains(query, ignoreCase = true) || 
                it.kannadaMeaning.contains(query, ignoreCase = true) 
            }
        }
        
        if (subject != "All") {
            list = list.filter { it.subject == subject }
        }
        list
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val savedWords: StateFlow<List<WordEntry>> = repository.savedWords
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedSubject(subject: String) {
        _selectedSubject.value = subject
    }

    fun toggleSave(word: WordEntry) {
        viewModelScope.launch {
            repository.toggleSave(word.id, !word.isSaved)
        }
    }
}

class WordViewModelFactory(private val repository: WordRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(WordViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return WordViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
