import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion"; // Animasyon için import
import { Mail, Lock, Eye, EyeOff, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import NaberSvg from "../assets/naber5.svg"; // Yeni SVG'yi import ediyoruz

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Tüm alanların doldurulması zorunludur.");
    }
    await login(formData);
  };

  // Framer Motion için animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Öğelerin birbiri ardına gelme süresi
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className='min-h-screen overflow-hidden grid lg:grid-cols-2'>
      {/* Sol - Form Bölümü */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12 h-full'>
        <motion.div
          className='w-full max-w-md'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Başlık ve Logo */}
          <motion.div variants={itemVariants} className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Tekrar Hoş Geldin!</h1>
              <p className='text-base-content/60'>Seni yeniden görmek çok güzel</p>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email */}
            <motion.div variants={itemVariants} className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>E-posta</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 size-5 text-base-content/40' />
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-10"
                  placeholder='ornek@mail.com'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Şifre</span>
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 size-5 text-base-content/40' />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className='absolute right-3 top-3 cursor-pointer text-base-content/40 hover:text-primary transition-colors'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type='submit'
              className={`btn btn-primary w-full transition-all duration-300 ${isLoggingIn ? "btn-disabled opacity-70" : "hover:scale-105"}`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </motion.button>
          </form>

          {/* Kayıt sayfasına yönlendirme */}
          <motion.p variants={itemVariants} className="text-center text-sm mt-8">
            Henüz bir hesabın yok mu?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Hemen Kayıt Ol
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Sağ - SVG */}
      <motion.div 
        className="hidden lg:flex items-center justify-center  h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src={NaberSvg}
          alt="Naber Illustration"
          className="w-full max-w-lg max-h-screen object-contain"
        />
      </motion.div>
    </div>
  );
};

export default Login;