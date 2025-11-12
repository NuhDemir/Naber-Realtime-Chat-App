import { MessageSquare, Users, PenSquare } from "lucide-react";
import { motion } from "framer-motion";

const NoChatSelected = () => {
  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Çocuk elemanların gecikme süresi
        delayChildren: 0.3, // Konteyner animasyonundan sonraki gecikme
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring", // Yay efekti
        stiffness: 100,
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-10 bg-base-200/30">
      <motion.div
        className="w-full max-w-lg text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo ve Başlık */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            <MessageSquare className="size-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">
            <span className="text-primary">Naber</span>'e Hoş Geldin!
          </h1>
        </motion.div>

        {/* Açıklama Metni */}
        <motion.p
          variants={itemVariants}
          className="text-base-content/70 leading-relaxed max-w-sm mx-auto"
        >
          Sol taraftaki menüden bir sohbet seçerek mesajlaşmaya başla veya yeni
          arkadaşlar keşfet.
        </motion.p>

        {/* İpuçları / Özellikler */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
        >
          <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-4 rounded-xl flex flex-row items-center gap-4 border border-base-300">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-left text-base-content">
                Kişileri Keşfet
              </h3>
              <p className="text-xs text-base-content/60 text-left">
                Yeni sohbetler başlat.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-4 rounded-xl flex flex-row items-center gap-4 border border-base-300">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <PenSquare className="size-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-left text-base-content">
                Anında Mesajlaş
              </h3>
              <p className="text-xs text-base-content/60 text-left">
                Gerçek zamanlı sohbet et.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;
