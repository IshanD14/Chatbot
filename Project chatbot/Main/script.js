const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage('You', message);
  input.value = '';

  // Show typing indicator
  const typingMsg = document.createElement('p');
  typingMsg.id = 'typing';
  typingMsg.innerHTML = `<strong>Bot:</strong> <em>typing...</em>`;
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: message,
        stream: false
      })
    });

    const data = await res.json();

    // Remove typing indicator
    typingMsg.remove();

    // Show actual response
    appendMessage('Bot', data.response || 'No response');
  } catch (err) {
    console.error(err);
    typingMsg.remove();
    appendMessage('Bot', '⚠️ Error connecting to Ollama');
  }
});

function appendMessage(sender, text) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}