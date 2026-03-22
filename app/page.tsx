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

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-40 font-sans">
      <div className="max-w-xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="flex flex-col items-center mt-8 mb-10 text-center">
          <div className="w-64 h-64 mb-6 shadow-2xl shadow-white/5">
            <img src={currentTrack.cover} alt="Album Art" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Traveler</h1>
          <h2 className="text-xl text-[#ff3b30] mb-2 font-medium">Official 芋男 dism</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">J-Pop • 2026年 • ロスレス</p>
        </div>

        {/* 再生・シャッフルボタン */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button className="flex items-center justify-center gap-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] py-3 rounded-xl font-bold text-[#ff3b30] transition">
            <Play size={20} fill="#ff3b30" /> 再生
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] py-3 rounded-xl font-bold text-[#ff3b30] transition">
            <Shuffle size={20} /> シャッフル
          </button>
        </div>

        {/* 曲リスト */}
        <div className="space-y-1">
          {PLAYLIST.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => setCurrentTrack(track)}
              className="flex items-center gap-4 px-2 py-3 group cursor-pointer border-b border-white/5 active:bg-white/10 transition"
            >
              <div className="w-6 text-gray-500 text-sm font-medium">{index + 1}</div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${currentTrack.id === track.id ? 'text-white' : 'text-gray-200'}`}>
                  {track.title}
                </div>
              </div>
              <div className="text-gray-500 text-xs">•••</div>
            </div>
          ))}
        </div>
      </div>

      <AudioPlayer 
        key={currentTrack.src} 
        src={currentTrack.src} 
        title={currentTrack.title} 
        cover={currentTrack.cover} 
      />
    </main>
  );
}