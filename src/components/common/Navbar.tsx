import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clients', label: 'Clientes', end: false },
  { to: '/projects', label: 'Proyectos', end: false },
  { to: '/records', label: 'Registros', end: false },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de cerrar sesión?',
      confirmLabel: 'Cerrar sesión',
      variant: 'primary',
    });
    if (ok) {
      logout();
      addToast('Sesión cerrada', 'info');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="shrink-0 rounded-xl bg-brand-50 p-1.5 transition-colors hover:bg-brand-100">
            <img src="/slott-mark.png" alt="Slott" className="h-9 w-9" />
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
              {(user?.email ?? '?')[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 font-medium cursor-pointer transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
