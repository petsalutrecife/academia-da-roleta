import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      </div>
    </Router>
  );
}

export default App;
