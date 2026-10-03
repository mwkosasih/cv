/**
 * AI Twin Chat Module
 */
const AppChat = {
  history: [],
  isWaitingForResponse: false,

  // Append a chat message bubble
  appendMessage(chatBody, role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    if (role === 'user') {
      bubbleDiv.textContent = text;
    } else {
      bubbleDiv.innerHTML = AppUtils.formatMarkdown(text);
    }

    const timeDiv = document.createElement('span');
    timeDiv.className = 'msg-time';
    timeDiv.textContent = AppUtils.getFormattedTime();

    msgDiv.appendChild(bubbleDiv);
    msgDiv.appendChild(timeDiv);

    chatBody.appendChild(msgDiv);
    AppUtils.scrollToBottom(chatBody);
  },

  // Display animated typing indicator
  showTypingIndicator(chatBody) {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatBody.appendChild(indicator);
    AppUtils.scrollToBottom(chatBody);
    return indicator;
  },

  // Remove typing indicator
  removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  },

  // Send user message to Go backend
  async sendMessage(message, chatBody, chatInput) {
    if (this.isWaitingForResponse || !message) return;

    // 1. Append user bubble
    this.appendMessage(chatBody, 'user', message);
    if (chatInput) chatInput.value = '';
    this.isWaitingForResponse = true;

    // 2. Show typing indicator
    const typingIndicator = this.showTypingIndicator(chatBody);

    // 3. Prepare recent history payload
    const historyPayload = this.history
      .slice(-AppConfig.maxHistoryLength)
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text,
      }));

    // 4. Send HTTP request
    try {
      const response = await fetch(AppConfig.endpoints.chat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: historyPayload,
        }),
      });

      this.removeTypingIndicator(typingIndicator);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I couldn't process that response.";

      // 5. Append bot bubble
      this.appendMessage(chatBody, 'bot', replyText);

      // 6. Record to session history
      this.history.push({ role: 'user', text: message });
      this.history.push({ role: 'model', text: replyText });
    } catch (err) {
      console.error('Chat error:', err);
      this.removeTypingIndicator(typingIndicator);
      this.appendMessage(
        chatBody,
        'bot',
        'Sorry, I encountered an issue connecting to the backend. Please check your connection or server logs.'
      );
    } finally {
      this.isWaitingForResponse = false;
      AppUtils.scrollToBottom(chatBody);
    }
  },

  // Setup suggestion chip clicks
  setupSuggestions(chips, chatBody, chatInput) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
        this.sendMessage(text, chatBody, chatInput);
      });
    });
  },
};
