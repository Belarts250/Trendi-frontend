"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {

  const router = useRouter();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name,
          email, 
          password 
        }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          userId: data.userId,
          name: data.name,
          email: data.email
        }));
        router.push("/articles");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Create Account</h2>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            value={name}
            onChange={(e) => setname(e.target.value)}
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
            type="email" 
            placeholder="Email Address" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            type="submit"
            disabled={loading}
            className="newsletter-btn" 
            style={{ width: '100%', padding: '15px', marginTop: '10px' }}
          >
           {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
