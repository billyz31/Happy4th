import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Calendar, Clock, Music, ChevronDown, Play, Pause } from 'lucide-react';

// 照片列表
const PHOTOS = [
  '/photos/20251201_172823.jpg', // 這是新的首頁大圖 (請將照片命名為 cover.jpg)
  '/photos/20251129_093044.jpg',
  '/photos/20251129_123401.jpg',
  '/photos/20251201_163708.jpg',
  '/photos/20251201_164459.jpg',
  '/photos/20251201_165242.jpg',
  '/photos/20251201_172823.jpg',
  '/photos/20251201_202831.jpg',
  '/photos/20251201_205120.jpg',
  '/photos/20251202_185234.jpg',
  '/photos/20251202_192239.jpg',
  '/photos/20251202_194126.jpg',
  '/photos/20251202_195053.jpg',
  '/photos/20251202_200855.jpg',
  '/photos/20251202_224810.jpg',
  '/photos/IMG-20251130-WA0000.jpg',
];

// 開始交往日期：2021/12/25
const START_DATE = new Date('2021-12-25T00:00:00');

// 音樂播放組件 - 自動播放版本
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = React.useRef(null);

  // 頁面載入時立即嘗試播放
  useEffect(() => {
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          // 設定音量為 50%
          audioRef.current.volume = 0.5;
          
          // 嘗試自動播放
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
          console.log("音樂自動播放成功");
        } catch (err) {
          console.log("自動播放被阻止:", err);
          
          // 如果自動播放失敗，添加點擊監聽器
          const handleClickToPlay = async () => {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
              setError(null);
              document.removeEventListener('click', handleClickToPlay);
            } catch (playErr) {
              console.error("點擊播放失敗:", playErr);
              setError("請點擊播放按鈕");
            }
          };
          
          document.addEventListener('click', handleClickToPlay);
          
          // 10秒後移除監聽器
          setTimeout(() => {
            document.removeEventListener('click', handleClickToPlay);
          }, 10000);
        }
      }
    };

    tryAutoPlay();

    return () => {
      // 清理
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
        } catch (err) {
          console.error("播放失敗:", err);
          setError("播放失敗");
        }
      }
    }
  };

  const handleAudioError = (e) => {
    console.error("音頻錯誤:", e);
    setError("音樂檔案問題");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {error && (
        <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded mb-1 backdrop-blur-sm">
          {error}
        </div>
      )}
      
      <audio 
        ref={audioRef} 
        src="/bgm.mp3" 
        loop 
        preload="auto"
        onError={handleAudioError}
      />
      
      <button 
        onClick={togglePlay} 
        className={`
          bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-3 
          text-white transition-all duration-300 shadow-lg hover:bg-black/50 hover:scale-110
          flex items-center justify-center
          ${isPlaying ? 'bg-christmas-red/80' : ''}
        `}
        title={isPlaying ? "暫停音樂" : "播放音樂"}
      >
        {isPlaying ? (
          <Pause size={20} />
        ) : (
          <Play size={20} className="ml-1" />
        )}
      </button>
      
      {!isPlaying && !error && (
        <div className="text-white/80 text-xs mr-2 animate-pulse bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          點擊播放 🎵
        </div>
      )}
    </div>
  );
};

// 雪花組件
const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      animationDuration: Math.random() * 3 + 2 + 's',
      opacity: Math.random(),
      size: Math.random() * 10 + 5 + 'px',
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

// 聖誕燈串組件
const ChristmasLights = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-40 pointer-events-none flex justify-between px-4" style={{ height: '40px' }}>
      <div className="wire"></div>
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = ['red', 'green', 'gold'];
        const color = colors[i % 3];
        return (
          <div key={i} className={`christmas-light ${color}`} style={{ marginTop: '2px' }}></div>
        );
      })}
    </div>
  );
};

function App() {
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - START_DATE;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeTogether({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ed8587ff', '#2563EB', '#F8B229', '#FFFFFF'],
      shapes: ['circle', 'square'], // 可以嘗試加上 'star' 如果支持
      scalar: 1.2
    });
  };

  return (
    <div className="min-h-screen bg-christmas-cream font-serif relative">
      <Snowfall />
      <ChristmasLights />
      
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-christmas-dark">
        {/* 背景模糊層：讓照片即使縮放也不會留黑邊，而是有氛圍感 */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
          style={{ backgroundImage: `url(${PHOTOS[0]})` }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* 主圖：在手機上改為 contain，確保完整顯示不裁切 */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <img 
            src={PHOTOS[0]} 
            alt="Cover" 
            className="w-full h-full md:object-cover object-contain max-h-screen"
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-4 mt-40 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              Happy 4th Anniversary
            </h1>
            <p className="text-xl md:text-3xl mb-8 font-light tracking-wider">
              & Merry Christmas
            </p>
            <button 
              onClick={launchConfetti}
              className="bg-christmas-red hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
            >
              <Heart className="fill-current" /> 慶祝我們的四年
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </header>

      {/* Timer Section */}
      <section className="py-20 px-4 bg-christmas-cookie text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 flex items-center justify-center gap-3 drop-shadow-md">
            <Clock /> 我們已經一起走過了
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TimeBox value={timeTogether.days} label="天" />
            <TimeBox value={timeTogether.hours} label="小時" />
            <TimeBox value={timeTogether.minutes} label="分鐘" />
            <TimeBox value={timeTogether.seconds} label="秒" />
          </div>
          
          <p className="mt-12 text-christmas-cream text-lg italic font-medium">
            從 2021 年 12 月 25 日開始，每一秒都是幸福。
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-christmas-cookie">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center drop-shadow-md">
            精選回憶
          </h2>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {PHOTOS.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img 
                  src={photo} 
                  alt={`Memory ${index + 1}`} 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="py-20 px-4 bg-christmas-red text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
            <Heart className="fill-white text-white" /> 給親愛的仙仙
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl border border-white/20">
            <p className="text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
              我最愛的仙仙,不知不覺，我們已經一起走過了四年。
              這四年來，謝謝妳總是陪在我身邊，包容我的不完美，陪我一起度過感情的酸甜苦辣。

              這個網站是我自己做得哦,
              雖然我不是一個浪漫的人，但我希望能用這種方式，把我們珍貴的回憶永遠保存下來。

              聖誕快樂，四週年快樂！
              未來的每一個日子，我都想牽著妳的手，繼續寫下屬於我們的回憶。
              
              希望能讓妳感受到這份特別的驚喜，能看見妳開心的笑容，就是我最大的幸福。
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-white/80 text-sm bg-christmas-cookie">
        <p>© 2025 Made with ❤️ for my love</p>
      </footer>
    </div>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="bg-christmas-cream p-6 rounded-lg shadow-md border-b-4 border-christmas-red">
      <div className="text-4xl md:text-5xl font-bold text-christmas-dark mb-2 font-sans">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-gray-500 uppercase tracking-widest text-sm">{label}</div>
    </div>
  );
}

export default App;