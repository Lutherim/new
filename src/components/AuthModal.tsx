import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { CloseIcon, UserIcon, HardHatIcon, BriefcaseIcon, CheckCircleIcon } from '../icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+27 ');
  const [location, setLocation] = useState('Johannesburg');
  const [trade, setTrade] = useState('Cabinetry & Joinery');

  const SA_CITIES = ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban', 'Port Elizabeth', 'Bloemfontein', 'Centurion', 'Midrand', 'Sandton'];

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) return;

    onRegister({
      name,
      email,
      password,
      role: selectedRole,
      avatar: selectedRole === 'artisan'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      location,
      phone,
      trade: selectedRole === 'artisan' ? trade : undefined
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    onLogin(email.trim(), password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/45 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn transition-colors max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1 bg-[#F5F2EB] dark:bg-[#1C1816] rounded-2xl mb-6 border border-[#78866B]/20 dark:border-[#78866B]/35">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
              tab === 'signin'
                ? 'bg-[#FBF9F5] dark:bg-[#2B2522] text-[#3B2F2F] dark:text-[#F5F2EB] shadow-xs'
                : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB]'
            }`}
          >
            Instant Demo Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
              tab === 'signup'
                ? 'bg-[#FBF9F5] dark:bg-[#2B2522] text-[#3B2F2F] dark:text-[#F5F2EB] shadow-xs'
                : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB]'
            }`}
          >
            One-Way Registration
          </button>
        </div>

        {tab === 'signin' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">Welcome back</h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mt-1">Sign in with your email and password.</p>
            </div>
            <input type="email" required autoComplete="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]" />
            <input type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]" />
            <button type="submit" className="w-full py-3 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-xs transition-colors active:scale-95">
              Sign in
            </button>
            <p className="text-[11px] text-center text-[#5A4E4D] dark:text-[#C4BDB5]">New here? Use the One-Way Registration tab. Your account type cannot be changed later.</p>
          </form>
        ) : (
          /* ONE-WAY REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78866B] dark:text-[#A3B19F]">
                Account Registration
              </span>
              <h3 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                Join SkillFinder
              </h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                Registration locks your selected role for verified compliance.
              </p>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1.5">
                Registering As:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    selectedRole === 'customer'
                      ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5] border-transparent'
                      : 'bg-[#F5F2EB] dark:bg-[#1C1816] text-[#5A4E4D] dark:text-[#C4BDB5] border-[#78866B]/30 dark:border-[#78866B]/40'
                  }`}
                >
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('artisan')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    selectedRole === 'artisan'
                      ? 'bg-[#D97736] text-[#FBF9F5] border-transparent'
                      : 'bg-[#F5F2EB] dark:bg-[#1C1816] text-[#5A4E4D] dark:text-[#C4BDB5] border-[#78866B]/30 dark:border-[#78866B]/40'
                  }`}
                >
                  <HardHatIcon className="w-4 h-4" />
                  <span>Artisan / Pro</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sipho Sithole"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">Password (at least 8 characters)</label>
              <input type="password" required minLength={8} autoComplete="new-password" placeholder="Choose a strong password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]" />
            </div>

            {selectedRole === 'artisan' && (
              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Primary Trade
                </label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                >
                  <option value="Cabinetry & Joinery" className="dark:bg-[#1C1816]">Cabinetry & Joinery</option>
                  <option value="Plumbing & Drainage" className="dark:bg-[#1C1816]">Plumbing & Drainage</option>
                  <option value="Electrical & Solar" className="dark:bg-[#1C1816]">Electrical & Solar</option>
                  <option value="Tiling & Flooring" className="dark:bg-[#1C1816]">Tiling & Flooring</option>
                  <option value="Masonry & Brickwork" className="dark:bg-[#1C1816]">Masonry & Brickwork</option>
                  <option value="Painting & Finishing" className="dark:bg-[#1C1816]">Painting & Finishing</option>
                  <option value="Roofing & Timber" className="dark:bg-[#1C1816]">Roofing & Timber</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  City / Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                >
                  {SA_CITIES.map((c) => (
                    <option key={c} value={c} className="dark:bg-[#1C1816]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Complete Registration ({location})</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
