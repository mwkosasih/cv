/**
 * Backend Server & Gemini AI Status Module
 */
const AppStatus = {
  hasGeminiKey: false,

  async checkServerStatus(chatStatusSubtext, chatHeaderStatus) {
    try {
      const res = await fetch(AppConfig.endpoints.status);
      if (res.ok) {
        const data = await res.json();
        this.hasGeminiKey = data.has_gemini_key;

        if (this.hasGeminiKey) {
          if (chatStatusSubtext) {
            chatStatusSubtext.textContent = `Powered by Google Gemini (${data.model})`;
          }
        } else {
          if (chatStatusSubtext) {
            chatStatusSubtext.textContent =
              'Knowledge Base Mode (Set GEMINI_API_KEY in .env for generative AI)';
          }
        }

        if (chatHeaderStatus) {
          chatHeaderStatus.innerHTML = '<span class="online-badge"></span> Active';
        }
      }
    } catch (err) {
      console.warn('Could not fetch server status:', err);
    }
  },
};
