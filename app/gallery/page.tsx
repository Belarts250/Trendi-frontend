"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const images = [
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

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="container">
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h1 className="serif-font" style={{ fontSize: '3rem' }}>Gallery</h1>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px' }}>
          Visual stories and moments
        </p>
      </div>

      <div className="gallery-masonry">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => setSelectedImage(src)}
          >
            {/* Using standard img for masonry compatibility since Next Image requires fixed heights or fill which disrupts masonry */}
            <img src={src} alt={`Gallery image ${index + 1}`} />
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
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '80vh' }}>
            <Image 
              src={selectedImage}
              alt="Full screen view"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
