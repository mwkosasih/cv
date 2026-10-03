/**
 * Formatting & DOM Utility Helpers
 */
const AppUtils = {
  // Format message time
  getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  // Scroll element to bottom
  scrollToBottom(element) {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  },

  // Lightweight Markdown parser for clean message formatting
  formatMarkdown(text) {
    if (!text) return '';

    // Escape raw HTML entities
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links [text](url)
    escaped = escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Lists with bullets
    const lines = escaped.split('\n');
    let inList = false;
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (trimmed === '') {
          processedLines.push('<br>');
        } else {
          processedLines.push(`<p>${line}</p>`);
        }
      }
    }

    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('');
  },
};
