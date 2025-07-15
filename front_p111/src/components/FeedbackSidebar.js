import React, { useState } from 'react';
import axios from 'axios';

export default function FeedbackSidebar({ username }) {
  const [feedback, setFeedback] = useState('');

  const kirimFeedback = async () => {
    if (!feedback) return alert('Isi feedback dulu!');
    await axios.post('http://localhost:5000/api/feedback', {
      username,
      message: feedback,
      created_at: new Date()
    });
    alert('Feedback terkirim!');
    setFeedback('');
  };

  return (
    <div>
      <h6>💬 Kirim Feedback</h6>
      <textarea
        className="form-control mb-2"
        rows="3"
        placeholder="Tulis pesan..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button className="btn btn-sm btn-info w-100" onClick={kirimFeedback}>Kirim</button>
    </div>
  );
}
