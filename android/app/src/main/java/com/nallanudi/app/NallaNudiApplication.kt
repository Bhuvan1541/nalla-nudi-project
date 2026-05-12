/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app

import android.app.Application
import com.nallanudi.app.data.AppDatabase
import com.nallanudi.app.data.WordEntry
import com.nallanudi.app.data.WordRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class NallaNudiApplication : Application() {
    val database by lazy { AppDatabase.getDatabase(this) }
    val repository by lazy { WordRepository(database.glossaryDao()) }
    
    private val applicationScope = CoroutineScope(SupervisorJob())

    override fun onCreate() {
        super.onCreate()
        seedDatabaseIfNeeded()
    }

    private fun seedDatabaseIfNeeded() {
        applicationScope.launch {
            val words = repository.allWords.first()
            if (words.isEmpty()) {
                val seedData = listOf(
                    WordEntry(englishWord = "Photosynthesis", kannadaMeaning = "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Dyutisaṃślēṣaṇe)", explanationKannada = "ಸಸ್ಯಗಳು ಸೌರಶಕ್ತಿಯನ್ನು ಬಳಸಿಕೊಂಡು ಆಹಾರ ತಯಾರಿಸುವ ಪ್ರಕ್ರಿಯೆ. (Process by which plants use sunlight to make food.)", subject = "Science", pronunciation = "Fo-toh-sin-thuh-sis"),
                    WordEntry(englishWord = "Pythagoras Theorem", kannadaMeaning = "ಪೈಥಾಗೊರಸ್ ಪ್ರಮೇಯ (Paithāgoras Pramēya)", explanationKannada = "ಲಂಬಕೋನ ತ್ರಿಕೋನದಲ್ಲಿ ಅತಿ ಉದ್ದದ ಬಾಹುವಿನ ಮೇಲಿನ ವರ್ಗವು ಉಳಿದೆರಡು ಬಾಹುಗಳ ವರ್ಗಗಳ ಮೊತ್ತಕ್ಕೆ ಸಮನಾಗಿರುತ್ತದೆ. (In a right-angled triangle, the square of the hypotenuse is equal to the sum of squares of the other two sides.)", subject = "Mathematics", pronunciation = "Py-tha-gor-as Thee-rum"),
                    WordEntry(englishWord = "Gravity", kannadaMeaning = "ಗುರುತ್ವಾಕರ್ಷಣೆ (Gurutvakarṣhaṇe)", explanationKannada = "ವಸ್ತುಗಳನ್ನು ಭೂಮಿಯ ಕಡೆಗೆ ಎಳೆಯುವ ನೈಸರ್ಗಿಕ ಶಕ್ತಿ. (The force that attracts a body toward the center of the earth.)", subject = "Science", pronunciation = "Gra-vi-tee"),
                    WordEntry(englishWord = "Algebra", kannadaMeaning = "ಬೀಜಗಣಿತ (Bījagaṇita)", explanationKannada = "ಅಂಕೆಗಳ ಬದಲಿಗೆ ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ ಸಮಸ್ಯೆಗಳನ್ನು ಬಿಡಿಸುವ ಗಣಿತ ಪ್ರಕಾರ. (A branch of mathematics that handles symbols and rules for manipulating those symbols.)", subject = "Mathematics", pronunciation = "Al-jeh-brah"),
                    WordEntry(englishWord = "Atom", kannadaMeaning = "ಪರಮಾಣು (Paramāṇu)", explanationKannada = "ಯಾವುದೇ ವಸ್ತುವಿನ ಅತ್ಯಂತ ಸಣ್ಣ ಕಣ. (The smallest unit of ordinary matter that forms a chemical element.)", subject = "Science", pronunciation = "A-tum"),
                    WordEntry(englishWord = "Matrix", kannadaMeaning = "ಅಣಿಗೊಂಚಲು (Aṇigonchalu)", explanationKannada = "ಸಂಖ್ಯೆಗಳನ್ನು ಅಡ್ಡ ಮತ್ತು ಲಂಬ ಸಾಲುಗಳಲ್ಲಿ ಜೋಡಿಸಿರುವ ವ್ಯವಸ್ಥೆ. (A rectangular array of numbers, symbols, or expressions.)", subject = "Mathematics", pronunciation = "May-triks"),
                    WordEntry(englishWord = "Shares", kannadaMeaning = "ಷೇರುಗಳು (Śērugaḷu)", explanationKannada = "ಕಂಪನಿಯ ಮಾಲೀಕತ್ವದ ಒಂದು ಭಾಗ. (A part of the ownership of a company.)", subject = "Commerce", pronunciation = "Shayrz")
                )
                repository.insertAll(seedData)
            }
        }
    }
}
