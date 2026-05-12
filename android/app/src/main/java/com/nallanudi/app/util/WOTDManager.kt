/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app.util

import android.content.Context
import android.content.SharedPreferences
import com.nallanudi.app.data.WordEntry
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class WOTDManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("nalla_nudi_wotd", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun getWordOfTheDay(allWords: List<WordEntry>): WordEntry {
        val today = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date())
        val storedDate = prefs.getString("wotd_date", "")
        val storedId = prefs.getInt("wotd_id", -1)

        // Return if already set for today
        if (storedDate == today && storedId != -1) {
            allWords.find { it.id == storedId }?.let { return it }
        }

        // Load history
        val historyJson = prefs.getString("wotd_history", "[]")
        val historyType = object : TypeToken<List<Int>>() {}.type
        var history: List<Int> = gson.fromJson(historyJson, historyType)

        // Filter out recent words
        var available = allWords.filter { it.id !in history }
        if (available.isEmpty()) {
            available = allWords
            history = emptyList()
        }

        val selected = available.random()

        // Update history (max 7)
        val newHistory = (listOf(selected.id) + history).take(7)
        
        prefs.edit().apply {
            putString("wotd_date", today)
            putInt("wotd_id", selected.id)
            putString("wotd_history", gson.toJson(newHistory))
            apply()
        }

        return selected
    }
}
