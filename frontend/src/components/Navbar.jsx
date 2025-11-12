import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // logout store içindeki async fonksiyon
    navigate('/login'); // çıkış sonrası login sayfasına yönlendirme
  };

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>

        {/* Sol kısım: Logo ve Başlık */}
        <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-all group'>
          <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300'>
            <MessageSquare className='w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h1 className='text-lg font-bold text-base-content'>Naber</h1>
        </Link>

        {/* Sağ kısım: Ayarlar, Profil ve Çıkış */}
        {authUser && (
          <div className='flex items-center gap-2'>

            <Link to="/settings" className='btn btn-sm gap-2 transition-colors'>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline'>Ayarlar</span>
            </Link>

            <Link to="/profile" className='btn btn-sm gap-2 transition-colors'>
              <User className='w-4 h-4' />
              <span className='hidden sm:inline'>Profil</span>
            </Link>

            <button
              onClick={handleLogout}
              className='btn btn-sm gap-2 transition-colors'
            >
              <LogOut className='w-4 h-4' />
              <span className='hidden sm:inline'>Çıkış</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
