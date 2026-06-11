"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useArticles, Article } from '../../lib/useArticles';
import CreateArticleModal from '../../components/CreateArticleModal';

export default function ArticleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId && typeof rawId === 'string' ? rawId : null;

  const { currentUser, addComment, deleteComment, editArticle, deleteArticle, fetchArticle } = useArticles();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      const fetched = await fetchArticle(id);
      setArticle(fetched);
    };
    init();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        setTimeout(() => router.push('/login?redirect=articles'), 500);
      } else {
        setIsLoggedIn(true);
        setIsLoading(false);
      }
    }
  }, [router, id]);

  if (!id) {
    return (
      <main className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="serif-font">Invalid or missing article ID</h2>
        <button onClick={() => router.push('/articles')} className="newsletter-btn" style={{ marginTop: '20px' }}>
          Back to Articles
        </button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!article || !isLoggedIn) {
    return (
      <main className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="serif-font">Article not found or you need to log in</h2>
        <button onClick={() => router.push('/articles')} className="newsletter-btn" style={{ marginTop: '20px' }}>
          Back to Articles
        </button>
      </main>
    );
  }

  // ---------- SIMPLE & ROBUST IMAGE URL ----------
  // Use the stored path as is – no automatic prefixing.
  // Works for: full URL, /uploads/..., /api/files/..., or plain filename.
  let imageUrl = article.image || '';
  // Only if it's a plain filename (no slashes, no http) we need to construct the API path.
  if (imageUrl && !imageUrl.includes('/') && !imageUrl.startsWith('http')) {
    imageUrl = `/api/files/${imageUrl}`;
  }
  // ----------------------------------------------

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (commentText.trim() && article) {
      const success = await addComment(article.id, commentText);
      if (success) {
        setCommentText('');
        const fetched = await fetchArticle(id);
        setArticle(fetched);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
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
          
          {currentUser && currentUser.userId === article.authorId && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}
              >
                Edit
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this article?")) {
                    const success = await deleteArticle(article.id);
                    if (success) router.push('/articles');
                  }
                }}
                style={{ padding: '8px 16px', border: '1px solid #d9534f', color: '#d9534f', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '40px' }}>
          <Image 
            src={imageUrl}
            alt={article.title}
            fill
            sizes="100vw"
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

      {/* Comment section unchanged */}
      <section style={{ maxWidth: '800px', margin: '60px auto 0 auto', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
        <h3 className="serif-font" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Comments ({article.comments?.length || 0})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {(!article.comments || article.comments.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No comments yet. Be the first to share your thoughts!</p>
          ) : (
            article.comments.map(comment => (
              <div key={comment.id} style={{ background: 'var(--light-gray)', padding: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.6' }}>{comment.text}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      By {comment.authorName} • {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  {currentUser && currentUser.userId === comment.authorId && (
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete comment?")) {
                          const success = await deleteComment(article.id, comment.id);
                          if (success) {
                            const fetched = await fetchArticle(id);
                            setArticle(fetched);
                          }
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#d9534f',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textDecoration: 'underline',
                        marginLeft: '10px'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {currentUser ? (
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
        ) : (
          <div style={{ background: 'var(--light-gray)', padding: '20px', textAlign: 'center', borderRadius: '4px' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
              Please log in to leave a comment
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="newsletter-btn"
              style={{ fontSize: '14px' }}
            >
              Log In
            </button>
          </div>
        )}
      </section>

      <CreateArticleModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onPublish={async (title, content, image) => {
          const success = await editArticle(article.id, title, content, image);
          if (success) {
            const fetched = await fetchArticle(id);
            setArticle(fetched);
            setIsEditModalOpen(false);
          }
        }}
        initialData={{ title: article.title, content: article.content, image: article.image }}
      />
    </main>
  );
}