"use client";

import { useState, useEffect } from 'react';

export type Comment = {
  id: string;
  text: string;
  date: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  comments: Comment[];
};

const initialArticles: Article[] = [
  {
    id: '1',
    title: 'A Weekend in Brighton',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: 'Admin',
    image: '/images/hero_brighton_1780171224798.png',
    comments: [
      { id: 'c1', text: 'Great article!', date: '2026-05-31' }
    ]
  },
  {
    id: '2',
    title: 'My Energizing Morning Routine',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    author: 'Jane Doe',
    image: '/images/cat_story_1780171397537.png',
    comments: []
  }
];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const currentUser = 'Admin'; // Mock current user

  useEffect(() => {
    const stored = localStorage.getItem('trendi_articles');
    if (stored) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setArticles(JSON.parse(stored));
    } else {
      setArticles(initialArticles);
      localStorage.setItem('trendi_articles', JSON.stringify(initialArticles));
    }
  }, []);

  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem('trendi_articles', JSON.stringify(newArticles));
  };

  const addArticle = (title: string, content: string, image: string) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      content,
      author: currentUser,
      image: image || '/images/cat_blog_1780171321862.png',
      comments: []
    };
    saveArticles([...articles, newArticle]);
  };

  const editArticle = (id: string, title: string, content: string, image: string) => {
    const newArticles = articles.map(a => a.id === id ? { ...a, title, content, image: image || a.image } : a);
    saveArticles(newArticles);
  };

  const deleteArticle = (id: string) => {
    const newArticles = articles.filter(a => a.id !== id);
    saveArticles(newArticles);
  };

  const addComment = (articleId: string, text: string) => {
    const newArticles = articles.map(a => {
      if (a.id === articleId) {
        return {
          ...a,
          comments: [...a.comments, { id: Date.now().toString(), text, date: new Date().toLocaleDateString() }]
        };
      }
      return a;
    });
    saveArticles(newArticles);
  };

  return {
    articles,
    currentUser,
    addArticle,
    editArticle,
    deleteArticle,
    addComment
  };
}
