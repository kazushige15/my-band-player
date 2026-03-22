'use client';

import { useState, useEffect } from 'react';
// @ts-ignore
import { Howl } from 'howler';
import { Play, Pause, SkipForward, SkipBack, MoreHorizontal, MessageSquare, ListMusic, Volume2 } from 'lucide-react';

export default function AudioPlayer({ track, isFullScreen, setIsFullScreen, onNext, onPrev }: any) {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8); // 初期音量を80%に設定

  useEffect(() => {
    const newSound = new Howl({
      src: [track.src],
      html5: true,
      autoplay: true,
      volume: volume, // 現在の音量を適用
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        onNext();
      },
      onload: () => setDuration(newSound.duration()),
    });
    setSound(newSound);
    return () => { newSound.unload(); }; 
  }, [track.src, onNext]);

  // 音量が変更されたときにHowlの音量を更新する
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && sound) {
      timer = setInterval(() => setSeek(sound.seek()), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sound]);

  const togglePlay = (e: any) => {
    e.stopPropagation(); 
    if (!sound) return;
    sound.playing() ? sound.pause() : sound.play();
  };

  // 音量調節の処理
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60) || 0;
    const sec = Math.floor(secs % 60) || 0;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <>
      {/* ミニプレイヤー */}
      {!isFullScreen && (
        <div 
          onClick={() => setIsFullScreen(true)}
          className="fixed bottom-4 left-4 right-4 bg-[#1c1c1e] rounded-xl p-2 flex items-center justify-between z-40 shadow-2xl border border-white/5 active:scale-95 transition"
        >
          <div className="flex items-center gap-3">
            <img src={track.cover} className="w-10 h-10 rounded-md shadow-lg" />
            <div className="text-sm font-bold">{track.title}</div>
          </div>
          <div className="flex items-center gap-4 px-2">
            <button onClick={togglePlay}>{isPlaying ? <Pause fill="white" /> : <Play fill="white" />}</button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }}><SkipForward fill="white" size={20} /></button>
          </div>
        </div>
      )}

      {/* フルスクリーン（Apple Music風） */}
      <div className={`fixed inset-0 bg-[#121212] z-50 transition-transform duration-500 ease-in-out p-8 flex flex-col justify-between ${isFullScreen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-center">
          <button onClick={() => setIsFullScreen(false)} className="bg-white/10 w-12 h-1.5 rounded-full mb-4 hover:bg-white/30 transition"></button>
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <img src={track.cover} className={`w-full max-w-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-90'}`} />
        </div>

        <div className="max-w-sm mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold truncate">{track.title}</h2>
              <h3 className="text-xl text-white/50 font-medium">Official 芋男 dism</h3>
            </div>
            <button className="bg-white/10 p-2 rounded-full"><MoreHorizontal /></button>
          </div>

          {/* 再生位置バー */}
          <div className="space-y-2">
            <div className="h-1.5 bg-white/10 rounded-full relative">
              <div className="absolute h-full bg-white/60 rounded-full" style={{ width: `${(seek / duration) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-white/30 font-bold">
              <span>{formatTime(seek)}</span>
              <span>-{formatTime(duration - seek)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
            <button onClick={onPrev}><SkipBack size={40} fill="white" /></button>
            <button onClick={togglePlay}>
              {isPlaying ? <Pause size={64} fill="white" /> : <Play size={64} fill="white" />}
            </button>
            <button onClick={onNext}><SkipForward size={40} fill="white" /></button>
          </div>

          {/* 音量調節バー（Apple Music風） */}
          <div className="flex items-center gap-3 px-2">
            <Volume2 size={16} className="text-white/30" />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
            />
            <Volume2 size={16} fill="white" className="text-white/30" />
          </div>

          <div className="flex justify-between items-center text-white/30 pb-4">
            <MessageSquare size={20} />
            <div className="text-[10px] font-bold tracking-widest uppercase text-center italic">soundcore P40i</div>
            <ListMusic size={20} />
          </div>
        </div>
      </div>
    </>
  );
}