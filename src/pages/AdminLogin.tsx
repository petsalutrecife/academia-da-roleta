import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { ContentCard } from '../components/ContentCard';
import { InfoBanner } from '../components/InfoBanner';
import { ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo credentials
    if (email === 'admin@academiaroleta.com' && password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/painel');
    } else {
      setError('Credenciais incorretas. Use o aviso abaixo para testar.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        maxWidth: '450px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <h1
        style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-title)',
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}
      >
        Mentoria C.G.E.
      </h1>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-silver-medium)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        Área administrativa reservada para a mentora de probabilidades.
      </p>

      <ContentCard>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <FormField
            label="E-mail Administrativo"
            id="admin-email"
            type="email"
            placeholder="mentor@academiaroleta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormField
            label="Senha"
            id="admin-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />

          <InfoBanner
            type="info"
            title="CREDENCIAIS DE TESTE"
            message="E-mail: admin@academiaroleta.com | Senha: admin123"
            style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" type="button" onClick={() => navigate('/')} style={{ flex: 1 }}>
              Voltar
            </Button>
            <Button variant="primary" type="submit" style={{ flex: 1.5 }}>
              <ShieldCheck size={16} />
              Acessar Painel
            </Button>
          </div>
        </form>
      </ContentCard>
    </div>
  );
};
