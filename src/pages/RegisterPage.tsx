import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { register } from '../services/auth.service';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel';
import { Button } from '../components/common/ui/Button';
import { Input } from '../components/common/ui/Input';

export function RegisterPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({
        email: email.trim(),
        password,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      });
      addToast('Usuario creado. Ya puedes iniciar sesión', 'success');
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <AuthBrandPanel
        tagline="Empieza a registrar tu tiempo."
        description="Crea tu cuenta y empieza a medir tu trabajo con precisión."
      />

      <div className="flex items-center justify-center p-6 bg-canvas">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex flex-col items-center mb-6">
            <div className="inline-flex items-center justify-center bg-white rounded-2xl p-2.5 shadow-card ring-1 ring-slate-200/60 mb-3">
              <img src="/slott-mark-large.png" alt="Slott" className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-brand-600 tracking-tight">Slott</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1 hidden md:block tracking-tight">Crear cuenta</h2>
          <p className="text-sm text-slate-500 mb-8 hidden md:block">Rellena tus datos para empezar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <Input
              type="password"
              label="Contraseña *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                label="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                type="text"
                label="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Crear cuenta
            </Button>
          </form>
          <p className="text-sm text-center text-slate-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
