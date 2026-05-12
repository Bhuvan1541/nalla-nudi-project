/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

package com.nallanudi.app.util

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.*

class AndroidTTSManager(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech = TextToSpeech(context, this)
    private var isReady: Boolean = false

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(Locale.US)
            if (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED) {
                isReady = true
                tts.setSpeechRate(0.9f)
            }
        }
    }

    fun speak(text: String) {
        if (isReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
        }
    }

    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
