import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { StudentIdentification } from './pages/StudentIdentification';
import { Instructions } from './pages/Instructions';
import { Quiz } from './pages/Quiz';
import { Processing } from './pages/Processing';
import { Result } from './pages/Result';
import { Report } from './pages/Report';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPanel } from './pages/AdminPanel';
import { QuizHeader } from './components/QuizHeader';
import { QuizSplashScreen } from './components/QuizSplashScreen';
import { Footer } from './components/Footer';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const DevNavigationBar = () => {
  const [visible, setVisible] = useState(true);
  const location = useLocation();

  const links = [
    { name: '1. Home', path: '/' },
    { name: '2. Identificação', path: '/identificacao' },
    { name: '3. Instruções', path: '/instrucoes' },
    { name: '4. Quiz', path: '/quiz' },
    { name: '5. Processamento', path: '/processamento' },
    { name: '6. Resultado', path: '/resultado' },
    { name: '7. Relatório', path: '/relatorio' },
    { name: '8. Login Admin', path: '/admin/login' },
    { name: '9. Painel Admin', path: '/admin/painel' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 99999,
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
      }}
    >
      <button
        onClick={() => setVisible(!visible)}
        style={{
          backgroundColor: 'var(--color-blue-highlight)',
          color: 'var(--color-white)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          fontWeight: 600,
        }}
      >
        {visible ? <EyeOff size={12} /> : <Eye size={12} />}
        <span>{visible ? 'Ocultar Atalhos' : 'Atalhos de Teste'}</span>
      </button>

      {visible && (
        <div
          style={{
            marginTop: '8px',
            backgroundColor: 'rgba(7, 26, 68, 0.95)',
            border: 'var(--border-silver-active)',
            borderRadius: '10px',
            padding: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            maxWidth: '180px',
            backdropFilter: 'blur(5px)',
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--color-silver-light)', borderBottom: '1px solid rgba(215,218,226,0.15)', paddingBottom: '0.25rem', marginBottom: '0.25rem', display: 'block' }}>
            Navegar para Tela:
          </span>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: isActive ? 'var(--color-white)' : 'var(--color-silver-medium)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'var(--color-blue-highlight)' : 'transparent',
                  display: 'block',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--color-white)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--color-silver-medium)';
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        {showSplash && <QuizSplashScreen onComplete={() => setShowSplash(false)} />}
        <QuizHeader />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/identificacao" element={<StudentIdentification />} />
            <Route path="/instrucoes" element={<Instructions />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/processamento" element={<Processing />} />
            <Route path="/resultado" element={<Result />} />
            <Route path="/relatorio" element={<Report />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/painel" element={<AdminPanel />} />
          </Routes>
        </main>

        <Footer />
        <DevNavigationBar />
      </div>
    </Router>
  );
}

export default App;
