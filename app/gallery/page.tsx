"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useArticles } from '../lib/useArticles';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { articles } = useArticles();
  const router = useRouter();

  // Static images
  const staticImages = [
    '/images/insta_1_1780171550440.png',
    '/images/insta_2_1780171615389.png',
    '/images/cat_blog_1780171321862.png',
    '/images/hero_brighton_1780171224798.png',
    '/images/insta_3_1780171747469.png',
    '/images/insta_4_1780171822154.png',
    '/images/cat_story_1780171397537.png',
    '/images/insta_5_1780171898647.png',
    '/images/cat_shop_1780171439347.png',
    '/images/insta_6_1780172044697.png'
  ];

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login after a short delay for better UX
          setTimeout(() => {
            router.push('/login?redirect=gallery');
          }, 500);
        } else {
          setIsLoading(false);
        }
      };

      checkAuth();
    }
  }, [router]);

  // Combine article images with static images
  const allImages = [
    ...articles
      .filter(article => article.image && !article.image.includes('images/'))
      .map(article => article.image),
    ...staticImages
  ];

  // Remove duplicates
  const uniqueImages = Array.from(new Set(allImages));

  if (isLoading) {
    return (
      <main className="container" style={{ paddingBottom: '60px', paddingTop: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h1 className="serif-font" style={{ fontSize: '3rem' }}>Gallery</h1>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px' }}>
          Visual stories and moments
        </p>
      </div>

      <div className="gallery-masonry">
        {uniqueImages.map((src, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => setSelectedImage(src)}
          >
            {/* Using standard img for masonry compatibility since Next Image requires fixed heights or fill which disrupts masonry */}
            <img 
              src={src.startsWith('/') ? src : `/${src}`} 
              alt={`Gallery image ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img
              src={selectedImage.startsWith('/') ? selectedImage : `/${selectedImage}`}
              alt="Full view"
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                fontSize: '24px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
