
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from '../components/Logo';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
      navigate('/myspace/overview');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-pink-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[380px] p-8 flex flex-col z-10">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="mb-6"><Logo size="lg"/></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth_welcome')}</h2>
          <p className="text-gray-500 text-sm">{t('auth_login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">{t('auth_email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
              placeholder="hello@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">{t('auth_password')}</label>
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
                placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 text-sm font-medium rounded-xl text-center">{error}</div>}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg shadow-indigo-900/10 hover:shadow-xl hover:bg-[#3a2366] active:scale-[0.98] transition-all"
          >
            {t('auth_signin')}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-500">
          {t('auth_no_account')}{' '}
          <Link to="/register" className="text-[#ff4b9a] font-bold hover:underline">{t('auth_register_link')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
