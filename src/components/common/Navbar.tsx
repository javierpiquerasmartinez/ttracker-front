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
    <nav className="bg-white/75 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="shrink-0 rounded-xl hover:opacity-90 transition-opacity"
          >
            <img src="/slott-mark.png" alt="Slott" className="h-8 w-8" />
          </Link>
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-xs font-semibold shadow-xs shadow-brand-600/30">
              {(user?.email ?? '?')[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-slate-500">{user?.email}</span>
          </div>
          <div className="w-px h-5 bg-slate-200 hidden sm:block" />
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
