export default function Contact() {
  return (
    <div className="container" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '50vh' }}>
      <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Contact</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Get in touch with me.</p>
      <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
         <input type="text" placeholder="Name" style={{ padding: '15px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }} />
         <input type="email" placeholder="Email" style={{ padding: '15px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }} />
         <textarea placeholder="Message" rows={5} style={{ padding: '15px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}></textarea>
         <button style={{ padding: '15px', background: 'var(--foreground)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '2px', textTransform: 'uppercase' }}>Send Message</button>
      </div>
    </div>
  );
}
