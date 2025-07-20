import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#121212] p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 logo-glow" />
          <h1 className="text-xl font-bold text-pink-400">LoveMatch360</h1>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">☰</button>
        <div className="hidden md:flex gap-4">
          <Link to="/" className="hover:text-pink-300">Home</Link>
          <Link to="/educazione" className="hover:text-pink-300">📚 Educazione</Link>
          <Link to="/chat" className="hover:text-pink-300">💬 Chat</Link>
          <Link to="/profilo" className="hover:text-pink-300">👤 Profilo</Link>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          <Link to="/" className="hover:text-pink-300">Home</Link>
          <Link to="/educazione" className="hover:text-pink-300">📚 Educazione</Link>
          <Link to="/chat" className="hover:text-pink-300">💬 Chat</Link>
          <Link to="/profilo" className="hover:text-pink-300">👤 Profilo</Link>
        </div>
      )}
    </nav>
  );
}
