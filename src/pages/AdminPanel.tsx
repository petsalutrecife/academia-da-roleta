import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContentCard } from '../components/ContentCard';
import { ToastMessage } from '../components/ToastMessage';
import { InfoBanner } from '../components/InfoBanner';
import { FormField } from '../components/FormField';
import { Modal } from '../components/Modal';
import { LogOut, FileSpreadsheet, Filter, ShieldAlert, Target, Users, Key } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface StudentData {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  date: string;
  emo: number;
  fin: number;
  est: number;
  avg: number;
}

const initialMockStudents: StudentData[] = [
  { id: 1, name: 'Lucas Silva', email: 'lucas@gmail.com', phone: '(11) 98888-7777', date: '15/06/2026', emo: 40, fin: 35, est: 60, avg: 45 },
  { id: 2, name: 'Mariana Costa', email: 'mariana@outlook.com', phone: '(21) 97777-6666', date: '14/06/2026', emo: 85, fin: 80, est: 90, avg: 85 },
  { id: 3, name: 'Roberto Junior', email: 'roberto@hotmail.com', phone: '(81) 96666-5555', date: '14/06/2026', emo: 60, fin: 55, est: 50, avg: 55 },
  { id: 4, name: 'Juliana Paes', email: 'juliana@gmail.com', phone: '(31) 95555-4444', date: '13/06/2026', emo: 30, fin: 25, est: 40, avg: 31 },
  { id: 5, name: 'Carlos Henrique', email: 'carlos@uol.com.br', phone: '(19) 94444-3333', date: '12/06/2026', emo: 90, fin: 95, est: 90, avg: 91 },
];

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch completed attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      // 2. Fetch student details
      const { data: studentsList, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) throw studentsError;

      // 3. Fetch all answers
      const { data: answers, error: answersError } = await supabase
        .from('quiz_answers')
        .select('*');

      if (answersError) throw answersError;

      // 4. Group and compute
      const formatted: StudentData[] = (attempts || []).map((attempt, index) => {
        const student = (studentsList || []).find(
          (s) => s.email.toLowerCase() === attempt.student_email.toLowerCase()
        );

        const attemptAnswers = (answers || []).filter(
          (ans) => ans.attempt_id === attempt.id
        );

        const emoAnswers = attemptAnswers.filter((a) => a.pillar === 'Controle Emocional');
        const finAnswers = attemptAnswers.filter((a) => a.pillar === 'Gestão Financeira');
        const estAnswers = attemptAnswers.filter((a) => a.pillar === 'Estratégia');

        const emoCorrect = emoAnswers.filter((a) => a.is_correct).length;
        const finCorrect = finAnswers.filter((a) => a.is_correct).length;
        const estCorrect = estAnswers.filter((a) => a.is_correct).length;

        const emoTotal = emoAnswers.length || 10;
        const finTotal = finAnswers.length || 10;
        const estTotal = estAnswers.length || 10;

        const emoScore = Math.round((emoCorrect / emoTotal) * 100);
        const finScore = Math.round((finCorrect / finTotal) * 100);
        const estScore = Math.round((estCorrect / estTotal) * 100);

        const formattedDate = attempt.completed_at
          ? new Date(attempt.completed_at).toLocaleDateString('pt-BR')
          : 'N/A';

        return {
          id: attempt.id || index,
          name: student ? student.name : 'Aluno Desconhecido',
          email: attempt.student_email,
          phone: student ? student.phone : 'N/A',
          date: formattedDate,
          emo: emoScore,
          fin: finScore,
          est: estScore,
          avg: attempt.percentage ?? 0,
        };
      });

      setStudents(formatted);
    } catch (e) {
      console.error('Erro ao buscar dados do Supabase:', e);
      // Fallback to localStorage or mock if query failed
      const dbStudentsRaw = localStorage.getItem('admin_students_list');
      if (dbStudentsRaw) {
        setStudents(JSON.parse(dbStudentsRaw));
      } else {
        setStudents(initialMockStudents);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check auth
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      navigate('/admin/login');
      return;
    }

    fetchStudents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      setToastMsg('Nenhum dado para exportar.');
      setShowToast(true);
      return;
    }

    setToastMsg('Preparando planilha de diagnósticos...');
    setShowToast(true);

    setTimeout(() => {
      // CSV Headers
      const headers = [
        'Nome',
        'E-mail',
        'Telefone',
        'Data',
        'Controle Emocional (%)',
        'Gestao Financeira (%)',
        'Estrategia (%)',
        'Media Geral (%)'
      ];

      // Format CSV rows
      const rows = filteredStudents.map((s) => [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.email.replace(/"/g, '""')}"`,
        `"${s.phone.replace(/"/g, '""')}"`,
        `"${s.date}"`,
        s.emo,
        s.fin,
        s.est,
        s.avg
      ]);

      // Join headers and rows, prefixing with UTF-8 BOM to ensure compatibility with Microsoft Excel
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      // Create browser blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `diagnosticos_academia_roleta_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMsg('Planilha CSV exportada com sucesso!');
    }, 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const savedPassword = localStorage.getItem('admin_password') || 'admin123';

    if (currentPassword !== savedPassword) {
      setPasswordError('A senha atual está incorreta.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('A nova senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    localStorage.setItem('admin_password', newPassword);
    setToastMsg('Senha alterada com sucesso!');
    setShowToast(true);
    
    // Clear inputs and close modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  // Stats calculation
  const total = students.length;
  const critical = students.filter((s) => s.avg < 50).length;
  const averageTotal = total > 0 ? Math.round(students.reduce((acc, curr) => acc + curr.avg, 0) / total) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '2rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      {/* Header Admin */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)' }}>Painel Administrativo</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-dark)' }}>
            Gerenciamento e análises das respostas do Método C.G.E.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
            <Key size={16} />
            <span>Alterar Senha</span>
          </Button>
          <Button variant="secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Exportar CSV</span>
          </Button>
          <Button variant="secondary" onClick={handleLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#FCA5A5' }}>
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(18, 61, 132, 0.2)', color: 'var(--color-silver-light)' }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>TOTAL AVALIADOS</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--color-white)' }}>{total} Alunos</strong>
            </div>
          </div>
        </ContentCard>

        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34D399' }}>
              <Target size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>MÉDIA GERAL C.G.E.</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--color-white)' }}>{averageTotal}%</strong>
            </div>
          </div>
        </ContentCard>

        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>PERFIS CRÍTICOS (&lt;50%)</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--color-white)' }}>{critical} Alunos</strong>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Warning informational banner */}
      <InfoBanner
        type="info"
        message="Abaixo estão listadas as avaliações feitas pelos alunos. Você pode visualizar os scores individuais para dar devolutivas de mentoria personalizadas."
        style={{ marginBottom: '1.5rem' }}
      />

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flexGrow: 1, position: 'relative', maxWidth: '450px' }}>
          <FormField
            label=""
            id="search-input"
            placeholder="Pesquisar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-silver-medium)', fontSize: '0.85rem' }}>
          <Filter size={16} />
          <span>Filtros ativos: Nenhum</span>
        </div>
      </div>

      {/* Student List Table Card */}
      <ContentCard style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(182, 187, 198, 0.15)', color: 'var(--color-silver-medium)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 0.75rem' }}>Aluno</th>
              <th style={{ padding: '1rem 0.75rem' }}>Data</th>
              <th style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>Ctrl. Emo</th>
              <th style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>Gest. Fin</th>
              <th style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>Estratégia</th>
              <th style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>Média Geral</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-silver-medium)', fontSize: '0.95rem' }}>
                  Carregando cadastros do Supabase...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  style={{
                    borderBottom: '1px solid rgba(182, 187, 198, 0.05)',
                    fontSize: '0.9rem',
                    color: 'var(--color-silver-light)',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(18, 61, 132, 0.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>{student.email} • {student.phone}</div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>{student.date}</td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 600, color: student.emo < 50 ? '#EF4444' : student.emo < 80 ? '#F59E0B' : '#10B981' }}>{student.emo}%</td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 600, color: student.fin < 50 ? '#EF4444' : student.fin < 80 ? '#F59E0B' : '#10B981' }}>{student.fin}%</td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center', fontWeight: 600, color: student.est < 50 ? '#EF4444' : student.est < 80 ? '#F59E0B' : '#10B981' }}>{student.est}%</td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        backgroundColor: student.avg < 50 ? 'rgba(239, 68, 68, 0.15)' : student.avg < 80 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: student.avg < 50 ? '#FCA5A5' : student.avg < 80 ? '#FBBF24' : '#34D399',
                      }}
                    >
                      {student.avg}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-silver-dark)', fontSize: '0.9rem' }}>
                  Nenhum aluno encontrado correspondente à pesquisa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ContentCard>

      {showToast && (
        <ToastMessage
          message={toastMsg}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Modal: Alterar Senha Admin */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="Alterar Senha do Administrador"
        size="sm"
      >
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0.2rem' }}>
          <FormField
            label="Senha Atual"
            id="current-password"
            type="password"
            placeholder="Digite a senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <FormField
            label="Nova Senha"
            id="new-password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <FormField
            label="Confirmar Nova Senha"
            id="confirm-password"
            type="password"
            placeholder="Digite a nova senha novamente"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordError}
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar Nova Senha
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
