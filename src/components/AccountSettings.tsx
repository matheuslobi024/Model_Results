import React, { useState } from 'react';
import { User, KeyRound, LogOut, Check, ShieldCheck } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface AccountSettingsProps {
  onLogout?: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onLogout }) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  const [name, setName] = useState('Administrador');
  const [email, setEmail] = useState('admin@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('Dados do perfil atualizados com sucesso!');
    setTimeout(() => setProfileSuccess(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas digitadas não coincidem.');
      setPasswordSuccess(null);
      return;
    }
    setPasswordError(null);
    setPasswordSuccess('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 3000);
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 border rounded-lg ${isDark ? 'bg-[#C87A54]/10 border-[#C87A54]/30 text-[#C87A54]' : 'bg-[#002D4A]/10 border-[#002D4A]/30 text-[#002D4A]'}`}>
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Configuração da Conta</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gerencie suas informações de perfil, credenciais de acesso e preferências da plataforma.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-[#2D3945]">
          <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
          <h3 className="font-bold text-base">Informações do Perfil</h3>
        </div>

        {profileSuccess && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              E-mail do Usuário
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className={`font-bold px-4 py-2 rounded-lg text-xs text-white transition-all shadow-md ${
              isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
            }`}
          >
            Salvar Alterações do Perfil
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-[#2D3945]">
          <KeyRound className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
          <h3 className="font-bold text-base">Alterar Senha</h3>
        </div>

        {passwordSuccess && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite a senha atual"
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Nova Senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
              }`}
            />
          </div>

          <button
            type="submit"
            className={`font-bold px-4 py-2 rounded-lg text-xs text-white transition-all shadow-md ${
              isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
            }`}
          >
            Atualizar Senha
          </button>
        </form>
      </div>

      {/* Logout Card */}
      {onLogout && (
        <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-red-500">Encerrar Sessão</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sair da sua conta nesta máquina e retornar à tela inicial.
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
