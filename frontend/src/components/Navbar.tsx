import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, PlusSquare, Search, X } from 'lucide-react';
import api from '../services/api';
import CreatePostModal from './CreatePostModal';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/auth/search?query=${encodeURIComponent(q)}`);
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    }
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">InstaClon</Link>

          <div className="navbar-links">
            <div className="navbar-search" ref={searchRef}>
              {showSearch ? (
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon-inside" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }} className="search-clear">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button className="nav-link" title="Search" onClick={() => setShowSearch(true)}>
                  <Search size={24} />
                </button>
              )}

              {searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((u: any) => (
                    <div
                      key={u.id}
                      className="search-result-item"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                        navigate(`/profile/${u.username}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="search-avatar">{u.username.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="search-username">{u.username}</p>
                        <p className="search-fullname">{u.fullName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="nav-link" title="New Post" onClick={() => setShowCreatePost(true)}>
              <PlusSquare size={24} />
            </button>
            <Link to="/" className="nav-link" title="Home">
              <Home size={24} />
            </Link>
            <Link to={`/profile/${username}`} className="nav-link" title="Profile">
              <User size={24} />
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn" title="Logout">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </nav>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => window.location.reload()}
        />
      )}
    </>
  );
};

export default Navbar;
