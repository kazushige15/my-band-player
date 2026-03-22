'use client';

import { useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Play, Shuffle } from 'lucide-react';

const PLAYLIST = [
  { id: 1, title: "Tell me baby", src: "/tell me baby.mp3", cover: "/jacket.jpg", album: "Traveler", duration: "4:41" },
  { id: 2, title: "ノーダウト", src: "/ノーダウト.mp3", cover: "/jacket.jpg", album: "Traveler", duration: "3:22" },
  { id: 3, title: "stand by you", src: "/stand by you.mp3", cover: "/jacket.jpg", album: "Traveler", duration: "4:16" },
  { id: 4, title: "異端なスター", src: "/異端なスター.mp3", cover: "/jacket.jpg", album: "Traveler", duration: "4:28" },
  { id: 5, title: "犬かキャットかで死ぬまで喧嘩しよう", src: "/犬かキャットかで死ぬまで喧嘩しよう.mp3", cover: "/jacket.jpg", album: "Traveler", duration: "3:02" },
];

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(PLAYLIST[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playNextTrack = () => {
    const currentIndex = PLAYLIST.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    setCurrentTrack(PLAYLIST[nextIndex]);
  };

  const playPrevTrack = () => {
    const currentIndex = PLAYLIST.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrack(PLAYLIST[prevIndex]);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className={`p-6 pb-40 transition-all duration-500 ${isFullScreen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="max-w-xl mx-auto">
          {/* ヘッダー部分は省略せずそのまま残してください */}
          <div className="flex flex-col items-center mt-8 mb-10 text-center">
            <div className="w-64 h-64 mb-6 shadow-2xl">
              <img src={currentTrack.cover} className="w-full h-full object-cover rounded-xl" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Traveler</h1>
            <h2 className="text-xl text-[#ff3b30] mb-2 font-medium">Official 芋男 dism</h2>
            <p className="text-gray-500 text-xs uppercase font-semibold">J-Pop • 2026年 • ロスレス</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-2 bg-[#2c2c2e] py-3 rounded-xl font-bold text-[#ff3b30]">
              <Play size={20} fill="#ff3b30" /> 再生
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#2c2c2e] py-3 rounded-xl font-bold text-[#ff3b30]">
              <Shuffle size={20} /> シャッフル
            </button>
          </div>

          <div className="space-y-1">
            {PLAYLIST.map((track, index) => (
              <div 
                key={track.id}
                onClick={() => {
                  // 同じ曲をタップした時はリセットしないようにする
                  if (currentTrack.id !== track.id) {
                    setCurrentTrack(track);
                  }
                  setIsFullScreen(true); // タップしたらフルスクリーンへ
                }}
                className="flex items-center gap-4 px-2 py-3 border-b border-white/5 active:bg-white/10 cursor-pointer transition"
              >
                <div className="w-6 text-gray-500 text-sm">{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${currentTrack.id === track.id ? 'text-[#ff3b30]' : 'text-gray-200'}`}>
                    {track.title}
                  </div>
                </div>
                <div className="text-gray-500 text-xs">•••</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 重要：keyを削除しました */}
      <AudioPlayer 
        track={currentTrack} 
        isFullScreen={isFullScreen} 
        setIsFullScreen={setIsFullScreen} 
        onNext={playNextTrack}
        onPrev={playPrevTrack}
      />
    </main>
  );
}