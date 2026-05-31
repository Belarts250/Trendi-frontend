import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          {/* I will need to get the exact filename of the generated hero image */}
          <div style={{position: 'relative', width: '100%', height: '500px'}}>
             <Image 
                src="/images/hero_brighton_1780171224798.png" 
                alt="A Weekend in Brighton"
                fill
                style={{objectFit: 'cover'}}
                priority
             />
          </div>
          <div className="hero-overlay">
            <h2>A Weekend in Brighton</h2>
            <Link href="/blog/brighton" className="read-more-link">Read Now</Link>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h3 className="serif-font">Get on the List</h3>
          <div className="newsletter-form">
            <input type="text" placeholder="Name" className="newsletter-input" />
            <input type="email" placeholder="Email" className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-grid">
          <div className="category-item">
            <div style={{position: 'relative', width: '100%', aspectRatio: '4/3'}}>
              <Image 
                  src="/images/cat_blog_1780171321862.png" 
                  alt="The Blog"
                  fill
                  style={{objectFit: 'cover'}}
              />
            </div>
            <div className="category-overlay">
              The Blog
            </div>
          </div>
          <div className="category-item">
            <div style={{position: 'relative', width: '100%', aspectRatio: '4/3'}}>
              <Image 
                  src="/images/cat_story_1780171397537.png" 
                  alt="My Story"
                  fill
                  style={{objectFit: 'cover'}}
              />
            </div>
            <div className="category-overlay">
              My Story
            </div>
          </div>
          <div className="category-item">
            <div style={{position: 'relative', width: '100%', aspectRatio: '4/3'}}>
              <Image 
                  src="/images/cat_shop_1780171439347.png" 
                  alt="The Shop"
                  fill
                  style={{objectFit: 'cover'}}
              />
            </div>
            <div className="category-overlay">
              The Shop
            </div>
          </div>
        </section>

        {/* About Statement Section */}
        <section className="about-statement">
          <h3 className="serif-font">We&apos;re passionate about simplicity and intentional living.</h3>
          <p>
            Ut dignissim diam urna, at tempus tortor vehicula hendrerit. Nam urna felis, ultrices non mi molestie, sollicitudin porttitor justo. Aenean faucibus mauris lorem, vel lobortis turpis scelerisque at. Nullam ac dapibus nisi. Donec placerat mattis justo a eleifend. Vestibulum ac lacus bibendum id, rhoncus lorem commodo, blandit nunc. Etiam sapien nibh, lobortis in sagittis elementum. Nulla lobortis ac dolor lobortis sodales.
          </p>
          <Link href="/about" className="read-more-link">Read More</Link>
        </section>
      </div>

      {/* Instagram Feed Section (Infinite Marquee) */}
      <section className="instagram-feed-container">
        <div className="instagram-feed">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'inline-flex' }}>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_1_1780171550440.png" alt="Insta 1" fill style={{objectFit: 'cover'}} />
              </div>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_2_1780171615389.png" alt="Insta 2" fill style={{objectFit: 'cover'}} />
              </div>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_3_1780171747469.png" alt="Insta 3" fill style={{objectFit: 'cover'}} />
              </div>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_4_1780171822154.png" alt="Insta 4" fill style={{objectFit: 'cover'}} />
              </div>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_5_1780171898647.png" alt="Insta 5" fill style={{objectFit: 'cover'}} />
              </div>
              <div className="instagram-image-wrapper">
                <Image src="/images/insta_6_1780172044697.png" alt="Insta 6" fill style={{objectFit: 'cover'}} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
