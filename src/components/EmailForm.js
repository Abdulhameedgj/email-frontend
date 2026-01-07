import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [toEmail, setToEmail] = useState('');
  const [matter, setMatter] = useState('');
  const [tone, setTone] = useState('formal');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const handleGenerate = async () => {
    if (!matter.trim()) {
      alert('Please enter the message matter.');
      return;
    }

    setIsLoading(true);
    setSubject('');
    setBody('');
    setSendStatus('');

    try {
      const response = await axios.post('http://localhost:5000/generate-email', {
        matter,
        tone,
      });

      setSubject(response.data.subject);
      setBody(response.data.body);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!toEmail.trim() || !subject || !body) {
      alert('Please complete all fields before sending the email.');
      return;
    }

    setSendStatus('');

    try {
      await axios.post('http://localhost:5000/send-email', {
        to: toEmail,
        subject,
        body,
      });

      setSendStatus('✅ Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      setSendStatus('❌ Failed to send email.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Email Creator form</h2>

      <label>To Email:</label>
      <input
        type="email"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="recipient@example.com"
      />

      <label>Matter (What do you want to say?)</label>
      <textarea
        value={matter}
        onChange={(e) => setMatter(e.target.value)}
        rows={5}
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="e.g., I will be late for tomorrow's meeting..."
      />

      <label>Select Tone:</label>
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="radio"
            value="formal"
            checked={tone === 'formal'}
            onChange={() => setTone('formal')}
          />{' '}
          Formal
        </label>{' '}
        <label>
          <input
            type="radio"
            value="semi-formal"
            checked={tone === 'semi-formal'}
            onChange={() => setTone('semi-formal')}
          />{' '}
          Semi-Formal
        </label>{' '}
        <label>
          <input
            type="radio"
            value="casual"
            checked={tone === 'casual'}
            onChange={() => setTone('casual')}
          />{' '}
          Casual
        </label>
      </div>

      <button onClick={handleGenerate} disabled={isLoading} style={{ marginBottom: '20px' }}>
        {isLoading ? 'Generating...' : 'Generate Email'}
      </button>

      {subject && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h3>📧 Suggested Subject:</h3>
            <p><strong>{subject}</strong></p>

            <h3>✉️ Email Body:</h3>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '10px' }}>
              {body}
            </pre>

            <button onClick={handleSend} style={{ marginTop: '10px' }}>
              Send Email
            </button>
          </div>
        </>
      )}

      {sendStatus && (
        <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{sendStatus}</p>
      )}
    </div>
  );
};

export default EmailForm;
