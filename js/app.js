/**
 * Application Bootstrap & Dynamic Partials Loader
 */

// Load and inject all HTML partials asynchronously
async function loadPartials() {
  const containers = document.querySelectorAll('[data-include]');
  if (containers.length === 0) return;

  const tasks = Array.from(containers).map(async (container) => {
    const file = container.getAttribute('data-include');
    if (!file) return;
    try {
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        container.outerHTML = html;
      } else {
        console.error(`Failed to load ${file}: HTTP ${response.status}`);
      }
    } catch (err) {
      console.error(`Error fetching partial ${file}:`, err);
    }
  });

  await Promise.all(tasks);
}

// Initialize chat widget, event bindings, and server status
function initApp() {
  const chatBtn = document.getElementById('chatFloatingBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMinimizeBtn = document.getElementById('chatMinimizeBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const chatStatusSubtext = document.getElementById('chatStatusSubtext');
  const chatHeaderStatus = document.getElementById('chatHeaderStatus');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Open chat window
  function openChat() {
    if (!chatWindow) return;
    chatWindow.classList.add('open');
    if (chatBtn) chatBtn.style.display = 'none';
    if (chatInput) chatInput.focus();
    AppUtils.scrollToBottom(chatBody);
  }

  // Close chat window
  function closeChat() {
    if (!chatWindow) return;
    chatWindow.classList.remove('open');
    if (chatBtn) chatBtn.style.display = 'flex';
  }

  // Event Listeners
  if (chatBtn) chatBtn.addEventListener('click', openChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);
  if (chatMinimizeBtn) chatMinimizeBtn.addEventListener('click', closeChat);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow && chatWindow.classList.contains('open')) {
      closeChat();
    }
  });

  // Suggestion chips
  if (suggestionChips.length > 0) {
    AppChat.setupSuggestions(suggestionChips, chatBody, chatInput);
  }

  // Form submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;
      AppChat.sendMessage(message, chatBody, chatInput);
    });
  }

  // Check initial server and Gemini status
  AppStatus.checkServerStatus(chatStatusSubtext, chatHeaderStatus);
}

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadPartials();
  initApp();
});
