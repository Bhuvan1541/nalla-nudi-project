/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/* 
  Kotlin Room Database Implementation for Android 
  Updated with FTS4 for high-performance fuzzy-like search.
*/

package com.nallanudi.app.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

// 1. Entity Definition
@Entity(
    tableName = "glossary_words"
)
data class WordEntry(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    @ColumnInfo(name = "english_word") val englishWord: String,
    @ColumnInfo(name = "kannada_meaning") val kannadaMeaning: String,
    @ColumnInfo(name = "explanation_kannada") val explanationKannada: String,
    @ColumnInfo(name = "subject") val subject: String,
    @ColumnInfo(name = "pronunciation") val pronunciation: String? = null,
    @ColumnInfo(name = "is_saved") val isSaved: Boolean = false
)

// 2. FTS4 Entity for High-Performance Search
@Entity(tableName = "words_fts")
@Fts4(contentEntity = WordEntry::class)
data class WordFts(
    @ColumnInfo(name = "english_word") val englishWord: String,
    @ColumnInfo(name = "kannada_meaning") val kannadaMeaning: String
)

// 3. DAO Interface
@Dao
interface GlossaryDao {
    @Query("SELECT * FROM glossary_words ORDER BY english_word ASC")
    fun getAllWords(): Flow<List<WordEntry>>

    // High performance search using FTS
    @Query("""
        SELECT * FROM glossary_words 
        WHERE rowid IN (
            SELECT rowid FROM words_fts 
            WHERE words_fts MATCH :query
        )
    """)
    fun searchWord(query: String): Flow<List<WordEntry>>

    // Instant prefix suggestions
    @Query("SELECT * FROM glossary_words WHERE english_word LIKE :prefix || '%' LIMIT 5")
    fun getSuggestions(prefix: String): Flow<List<WordEntry>>

    @Query("SELECT * FROM glossary_words WHERE subject = :subject")
    fun getWordsBySubject(subject: String): Flow<List<WordEntry>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(words: List<WordEntry>)

    @Query("UPDATE glossary_words SET is_saved = :isSaved WHERE id = :wordId")
    suspend fun updateSavedStatus(wordId: Int, isSaved: Boolean)

    @Query("SELECT * FROM glossary_words WHERE is_saved = 1")
    fun getSavedWords(): Flow<List<WordEntry>>
}

// 4. Database definition
@Database(entities = [WordEntry::class, WordFts::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun glossaryDao(): GlossaryDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: android.content.Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "nalla_nudi_database"
                )
                .fallbackToDestructiveMigration() // For dev purposes
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
