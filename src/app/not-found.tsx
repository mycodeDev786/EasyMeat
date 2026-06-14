import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center" style={{background:'#0A0A0A'}}>
      <div>
        <div className="text-8xl mb-6">🥩</div>
        <h1 className="font-serif text-7xl font-bold text-white mb-3">4<span className="text-gold-gradient">0</span>4</h1>
        <p className="text-gray-400 text-xl mb-8">This cut has left the building.</p>
        <Link href="/" className="btn-gold px-8 py-3.5 rounded-full font-bold inline-block">Back to Home</Link>
      </div>
    </div>
  );
}
