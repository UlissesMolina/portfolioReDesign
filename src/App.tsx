import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ProjectsPage from './pages/ProjectsPage';
import { initTheme } from './components/Widgets';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-ctp-base text-ctp-text font-mono">
        <Nav />
        <div className="page-wrapper min-h-[calc(100vh-57px)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
