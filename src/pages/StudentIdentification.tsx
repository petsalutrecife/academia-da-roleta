import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { ContentCard } from '../components/ContentCard';
import { Modal } from '../components/Modal';
import { UserCheck } from 'lucide-react';

const StepsIndicator: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const steps = [
    { num: 1, label: 'Identificação' },
    { num: 2, label: 'Instruções' },
    { num: 3, label: 'Diagnóstico' },
    { num: 4, label: 'Resultado' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto 2rem auto',
        padding: '0 0.5rem',
        gap: '0.5rem',
      }}
    >
      {steps.map((step) => {
        const isActive = step.num === activeStep;
        const isCompleted = step.num < activeStep;
        return (
          <div
            key={step.num}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isActive
                  ? 'var(--color-blue-highlight)'
                  : isCompleted
                  ? 'var(--color-success)'
                  : 'rgba(7, 26, 68, 0.6)',
                border: isActive
                  ? '2px solid var(--color-white)'
                  : '1px solid rgba(182, 187, 198, 0.2)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                marginBottom: '0.3rem',
                boxShadow: isActive ? 'var(--glow-highlight)' : 'none',
              }}
            >
              {step.num}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-white)' : 'var(--color-silver-medium)',
                fontFamily: 'var(--font-title)',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const StudentIdentification: React.FC = () => {
  const navigate = useNavigate();
  
  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [currentDate] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [consentChecked, setConsentChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Error triggers
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});

  // Recover saved data from localStorage on mount
  useEffect(() => {
    const savedInfo = localStorage.getItem('student_info');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.group) setGroup(parsed.group);
        if (parsed.consent) setConsentChecked(parsed.consent);
      } catch (e) {
        console.error('Erro ao recuperar dados do localStorage', e);
      }
    }
  }, []);

  // Format phone number dynamically during typing: (99) 99999-9999 or (99) 9999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    
    let formatted = '';
    if (digits.length > 0) {
      if (digits.length <= 2) {
        formatted = `(${digits}`;
      } else if (digits.length <= 6) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length <= 10) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      }
    }
    
    setPhone(formatted);
    
    if (touched.phone) {
      validateField('phone', formatted);
    }
  };

  // Field validation helper
  const validateField = (field: 'name' | 'email' | 'phone', val: string) => {
    const newErrors = { ...errors };
    
    if (field === 'name') {
      const trimmed = val.trim();
      if (!trimmed) {
        newErrors.name = 'Informe seu nome completo.';
      } else if (trimmed.length < 3) {
        newErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
      } else {
        delete newErrors.name;
      }
    }
    
    if (field === 'email') {
      const trimmed = val.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed) {
        newErrors.email = 'Digite um endereço de e-mail válido.';
      } else if (!emailRegex.test(trimmed)) {
        newErrors.email = 'Digite um endereço de e-mail válido.';
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'phone') {
      const digits = val.replace(/\D/g, '');
      if (!digits) {
        newErrors.phone = 'Informe um telefone com DDD.';
      } else if (digits.length < 10) {
        newErrors.phone = 'Informe um telefone com DDD.';
      } else {
        delete newErrors.phone;
      }
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') validateField('name', name);
    if (field === 'email') validateField('email', email);
    if (field === 'phone') validateField('phone', phone);
  };

  // Form validity check
  const isFormValid =
    name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    phone.replace(/\D/g, '').length >= 10 &&
    consentChecked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid) {
      const studentData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        group: group.trim(),
        date: currentDate,
        consent: true,
        consentTime: new Date().toISOString(),
        stage: 'instrucoes',
      };
      
      // Save data locally
      localStorage.setItem('student_info', JSON.stringify(studentData));
      
      // Navigate to instructions page
      navigate('/instrucoes');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        maxWidth: '550px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <StepsIndicator activeStep={1} />

      <h1
        style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-title)',
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}
      >
        ANTES DE COMEÇAR
      </h1>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-silver-medium)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        Preencha seus dados para que possamos gerar o seu diagnóstico personalizado ao final.
      </p>

      <ContentCard>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormField
            label="Nome Completo"
            id="student-name"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (touched.name) validateField('name', e.target.value);
            }}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : undefined}
          />

          <FormField
            label="E-mail"
            id="student-email"
            type="email"
            placeholder="Digite seu melhor e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) validateField('email', e.target.value);
            }}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : undefined}
          />

          <FormField
            label="Telefone ou WhatsApp"
            id="student-phone"
            type="tel"
            placeholder="Digite seu telefone com DDD"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur('phone')}
            error={touched.phone ? errors.phone : undefined}
          />

          <FormField
            label="Turma ou Grupo (Opcional)"
            id="student-group"
            placeholder="Informe sua turma, caso possua"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />

          <FormField
            label="Data de Realização"
            id="student-date"
            value={currentDate}
            disabled
            onChange={() => {}}
            style={{ opacity: 0.7 }}
          />

          {/* Privacy Consent Section */}
          <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                id="consent-checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={{
                  marginTop: '0.2rem',
                  accentColor: 'var(--color-blue-highlight)',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                Concordo com o uso dos meus dados para gerar o resultado deste diagnóstico e receber comunicações relacionadas à Academia da Roleta.{' '}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-silver-light)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Saiba como seus dados serão utilizados
                </button>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" type="button" onClick={() => navigate('/')} style={{ flex: 1 }}>
              VOLTAR
            </Button>
            <Button
              variant={isFormValid ? 'primary' : 'secondary'}
              type="submit"
              disabled={!isFormValid}
              style={{
                flex: 1.5,
                opacity: isFormValid ? 1 : 0.4,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 4px 14px rgba(18, 61, 132, 0.4)' : 'none',
              }}
            >
              <UserCheck size={16} />
              CONTINUAR
            </Button>
          </div>
        </form>
      </ContentCard>

      {/* Terms of Privacy Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="COMO UTILIZAMOS SEUS DADOS"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0.2rem' }}>
            
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-silver-medium)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <p>
                Os dados informados serão utilizados para identificar o participante, gerar o diagnóstico individual e permitir comunicações relacionadas aos conteúdos, treinamentos e atividades da Academia da Roleta.
              </p>
              <p>
                As informações não devem ser vendidas ou compartilhadas com terceiros sem autorização, exceto quando necessário para o funcionamento técnico da ferramenta ou por obrigação legal.
              </p>
              <p>
                O participante poderá solicitar a correção ou exclusão dos seus dados pelos canais oficiais da Academia da Roleta.
              </p>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowModal(false)} style={{ minWidth: '120px' }}>
                ENTENDI
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
};
