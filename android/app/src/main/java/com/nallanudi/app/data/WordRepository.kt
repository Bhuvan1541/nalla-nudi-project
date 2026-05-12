/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app.data

import kotlinx.coroutines.flow.Flow

class WordRepository(private val glossaryDao: GlossaryDao) {

    val allWords: Flow<List<WordEntry>> = glossaryDao.getAllWords()
    val savedWords: Flow<List<WordEntry>> = glossaryDao.getSavedWords()

    fun searchWords(query: String): Flow<List<WordEntry>> {
        return glossaryDao.searchWord(query)
    }

    fun getSuggestions(prefix: String): Flow<List<WordEntry>> {
        return glossaryDao.getSuggestions(prefix)
    }

    fun getWordsBySubject(subject: String): Flow<List<WordEntry>> {
        return glossaryDao.getWordsBySubject(subject)
    }

    suspend fun insertAll(words: List<WordEntry>) {
        glossaryDao.insertAll(words)
    }

    suspend fun toggleSave(wordId: Int, isSaved: Boolean) {
        glossaryDao.updateSavedStatus(wordId, isSaved)
    }
}
