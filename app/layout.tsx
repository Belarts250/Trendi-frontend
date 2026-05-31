import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trendi | A Lifestyle Blog",
  description: "A minimalist lifestyle blog with unique details and intentional styling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <div className="top-nav">
              <Link href="#">Instagram</Link>
              <Link href="#">Twitter</Link>
              <Link href="#">Pinterest</Link>
              <Link href="#">Facebook</Link>
              <Link href="#">Bloglovin&apos;</Link>
            </div>
            
            <div className="header-logo">
              <h1>Trendi</h1>
              <p>A Lifestyle Blog</p>
            </div>

            <div className="main-nav-container">
              <nav className="main-nav">
                <Link href="/">Blog</Link>
                <Link href="/articles">Articles</Link>
                {/* <Link href="/archive">Archive</Link> */}
                {/* <Link href="/shop">Shop</Link> */}
                <Link href="/gallery">Gallery</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
              </nav>
            </div>
          </header>
        </div>

        {children}

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-col">
                <h4>Latest Posts</h4>
                <ul>
                  <li><Link href="#">A Weekend in Brighton, England</Link></li>
                  <li><Link href="#">My Energizing Morning Routine</Link></li>
                  <li><Link href="#">Rainy Sundays & Creativity</Link></li>
                  <li><Link href="#">Our Salt Point Adventure</Link></li>
                  <li><Link href="#">A Late Summer Evening</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>About</h4>
                <p>Parker is a minimalist lifestyle blog with unique details and intentional styling in all the right places. Whether you&apos;re an established blogger or just published your first post, Parker will highlight your content beautifully and help you stand out among the others.</p>
              </div>
              <div className="footer-col">
                <h4>Get on the List</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  <input type="email" placeholder="Email Address" style={{ border: '1px solid var(--border-color)', padding: '10px', width: '100%', fontFamily: 'Montserrat, sans-serif', fontSize: '12px' }} />
                  <button style={{ border: '1px solid var(--foreground)', background: 'transparent', padding: '10px', width: '100%', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Subscribe</button>
                </div>
                <div className="footer-social">
                  <Link href="#">f</Link>
                  <Link href="#">i</Link>
                  <Link href="#">p</Link>
                  <Link href="#">t</Link>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              Copyright 2026 Trendi | Site design handcrafted by you
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
