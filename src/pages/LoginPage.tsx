import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel';

export function LoginPage() {
  const { user, login, error } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@slott.com');
  const [password, setPassword] = useState('admin123');
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

      <div className="flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex flex-col items-center mb-8">
            <img src="/slott-mark-large.png" alt="Slott" className="h-14 w-14 mb-2" />
            <h1 className="text-2xl font-bold text-brand-600">Slott</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1 hidden md:block">Bienvenido</h2>
          <p className="text-sm text-gray-500 mb-6 hidden md:block">Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="admin@slott.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? 'Accediendo...' : 'Acceder'}
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-800 font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
