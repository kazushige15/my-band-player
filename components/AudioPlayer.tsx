'use client';

import { useState, useEffect } from 'react';
// @ts-ignore
import { Howl } from 'howler';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

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
      onend: () => setIsPlaying(false),
    });
    setSound(newSound);
    return () => { newSound.unload(); };
  }, [src]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && sound) {
      timer = setInterval(() => setSeek(sound.seek()), 1000);
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-4 z-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={cover} className="w-12 h-12 rounded-md object-cover" />
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{title}</div>
              <div className="text-[12px] text-gray-400">Official 芋男 dism</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <SkipBack size={24} fill="white" className="cursor-pointer" />
            <button onClick={togglePlay} className="hover:scale-110 transition">
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
            </button>
            <SkipForward size={24} fill="white" className="cursor-pointer" />
          </div>
        </div>
        
        {/* シークバー (Apple風の細いグレー) */}
        <div className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer group" onClick={handleSeek}>
          <div 
            className="absolute h-full bg-white/40 rounded-full group-hover:bg-white/60 transition-colors"
            style={{ width: `${(seek / duration) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-medium">
          <span>{Math.floor(seek / 60)}:{(Math.floor(seek % 60)).toString().padStart(2, '0')}</span>
          <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}