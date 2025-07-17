import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import NaberSvg from "../assets/naber5.svg";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // 1. Adım: Link'i import et

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName) {
      toast.error("İsim alanı boş bırakılamaz.");
      return false;
    }

    if (!formData.email) {
      toast.error("E-posta adresi zorunludur.");
      return false;
    }

    if (!formData.email.includes("@")) {
      toast.error("Geçerli bir e-posta adresi giriniz.");
      return false;
    }

    if (!formData.password) {
      toast.error("Şifre alanı boş bırakılamaz.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return false;
    }

    // Başarılı giriş mesajını signup işlemi sonrası için store'a taşıyabiliriz.
    // Şimdilik burada kalabilir.
    // toast.success("Başarıyla Giriş Yaptınız!"); 
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await signup(formData);
    // Formu temizleme işlemi store'da authUser değiştiğinde bir useEffect ile de yapılabilir
    // veya signup başarılı olursa yapılabilir. Şimdilik burada kalabilir.
  };

  return (
    <div className='min-h-screen overflow-hidden grid lg:grid-cols-2'>
      {/* Sol - Form Bölümü */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12 h-full'>
        <div className='w-full max-w-md space-y-8'>
          {/* Başlık ve Logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Hesap Oluştur</h1>
              <p className='text-base-content/60'>Ücretsiz hesabınla hemen başla</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Tam Adınız</span>
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-3 size-5 text-base-content/40' />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder='Nuh Demir'
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>E-posta</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 size-5 text-base-content/40' />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder='ornek@mail.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Şifre</span>
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 size-5 text-base-content/40' />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div
                  className='absolute right-3 top-3 cursor-pointer text-base-content/40'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
                </div>
              </div>
            </div>
           
            {/* Submit Button */}
            <button
              type='submit'
              className={`btn btn-primary w-full transition duration-300 ${isSigningUp ? "btn-disabled opacity-70" : ""}`}
              disabled={isSigningUp}
            >
              {isSigningUp ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>

          {/* 2. Adım: Giriş sayfasına yönlendirme linkini ekle */}
          <p className="text-center text-sm mt-6">
            Zaten bir hesabın var mı?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>

        </div>
      </div>

      {/* Sağ - SVG */}
      <div className="hidden lg:flex items-center justify-center  h-full">
        <img
          src={NaberSvg}
          alt="Naber Illustration"
          className="w-full max-w-md max-h-screen object-contain"
        />
      </div>
    </div>
  );
};

export default SignUp;