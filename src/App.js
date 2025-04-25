import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = new URLSearchParams(window.location.search).get('ref') || 'guest';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const userData = await axios.get(`https://lazy-lord-backend-2.onrender.com/user/${ref}`);
      const { tokens = 0, recruits = 0 } = userData.data;

      const prompt = `👑 Welcome Lazy Lord ${ref}.\nYou have ${tokens} tokens and ${recruits} loyal clones.\n\nUser message: "${input}".\nRespond as if you are their empire advisor.`;

      const response = await axios.post('https://lazy-lord-proxy.onrender.com/api/openai', { prompt });

      const botReply = { role: 'bot', content: response.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'bot', content: '⚠️ An error occurred. Please try again.' }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>👑 Lazy Lord Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <b>{msg.role === 'user' ? 'You' : 'LazyBot'}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
           if (e.key === 'Enter') {
               e.preventDefault();
               sendMessage();
           }
      }}
      placeholder="Type your command..."
      style={{ width: '80%', padding: '0.5rem' }}
/>

      <button onClick={sendMessage} style={{ padding: '0.5rem', marginLeft: '1rem' }} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}

export default App;
