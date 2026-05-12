/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Web Speech API Service
 * Handles Text-to-Speech (TTS) and Speech recognition for the browser.
 */

class WebSpeechService {
  private synth: SpeechSynthesis;
  private recognition: any = null;

  constructor() {
    this.synth = window.speechSynthesis;
    
    // Initialize Web Speech Recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  /**
   * Speak text using Web Speech API (TTS)
   */
  speak(text: string, lang: string = 'en-US') {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    this.synth.speak(utterance);
  }

  /**
   * Start listening for voice input
   */
  startListening(onResult: (text: string) => void, onError: (err: string) => void, onStateChange: (listening: boolean) => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.onstart = () => onStateChange(true);
    this.recognition.onend = () => onStateChange(false);
    this.recognition.onerror = (event: any) => onError(event.error);
    
    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      onResult(result);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Recognition error:', e);
      onError('Failed to start recognition');
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechService = new WebSpeechService();
