import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Avatar from 'components/ui/Avatar';
import CreatePostModal from 'components/post/CreatePostModal';
import { Post } from 'types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePostCreated = (post: Post) => {
    setShowCreatePost(false);
    navigate(`/profile/${user?.username}`);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: isActive(to) ? 600 : 400,
        color: isActive(to) ? '#111' : '#525252',
        letterSpacing: '0.02em',
        padding: '4px 0',
        borderBottom: isActive(to) ? '1.5px solid #111' : '1.5px solid transparent',
        transition: 'color 0.1s',
      }}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: '#111' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Artspace
            </span>
          </Link>

          {/* Nav links (desktop) */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {navLink('/feed', 'Feed')}
              {navLink('/friends', 'Friends')}
              {navLink('/tags', 'Tags')}
            </div>
          )}

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <>
                <button
                  onClick={() => setShowCreatePost(true)}
                  style={{
                    padding: '6px 16px', background: '#111', color: '#fff',
                    border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', letterSpacing: '0.02em',
                  }}
                >
                  + New post
                </button>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar src={user.profile_picture_url} username={user.username} size={34} />
                  </button>

                  {menuOpen && (
                    <div
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        background: '#fff', border: '1px solid #e5e5e5',
                        borderRadius: 4, minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        zIndex: 200,
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <button
                        onClick={() => navigate(`/profile/${user.username}`)}
                        style={menuItemStyle}
                      >
                        {user.username}
                      </button>
                      <div style={{ borderTop: '1px solid #f5f5f5' }} />
                      <button onClick={logout} style={{ ...menuItemStyle, color: '#ef4444' }}>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', fontSize: 13, color: '#525252' }}>Sign in</Link>
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none', fontSize: 13, fontWeight: 500,
                    padding: '6px 16px', background: '#111', color: '#fff',
                    borderRadius: 3,
                  }}
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {user && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onCreated={handlePostCreated}
        />
      )}
    </>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: 'block', width: '100%', textAlign: 'left',
  padding: '10px 16px', fontSize: 13, background: 'none',
  border: 'none', cursor: 'pointer', color: '#111',
};
