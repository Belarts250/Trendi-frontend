import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px',
      backgroundImage: `url('https://media.istockphoto.com/id/1300384615/photo/string-light-bulbs-at-sunset.jpg?s=612x612&w=0&k=20&c=N695nAFz9YSNxynM3auPznfA3E6wXc8D6P60bN1MaEk=')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{
        background: 'var(--background)',
        width: '100%',
        maxWidth: '500px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Welcome Back</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            style={{ 
              border: '1px solid var(--border-color)', 
              padding: '15px', 
              fontFamily: 'Montserrat, sans-serif', 
              fontSize: '14px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            style={{ 
              border: '1px solid var(--border-color)', 
              padding: '15px', 
              fontFamily: 'Montserrat, sans-serif', 
              fontSize: '14px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }} 
          />
          <button 
            type="button"
            className="newsletter-btn" 
            style={{ width: '100%', padding: '15px', marginTop: '10px' }}
          >
            Log In
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
