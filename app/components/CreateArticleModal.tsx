"use client";

import React, { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (title: string, content: string, image: File | null) => void;
  initialData?: { title: string; content: string; image: string };
};

export default function CreateArticleModal({ isOpen, onClose, onPublish, initialData }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCurrentImage(initialData.image);
      setImageFile(null);
    } else {
      setTitle('');
      setContent('');
      setCurrentImage(null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(title, content, imageFile);
    setTitle('');
    setContent('');
    setImageFile(null);
    setCurrentImage(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      setCurrentImage(null); // Clear current image when new one is selected
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
        position: 'relative', maxHeight: '90vh', overflowY: 'auto'
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
            
            {imageFile && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Preview (new image):</p>
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                />
              </div>
            )}
            
            {currentImage && !imageFile && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Current image:</p>
                <img 
                  src={currentImage.startsWith('/') ? currentImage : `/${currentImage}`} 
                  alt="Current" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                />
              </div>
            )}
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
