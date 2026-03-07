'use client';

import { useState, useEffect } from 'react';
// @ts-ignore
import { Howl } from 'howler';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

export default function AudioPlayer({ src, title, cover }: { src: string; title: string; cover: string }) {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const newSound = new Howl({
      src: [src],
      html5: true,
      format: ['mp3'],
      onload: () => setDuration(newSound.duration()),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });

    setSound(newSound);
    return () => { newSound.unload(); };
  }, [src]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && sound) {
      timer = setInterval(() => {
        setSeek(sound.seek());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sound]);

  const togglePlay = () => {
    if (!sound) return;
    sound.playing() ? sound.pause() : sound.play();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sound) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newPos = percent * duration;
    sound.seek(newPos);
    setSeek(newPos);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs % 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0d131a]/95 backdrop-blur-xl border-t border-blue-900/40 p-4 text-white z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* 左側：曲情報 */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-14 h-14 bg-gray-800 rounded shadow-2xl overflow-hidden border border-blue-900/20">
             <img src={cover} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate text-blue-50">{title}</div>
            <div className="text-[11px] text-blue-300/50 font-bold uppercase tracking-wider">Official髭男dism</div>
          </div>
        </div>

        {/* 中央：コントロール */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-8">
            <SkipBack size={22} className="text-blue-200/40 hover:text-blue-300 cursor-pointer transition" />
            <button 
              onClick={togglePlay} 
              className="bg-[#00a8e1] text-white p-3 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,168,225,0.5)]"
            >
              {isPlaying ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" className="ml-1" />}
            </button>
            <SkipForward size={22} className="text-blue-200/40 hover:text-blue-300 cursor-pointer transition" />
          </div>
          
          {/* シークバー */}
          <div className="w-full max-w-md flex items-center gap-3 text-[10px] font-mono text-blue-300/40">
            <span>{formatTime(seek)}</span>
            <div 
              onClick={handleSeek}
              className="flex-1 h-[3px] bg-blue-900/30 rounded-full cursor-pointer relative group"
            >
              <div 
                className="bg-[#00a8e1] group-hover:bg-cyan-400 h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,168,225,0.8)]"
                style={{ width: `${(seek / duration) * 100}%` }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 右側：音量 */}
        <div className="flex justify-end items-center gap-3 w-1/3">
          <Volume2 size={18} className="text-blue-300/40" />
          <div className="w-24 h-[3px] bg-blue-900/30 rounded-full overflow-hidden">
             <div className="bg-blue-400/50 h-full w-[80%]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}