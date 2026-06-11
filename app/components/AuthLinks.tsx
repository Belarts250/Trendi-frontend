"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CurrentUser = {
  userId: number;
  name: string;
  email: string;
} | null;

export default function AuthLinks() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<CurrentUser>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
          } catch (e) {
            console.error('Failed to parse user:', e);
          }
        }
      }
    };

    checkAuth();

    // Listen for storage changes (logout from another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  if (isLoggedIn && user) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          title={user.name}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#decde4',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {firstLetter}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.2' }}>
            {user.name}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            {user.email.split('@')[0]}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '12px',
            borderRadius: '4px',
            marginLeft: '15px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--light-gray)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Logout
        </button>
      </div>)
  }

  return (
    <>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </>
  );
}
