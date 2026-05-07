import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/home.jsx';
import Jangchi from './pages/jangchi/jangchi.jsx';
import JangchiDetail from './pages/jangchi/detail/jangchiDetail.jsx';
import JangchiHighlightsPage from './pages/jangchi/highlights/jangchiHighlightsPage.jsx';
import JangchiStoryPage from './pages/jangchi/story/jangchiStoryPage.jsx';
import FighterProfilePage from './pages/jangchi/profile/fighterProfilePage.jsx';
import AdminPanel from './pages/admin/adminPanel.jsx';
import AuthPage from './pages/auth/authPage.jsx';
import ProfilePage from './pages/profile/profilePage.jsx';
import FighterChatPage from './pages/chat/fighterChatPage.jsx';
import { AuthProvider, useAuth } from './context/authContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/jangchi' element={<Jangchi />} />
            <Route path='/jangchi/:slug/profile' element={<FighterProfilePage />} />
            <Route path='/jangchi/:slug' element={<JangchiDetail />} />
            <Route
              path='/jangchi/:slug/chat'
              element={
                <ProtectedRoute>
                  <FighterChatPage />
                </ProtectedRoute>
              }
            />
            <Route path='/jangchi/:slug/mashxur-janglari' element={<JangchiHighlightsPage />} />
            <Route path='/jangchi/:slug/mening-hikoyam' element={<JangchiStoryPage />} />
            <Route path='/boxy-vault-portal-9247' element={<AdminPanel />} />
            <Route path='/login' element={<AuthPage />} />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
