import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel';
import { Button } from '../components/common/ui/Button';
import { Input } from '../components/common/ui/Input';

export function LoginPage() {
  const { user, login, error } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Bienvenido', 'success');
      navigate('/');
    } catch {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <AuthBrandPanel tagline="Enfócate en tu trabajo." />

      <div className="flex items-center justify-center p-6 bg-canvas">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="inline-flex items-center justify-center bg-white rounded-2xl p-2.5 shadow-card ring-1 ring-slate-200/60 mb-3">
              <img src="/slott-mark-large.png" alt="Slott" className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-brand-600 tracking-tight">Slott</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1 hidden md:block tracking-tight">Bienvenido</h2>
          <p className="text-sm text-slate-500 mb-8 hidden md:block">Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <Input
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Acceder
            </Button>
          </form>
          <p className="text-sm text-center text-slate-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
