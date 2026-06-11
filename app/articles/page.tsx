"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useArticles } from '../lib/useArticles';
import CreateArticleModal from '../components/CreateArticleModal';

export default function ArticlesPage() {
  const { articles, currentUser, addArticle, editArticle, deleteArticle, fetchArticles, totalPages, currentPage, sortBy, sortDir } = useArticles();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login after a short delay for better UX
          setTimeout(() => {
            router.push('/login?redirect=articles');
          }, 500);
        } else {
          setIsLoading(false);
        }
      };

      checkAuth();
    }
  }, [router]);

  const handleCreateClick = () => {
    if (!currentUser) {
      router.push('/login');
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handlePublish = (title: string, content: string, image: File | null) => {
    if (editingArticleId) {
      editArticle(editingArticleId, title, content, image);
      setEditingArticleId(null);
    } else {
      addArticle(title, content, image);
    }
  };

  const openEditModal = (id: string) => {
    setEditingArticleId(id);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingArticleId(null);
  };

  const editingArticle = articles.find(a => a.id === editingArticleId);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchArticles(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      fetchArticles(currentPage - 1);
    }
  };

  const canEditOrDelete = (authorId: number) => {
    return currentUser && currentUser.userId === authorId;
  };

  if (isLoading) {
    return (
      <main className="container" style={{ paddingBottom: '60px', paddingTop: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
        <h2 className="serif-font" style={{ fontSize: '2.5rem', margin: 0 }}>All Articles</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            value={`${sortBy}-${sortDir}`} 
            onChange={(e) => {
              const [newSortBy, newSortDir] = e.target.value.split('-');
              fetchArticles(0, 6, newSortBy, newSortDir);
            }}
            style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
          <button 
            className="newsletter-btn"
            onClick={handleCreateClick}
          >
            Create Article
          </button>
        </div>
      </div>

      <div className="categories-grid">
        {articles.map(article => (
          <div key={article.id} className="category-item" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/articles/${article.id}`} style={{ position: 'relative', width: '100%', aspectRatio: '4/3', display: 'block' }}>
              <Image 
                src={article.image.startsWith('/') || article.image.startsWith('http') ? article.image : `/api/files/${article.image}`} 
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Link>
            <div style={{ padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href={`/articles/${article.id}`}>
                <h3 className="serif-font" style={{ margin: 0, fontSize: '1.2rem' }}>{article.title}</h3>
              </Link>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>By {article.author}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {article.comments?.length || 0} {article.comments?.length === 1 ? 'comment' : 'comments'}
              </p>
              
              {canEditOrDelete(article.authorId) && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => openEditModal(article.id)}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '5px 10px', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteArticle(article.id)}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '5px 10px', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', color: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 0} 
          style={{ 
            padding: '10px 20px', 
            background: currentPage === 0 ? 'var(--light-gray)' : 'var(--foreground)',
            color: currentPage === 0 ? 'var(--text-muted)' : 'var(--background)',
            border: 'none',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '12px'
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '14px' }}>Page {currentPage + 1} of {Math.max(1, totalPages)}</span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage >= totalPages - 1} 
          style={{ 
            padding: '10px 20px', 
            background: currentPage >= totalPages - 1 ? 'var(--light-gray)' : 'var(--foreground)',
            color: currentPage >= totalPages - 1 ? 'var(--text-muted)' : 'var(--background)',
            border: 'none',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '12px'
          }}
        >
          Next
        </button>
      </div>

      <CreateArticleModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal}
        onPublish={handlePublish}
        initialData={editingArticle ? { title: editingArticle.title, content: editingArticle.content, image: editingArticle.image } : undefined}
      />
    </main>
  );
}
