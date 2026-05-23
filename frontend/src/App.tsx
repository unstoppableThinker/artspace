import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchCurrentUser } from 'store/slices/authSlice';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import HomePage from 'pages/HomePage';
import ProfilePage from 'pages/ProfilePage';
import FriendsPage from 'pages/FriendsPage';
import TagsPage from 'pages/TagsPage';
import LoadingSpinner from 'components/ui/LoadingSpinner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, status } = useAppSelector((s) => s.auth);
  if (status === 'loading') return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, status } = useAppSelector((s) => s.auth);
  if (status === 'loading') return <LoadingSpinner fullPage />;
  if (user) return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

function AppInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      {/* Protected */}
      <Route path="/feed" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/profile/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/friends" element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
      <Route path="/tags" element={<PrivateRoute><TagsPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInit>
          <AppRoutes />
        </AppInit>
      </BrowserRouter>
    </Provider>
  );
}
