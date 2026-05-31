"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useArticles } from '../../lib/useArticles';

export default function ArticleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { articles, addComment } = useArticles();
  
  const [commentText, setCommentText] = useState('');

  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <main className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="serif-font">Article not found</h2>
        <button onClick={() => router.push('/articles')} className="newsletter-btn" style={{ marginTop: '20px' }}>
          Back to Articles
        </button>
      </main>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(article.id, commentText);
      setCommentText('');
    }
  };

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            By {article.author}
          </p>
          <h1 className="serif-font" style={{ fontSize: '3rem', margin: '10px 0 30px 0' }}>{article.title}</h1>
        </div>
        
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '40px' }}>
          <Image 
            src={article.image}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '16px' }}>
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '20px' }}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* Comment Section */}
      <section style={{ maxWidth: '800px', margin: '60px auto 0 auto', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
        <h3 className="serif-font" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Anonymous Comments</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {article.comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No comments yet. Be the first to share your thoughts!</p>
          ) : (
            article.comments.map(comment => (
              <div key={comment.id} style={{ background: 'var(--light-gray)', padding: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.6' }}>{comment.text}</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Anonymous • {comment.date}
                </p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4 className="serif-font" style={{ fontSize: '1.4rem', margin: 0 }}>Leave a comment</h4>
          <textarea 
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={4}
            style={{ 
              border: '1px solid var(--border-color)', padding: '15px', 
              fontFamily: 'Montserrat, sans-serif', fontSize: '14px', width: '100%', boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
          <button type="submit" className="newsletter-btn" style={{ alignSelf: 'flex-start' }}>
            Post Comment
          </button>
        </form>
      </section>
    </main>
  );
}
