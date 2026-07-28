import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/ui/Button';
import { Input } from '../components/common/ui/Input';
import { Card } from '../components/common/ui/Card';
import * as authService from '../services/auth.service';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await authService.updateProfile({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        company_name: companyName || undefined,
      });
      await refreshUser();
      addToast('Perfil actualizado correctamente', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al actualizar el perfil', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Las contraseñas no coinciden', 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Contraseña actualizada correctamente', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al cambiar la contraseña', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi perfil</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gestiona tus datos y la contraseña de acceso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card className="p-4">
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
              />
              <Input
                label="Apellido"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              placeholder="tu@email.com"
            />
            <Input
              label="Empresa / Razón social / Marca"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nombre que aparecerá en los reportes"
            />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={profileLoading}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-4">
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Cambiar contraseña
            </h2>
            <Input
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <Input
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
            <Input
              label="Repetir nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={passwordLoading}>
                Actualizar contraseña
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
