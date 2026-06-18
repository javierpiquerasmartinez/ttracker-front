import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      addToast('Sesión cerrada', 'info');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-600">
            Slott
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/clients" className="text-sm text-gray-600 hover:text-gray-900">
            Clientes
          </Link>
          <Link to="/projects" className="text-sm text-gray-600 hover:text-gray-900">
            Proyectos
          </Link>
          <Link to="/records" className="text-sm text-gray-600 hover:text-gray-900">
            Registros
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
