import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === '123456789') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas! Use o e-mail admin@gmail.com e a senha 123456789.');
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 ${isDark ? 'bg-[#182129]' : 'bg-slate-50'}`}>
      <div className={`p-8 rounded-2xl border shadow-2xl max-w-md w-full ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200'}`}>
        <div className="text-center mb-6">
          <img
            src={isDark ? "/logo-dark-full.jpg" : "/logo-light-full.jpg"}
            alt="Model Results Logo"
            className="h-20 w-auto mx-auto mb-4 object-contain"
          />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Acesso ao Sistema</h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Digite suas credenciais para acessar a plataforma.</p>
        </div>

        {/* Demo credentials hint box */}
        <div className={`p-3 rounded-lg border text-xs mb-5 flex items-start gap-2.5 ${
          isDark ? 'bg-[#182129] border-[#2D3945] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
          <div>
            <p className="font-bold mb-0.5">Credenciais de Acesso:</p>
            <p>E-mail: <span className="font-mono font-bold">admin@gmail.com</span></p>
            <p>Senha: <span className="font-mono font-bold">123456789</span></p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>E-mail Corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-xs outline-none ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-xs outline-none ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white focus:ring-2 focus:ring-[#C87A54]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#002D4A]'
                }`}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2 text-white ${
              isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
            }`}
          >
            <span>Entrar no Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
