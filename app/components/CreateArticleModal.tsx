"use client";

import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (title: string, content: string, image: string) => void;
  initialData?: { title: string; content: string; image: string };
};

export default function CreateArticleModal({ isOpen, onClose, onPublish, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [image, setImage] = useState(initialData?.image || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(title, content, image);
    if (!initialData) {
      setTitle('');
      setContent('');
      setImage('');
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Fake file upload by using a default image if a file is selected
    if (e.target.files && e.target.files.length > 0) {
      setImage('/images/cat_blog_1780171321862.png');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--background)', padding: '40px', width: '100%', maxWidth: '600px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          &times;
        </button>
        <h2 className="serif-font" style={{ marginTop: 0, marginBottom: '20px' }}>
          {initialData ? 'Edit Article' : 'Create Article'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="Article Title" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ 
              border: '1px solid var(--border-color)', padding: '15px', 
              fontFamily: 'Montserrat, sans-serif', fontSize: '14px', width: '100%', boxSizing: 'border-box'
            }} 
          />
          <textarea 
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={8}
            style={{ 
              border: '1px solid var(--border-color)', padding: '15px', 
              fontFamily: 'Montserrat, sans-serif', fontSize: '14px', width: '100%', boxSizing: 'border-box',
              resize: 'vertical'
            }} 
          />
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Choose Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button 
            type="submit"
            className="newsletter-btn" 
            style={{ width: '100%', padding: '15px' }}
          >
            {initialData ? 'Save Changes' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}
