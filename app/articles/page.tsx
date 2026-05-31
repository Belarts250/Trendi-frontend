"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useArticles } from '../lib/useArticles';
import CreateArticleModal from '../components/CreateArticleModal';

export default function ArticlesPage() {
  const { articles, currentUser, addArticle, editArticle, deleteArticle } = useArticles();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const handlePublish = (title: string, content: string, image: string) => {
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

  return (
    <main className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
        <h2 className="serif-font" style={{ fontSize: '2.5rem', margin: 0 }}>All Articles</h2>
        <button 
          className="newsletter-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Article
        </button>
      </div>

      <div className="categories-grid">
        {articles.map(article => (
          <div key={article.id} className="category-item" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/articles/${article.id}`} style={{ position: 'relative', width: '100%', aspectRatio: '4/3', display: 'block' }}>
              <Image 
                src={article.image} 
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
              
              {currentUser === article.author && (
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

      <CreateArticleModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseModal}
        onPublish={handlePublish}
        initialData={editingArticle ? { title: editingArticle.title, content: editingArticle.content, image: editingArticle.image } : undefined}
      />
    </main>
  );
}
