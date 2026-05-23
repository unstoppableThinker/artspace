import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { logout } from 'store/slices/authSlice';
import Avatar from 'components/ui/Avatar';
import CreatePostModal from 'components/post/CreatePostModal';
import { Post } from 'types';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePostCreated = (_post: Post) => {
    setShowCreatePost(false);
    navigate(`/profile/${user?.username}`);
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={[
          'text-sm tracking-wide pb-0.5 border-b-[1.5px] transition-colors duration-100',
          active
            ? 'font-semibold text-ink border-ink'
            : 'font-normal text-ink-soft border-transparent hover:text-ink',
        ].join(' ')}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="no-underline text-ink">
            <span className="font-serif text-[22px] font-semibold tracking-tight">Artspace</span>
          </Link>

          {/* Nav links */}
          {user && (
            <div className="flex items-center gap-7">
              {navLink('/feed', 'Feed')}
              {navLink('/friends', 'Friends')}
              {navLink('/tags', 'Tags')}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="text-sm font-medium px-4 py-1.5 bg-ink text-white rounded tracking-wide hover:bg-neutral-800 transition-colors"
                >
                  + New post
                </button>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center p-0 bg-transparent border-none cursor-pointer"
                  >
                    <Avatar src={user.profile_picture_url} username={user.username} size={34} />
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+8px)] bg-white border border-neutral-200 rounded min-w-[160px] shadow-lg z-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <button
                        onClick={() => navigate(`/profile/${user.username}`)}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink bg-transparent border-none cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        {user.username}
                      </button>
                      <div className="border-t border-neutral-100" />
                      <button
                        onClick={() => dispatch(logout())}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 bg-transparent border-none cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-ink-soft no-underline hover:text-ink transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-4 py-1.5 bg-ink text-white rounded no-underline hover:bg-neutral-800 transition-colors"
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
