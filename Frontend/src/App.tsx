import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RecipeManagementPage from './pages/RecipeManagementPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import CommunityCookbookPage from './pages/CommunityCookbookPage';
import ContactPage from './pages/ContactPage';
import CulinaryResourcesPage from './pages/CulinaryResourcesPage';
import EducationalResourcesPage from './pages/EducationalResourcesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';

function App() {
  return (
    <AuthProvider>
      <CookieConsentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Main layout routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                              <Route path="recipe-management" element={<RecipeManagementPage />} />
              <Route path="recipe/:id" element={<RecipeDetailPage />} />
              <Route path="search" element={<AdvancedSearchPage />} />
              <Route path="community" element={<CommunityCookbookPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="culinary-resources" element={<CulinaryResourcesPage />} />
                <Route path="educational-resources" element={<EducationalResourcesPage />} />
              </Route>
            </Routes>
            
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </CookieConsentProvider>
    </AuthProvider>
  );
}

export default App;
