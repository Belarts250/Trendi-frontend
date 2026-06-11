"use client";

import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        // Try to parse JSON success response, but fallback gracefully
        let successMsg = 'Thank you for reaching out! We will respond within 10 minutes.';
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          try {
            const data = await response.json();
            successMsg = data.message || successMsg;
          } catch {
            // If JSON parsing fails, keep default success message
          }
        } else {
          // If response is not JSON, just read as text (or ignore)
          await response.text(); // consume body to avoid memory leak, but not needed
        }
        setSuccessMessage(successMsg);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        // Handle error responses safely
        let errorMsg = `Request failed with status ${response.status}`;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch (jsonError) {
            // JSON was invalid or empty – fall back to text
            const text = await response.text();
            if (text) errorMsg = text;
          }
        } else {
          // Not JSON – get raw text
          const text = await response.text();
          if (text) errorMsg = text;
        }
        
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please check your connection and try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>Contact</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center' }}>Get in touch with us. We read every message.</p>
        
        {successMessage && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ 
              padding: '15px', 
              border: '1px solid var(--border-color)', 
              fontFamily: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box'
            }} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: '15px', 
              border: '1px solid var(--border-color)', 
              fontFamily: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box'
            }} 
          />
          <textarea 
            placeholder="Message" 
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            style={{ 
              padding: '15px', 
              border: '1px solid var(--border-color)', 
              fontFamily: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          <button 
            type="submit"
            disabled={isLoading}
            style={{ 
              padding: '15px', 
              background: isLoading ? 'var(--text-muted)' : 'var(--foreground)', 
              color: 'white', 
              border: 'none', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontFamily: 'inherit', 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              fontSize: '14px',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}