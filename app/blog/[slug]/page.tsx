export default async function BlogPost({ params }: { params: { slug: string } }) {
  // We await params here to ensure Next.js dynamic routing handles it correctly in app router
  const resolvedParams = await params;
  return (
    <div className="container" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '50vh' }}>
      <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '20px', textTransform: 'capitalize' }}>
        {resolvedParams.slug.replace('-', ' ')}
      </h2>
      <p style={{ color: 'var(--text-muted)' }}>This is a placeholder for the blog post content.</p>
    </div>
  );
}
