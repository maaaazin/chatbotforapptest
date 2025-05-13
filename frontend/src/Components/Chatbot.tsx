import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions', // or HF endpoint
        {
          model: 'mistralai/mistral-7b-instruct', // or openchat/openchat-3.5
          messages: [
            ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: input }
          ]
        },
        {
          headers: {
            Authorization: `Bearer YOUR_API_KEY`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
          }
        }
      );

      const reply = res.data.choices[0].message.content;
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with Bot</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', color: msg.sender === 'user' ? 'blue' : 'green' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
        style={{ width: '80%', padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>Send</button>
    </div>
  );
};

export default Chatbot;
