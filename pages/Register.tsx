
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';

const Register: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password && formData.password === formData.confirm) {
      onLogin();
      navigate('/myspace/overview');
    } else if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[380px] p-8 flex flex-col z-10">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-6"><Logo size="md"/></div>
          <h2 className="text-xl font-bold text-gray-900">Get Started Free</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your properties smarter, not harder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
              placeholder="e.g. Salim Uddin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
              placeholder="hello@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirm}
              onChange={(e) => setFormData({...formData, confirm: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10 transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 text-sm font-medium rounded-xl text-center">{error}</div>}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff4b9a] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
