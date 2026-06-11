"use client";

import { useState, useEffect } from 'react';

export type Comment = {
  id: string;
  text: string;
  authorName: string;
  authorId: number;
  createdAt: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: number;
  image: string;
  comments: Comment[];
  createdAt: string;
};

export type CurrentUser = {
  userId: number;
  name: string;
  email: string;
} | null;

// ✅ Set your backend base URL (Spring Boot runs on port 8080)
const BACKEND_BASE_URL = 'http://localhost:8080';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<string>('desc');

  const getHeaders = (isMultipart = false) => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const loadCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e);
        }
      }
    }
  };

  useEffect(() => {
    loadCurrentUser();
    fetchArticles();
  }, []);

  // Helper to construct absolute image URL
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/images/cat_blog_1780171321862.png';
    // If it's already an absolute URL (http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, prepend backend base URL (assumes imagePath starts with /uploads/)
    return `${BACKEND_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const fetchArticles = async (page: number = 0, size: number = 6, sortField: string = sortBy, sortDirection: string = sortDir) => {
    try {
      const res = await fetch(`/api/articles?page=${page}&size=${size}&sortBy=${sortField}&sortDir=${sortDirection}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        const articlesArray = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
        
        const mapped = articlesArray.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          content: item.content,
          author: item.authorName || 'Unknown',
          authorId: item.authorId,
          image: getImageUrl(item.imagePath),   // ✅ Use absolute URL
          createdAt: item.createdAt,
          comments: (item.comments || []).map((comment: any) => ({
            id: comment.id.toString(),
            text: comment.text,
            authorName: comment.authorName || 'Anonymous',
            authorId: comment.authorId,
            createdAt: comment.createdAt
          }))
        }));
        setArticles(mapped);
        
        if (data.totalPages !== undefined) {
          setTotalPages(data.totalPages);
          setCurrentPage(data.number);
          setSortBy(sortField);
          setSortDir(sortDirection);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch articles:', err);
    }
  };

  const addArticle = async (title: string, content: string, image: File | null) => {
    try {
      const formData = new FormData();
      
      const articleDto = { title, content };
      formData.append("article", new Blob([JSON.stringify(articleDto)], {
        type: "application/json"
      }));

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (res.ok) {
        await fetchArticles(currentPage);
      } else {
        let errorMessage = 'Failed to create article';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        console.error('Error creating article:', errorMessage);
        alert(errorMessage);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection.');
    }
  };

  const editArticle = async (id: string, title: string, content: string, image: File | null) => {
    try {
      const formData = new FormData();
      
      const articleDto = { title, content };
      formData.append("article", new Blob([JSON.stringify(articleDto)], {
        type: "application/json"
      }));

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return false;
      }

      if (res.ok) {
        await fetchArticles(currentPage);
        return true;
      } else {
        let errorMessage = 'Failed to update article';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        console.error('Error updating article:', errorMessage);
        alert(errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please try again.');
      return false;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return false;
      }
      
      if (res.ok) {
        fetchArticles(currentPage);
        return true;
      } else {
        let errorMessage = 'Failed to delete article';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        console.error('Error deleting article:', errorMessage);
        alert(errorMessage);
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addComment = async (articleId: string, text: string) => {
    try {
      if (!currentUser) {
        console.error('User not logged in');
        return false;
      }

      const res = await fetch(`/api/comments/article/${articleId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return false;
      }

      if (res.ok) {
        fetchArticles(currentPage);
        return true;
      } else {
        let errorMessage = 'Failed to add comment';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        console.error('Error adding comment:', errorMessage);
        alert(errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  const deleteComment = async (articleId: string, commentId: string) => {
    try {
      if (!currentUser) {
        console.error('User not logged in');
        return false;
      }

      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return false;
      }

      if (res.ok) {
        fetchArticles(currentPage);
        return true;
      } else {
        let errorMessage = 'Failed to delete comment';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) errorMessage = text;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        console.error('Error deleting comment:', errorMessage);
        alert(errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      return false;
    }
  };

  const fetchArticle = async (id: string): Promise<Article | null> => {
    try {
      const res = await fetch(`/api/articles/${id}`, { headers: getHeaders() });
      if (res.ok) {
        const item = await res.json();
        return {
          id: item.id.toString(),
          title: item.title,
          content: item.content,
          author: item.authorName || 'Unknown',
          authorId: item.authorId,
          image: getImageUrl(item.imagePath),   // ✅ Use absolute URL
          createdAt: item.createdAt,
          comments: (item.comments || []).map((comment: any) => ({
            id: comment.id.toString(),
            text: comment.text,
            authorName: comment.authorName || 'Anonymous',
            authorId: comment.authorId,
            createdAt: comment.createdAt
          }))
        };
      }
    } catch (err) {
      console.warn('Failed to fetch articles:', err);
    }
    return null;
  };

  return {
    articles,
    currentUser,
    addArticle,
    editArticle,
    deleteArticle,
    addComment,
    deleteComment,
    fetchArticles,
    fetchArticle,
    totalPages,
    currentPage,
    sortBy,
    sortDir
  };
}