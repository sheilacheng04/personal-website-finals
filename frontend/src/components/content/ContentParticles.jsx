const sizes = ['small', 'medium', 'small', 'large', 'small', 'medium', 'small', 'large', 'medium', 'small',
  'small', 'medium', 'small', 'large', 'medium', 'small', 'small', 'medium', 'large', 'small',
  'medium', 'small', 'small', 'medium', 'small', 'large', 'medium', 'small', 'small', 'large',
  'medium', 'small', 'large', 'small', 'medium', 'small', 'small', 'medium', 'large', 'small',
  'medium', 'small', 'small', 'large', 'medium', 'small', 'medium', 'small', 'large', 'small',
  'medium', 'small', 'small', 'large', 'medium', 'small'];

export default function ContentParticles() {
  return (
    <div className="content-particles-container">
      {sizes.map((s, i) => (
        <div key={i} className={`content-particle ${s}`} />
      ))}
    </div>
  );
}
