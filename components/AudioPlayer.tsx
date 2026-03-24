'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore
import { Howl } from 'howler';
import { Play, Pause, SkipForward, SkipBack, MoreHorizontal, MessageSquare, ListMusic } from 'lucide-react';

export default function AudioPlayer({ track, isFullScreen, setIsFullScreen, onNext, onPrev }: any) {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // ドラッグ中かどうか
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastSrcRef = useRef(track.src);

  useEffect(() => {
    if (sound && lastSrcRef.current === track.src) return;

    const newSound = new Howl({
      src: [track.src],
      html5: true,
      autoplay: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => onNext(),
      onload: () => setDuration(newSound.duration()),
    });

    setSound(newSound);
    lastSrcRef.current = track.src;

    return () => { newSound.unload(); }; 
  }, [track.src, onNext]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && sound && !isDragging) { // ドラッグ中はタイマーで上書きしない
      timer = setInterval(() => setSeek(sound.seek()), 200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sound, isDragging]);

  const togglePlay = (e: any) => {
    e.stopPropagation(); 
    if (!sound) return;
    sound.playing() ? sound.pause() : sound.play();
  };

  // 時間を計算する共通関数
  const updateSeekPosition = useCallback((clientX: number) => {
    if (!sound || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const newPos = percent * duration;
    setSeek(newPos);
    return newPos;
  }, [sound, duration]);

  // マウス/タッチ移動時のイベント
  const handleMove = useCallback((e: any) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSeekPosition(clientX);
  }, [isDragging, updateSeekPosition]);

  // 指を離した時
  const handleEnd = useCallback((e: any) => {
    if (!isDragging || !sound) return;
    setIsDragging(false);
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const finalPos = updateSeekPosition(clientX);
    if (finalPos !== undefined) sound.seek(finalPos);
  }, [isDragging, sound, updateSeekPosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

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
          className="fixed bottom-4 left-4 right-4 bg-[#1c1c1e] rounded-xl p-2 flex items-center justify-between z-40 border border-white/5 active:scale-95 transition cursor-pointer shadow-2xl"
        >
          <div className="flex items-center gap-3 px-2">
            <img src={track.cover} className="w-10 h-10 rounded-md" />
            <div className="text-sm font-bold truncate max-w-[150px]">{track.title}</div>
          </div>
          <div className="flex items-center gap-4 px-2">
            <button onClick={togglePlay}>{isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} />}</button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }}><SkipForward fill="white" size={24} /></button>
          </div>
        </div>
      )}

      {/* フルスクリーン画面 */}
      <div className={`fixed inset-0 bg-[#121212] z-50 transition-transform duration-500 p-8 flex flex-col justify-between ${isFullScreen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-center">
          <button onClick={() => setIsFullScreen(false)} className="bg-white/10 w-12 h-1.5 rounded-full mb-4 hover:bg-white/30 transition"></button>
        </div>

        <div className="flex-1 flex items-center justify-center py-10">
          <img src={track.cover} className={`w-full max-w-sm rounded-2xl shadow-2xl transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-90'}`} />
        </div>

        <div className="max-w-sm mx-auto w-full space-y-8">
          <div className="flex justify-between items-center">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold truncate">{track.title}</h2>
              <h3 className="text-xl text-white/50 font-medium">Official 芋男 dism</h3>
            </div>
            <button className="bg-white/10 p-2 rounded-full"><MoreHorizontal /></button>
          </div>

          {/* 改良版：インタラクティブ・シークバー */}
          <div className="space-y-4">
            <div 
              ref={progressBarRef} 
              onMouseDown={(e) => { setIsDragging(true); updateSeekPosition(e.clientX); }}
              onTouchStart={(e) => { setIsDragging(true); updateSeekPosition(e.touches[0].clientX); }}
              className="relative h-6 flex items-center cursor-pointer group"
            >
              {/* 背景のレール */}
              <div className={`w-full bg-white/10 rounded-full transition-all duration-200 ${isDragging ? 'h-2.5' : 'h-1.5 group-hover:h-2'}`}>
                {/* 再生済みの部分 */}
                <div 
                  className="h-full bg-white/60 rounded-full relative"
                  style={{ width: `${(seek / duration) * 100}%` }}
                >
                  {/* Apple風の白い丸（ドラッグ中やホバー中に大きく表示） */}
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-xl transition-transform duration-200 ${isDragging ? 'scale-125' : 'scale-0 group-hover:scale-100'}`}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-[11px] text-white/30 font-bold -mt-2">
              <span>{formatTime(seek)}</span>
              <span>-{formatTime(duration - seek)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
            <button onClick={onPrev} className="active:scale-90 transition"><SkipBack size={40} fill="white" /></button>
            <button onClick={togglePlay} className="active:scale-75 transition">
              {isPlaying ? <Pause size={64} fill="white" /> : <Play size={64} fill="white" />}
            </button>
            <button onClick={onNext} className="active:scale-90 transition"><SkipForward size={40} fill="white" /></button>
          </div>

          <div className="flex justify-between items-center text-white/30 pb-4">
            <MessageSquare size={20} />
            <div className="text-[10px] font-bold tracking-widest uppercase">soundcore P40i</div>
            <ListMusic size={20} />
          </div>
        </div>
      </div>
    </>
  );
}