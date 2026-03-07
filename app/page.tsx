'use client';

import { useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

const PLAYLIST = [
  { 
    id: 1, 
    title: "Tell me baby", 
    src: "/tell me baby.mp3", 
    cover: "/jacket.jpg", 
    album: "Official髭男dism", 
    duration: "4:41" 
  },
  { 
    id: 2, 
    title: "ノーダウト", 
    src: "/ノーダウト.mp3", 
    cover: "/jacket.jpg", 
    album: "Official髭男dism", 
    duration: "3:22" 
  },
  { 
    id: 3, 
    title: "stand by you", 
    src: "/stand by you.mp3", 
    cover: "/jacket.jpg", 
    album: "Official髭男dism", 
    duration: "4:16" 
  },
];

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(PLAYLIST[0]);

  return (
    <main className="min-h-screen bg-[#0a0f14] text-white p-8 pb-32 font-sans">
      <header className="mb-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase">
          My Music
        </h1>
        <p className="text-blue-300/60 text-sm font-medium tracking-widest">
          {PLAYLIST.length} TRACKS
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* 見出し */}
        <div className="grid grid-cols-[24px_1fr_2fr_1fr] gap-4 px-4 py-2 text-blue-200/30 text-[11px] font-bold uppercase tracking-widest border-b border-blue-900/30 mb-4">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="text-right">Time</div>
        </div>

        {/* 曲リスト */}
        {PLAYLIST.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => setCurrentTrack(track)}
            className={`grid grid-cols-[24px_1fr_2fr_1fr] gap-4 px-4 py-4 rounded-lg transition-all duration-300 group items-center cursor-pointer mb-2 border-l-4 ${
              currentTrack.id === track.id 
                ? 'bg-blue-600/10 border-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' 
                : 'hover:bg-white/5 border-transparent'
            }`}
          >
            <div className={currentTrack.id === track.id ? 'text-blue-400 font-bold' : 'text-gray-600'}>
              {currentTrack.id === track.id ? '●' : index + 1}
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-bold truncate ${currentTrack.id === track.id ? 'text-blue-300' : 'text-white'}`}>
                {track.title}
              </span>
              <span className="text-xs text-blue-200/40">Official髭男dism</span>
            </div>
            <div className="text-sm text-blue-100/30 italic truncate">{track.album}</div>
            <div className="text-right text-sm text-blue-100/30 font-mono">{track.duration}</div>
          </div>
        ))}
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