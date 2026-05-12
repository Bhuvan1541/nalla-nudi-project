/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Share Service
 * Handles sharing text, words, and progress using the Web Share API.
 */

class ShareService {
  /**
   * Share content using the Web Share API if available
   */
  async share(data: { title: string; text: string; url?: string }) {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        const shareText = `${data.title}\n\n${data.text}${data.url ? `\n\n${data.url}` : ''}`;
        await navigator.clipboard.writeText(shareText);
        alert('Share not supported on this browser. Text copied to clipboard!');
        return true;
      } catch (error) {
        console.error('Clipboard error:', error);
        return false;
      }
    }
  }

  /**
   * Share progress stats
   */
  async shareProgress(stats: { streak: number; wordsLearned: number; level: number }) {
    return this.share({
      title: 'My Progress on Nalla Nudi',
      text: `I'm learning technical English-Kannada vocabulary on Nalla Nudi!\n\n🔥 Streak: ${stats.streak} Days\n📚 Words Learned: ${stats.wordsLearned}\n⭐ Level: ${stats.level}\n\nJoin me in mastering technical language in Kannada!`,
      url: window.location.origin
    });
  }

  /**
   * Share a specific word
   */
  async shareWord(word: string, meaning: string) {
    return this.share({
      title: `Word of the Day: ${word}`,
      text: `Learned a new word on Nalla Nudi today!\n\nWord: ${word}\nKannada Meaning: ${meaning}\n\nEnhance your technical vocabulary with Nalla Nudi.`,
      url: window.location.origin
    });
  }
}

export const shareService = new ShareService();
