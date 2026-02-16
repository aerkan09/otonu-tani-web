"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Zap, Phone, PlayCircle } from "lucide-react";

const SERKAN_NO = "0507 451 66 25";
const TOPLAM_VIDEO = 10;
const TOPLAM_RESIM = 50;
const RESIM_SURESI = 12000;

const MESAJLAR = [
  "Otonu Tanı teknoloji merkezine hoş geldiniz. Ekspertizi şansa değil, bize bırakın.",
  "Neden Otonu Tanı? Çünkü yüzde yüz objektif raporlama ve garantili ekspertiz sunuyoruz.",
  "Dört çarpı dört uzmanlığımızla, her arazi aracını milimetrik hassasiyetle inceliyoruz.",
  "Dyno test ve performans ölçümü ile motorun beygir gücünü ve tork değerlerini raporluyoruz.",
  "Serkan Altay güvencesiyle İncirliova'da aracınızın kimliğini dijital sistemlerle çıkarıyoruz."
];

export default function MobilUyumluOtonuTani() {
  const [mode, setMode] = useState<"video" | "resim">("video");
  const [vIndex, setVIndex] = useState(1);
  const [rIndex, setRIndex] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // Mobil kilit açıcı

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const lady = voices.find(v => v.lang.includes("tr") && (v.name.includes("Seda") || v.name.includes("Emel"))) || voices.find(v => v.lang.includes("tr"));
      if (lady) utterance.voice = lady;
      utterance.lang = "tr-TR";
      utterance.rate = 0.85;
      utterance.pitch = 1.4;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    musicRef.current = new Audio("/muzik.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.15;
    
    // Sesleri önceden yükle
    window.speechSynthesis.getVoices();
  }, []);

  // --- MOBİL KİLİDİ AÇAN FONKSİYON ---
  const handleStart = () => {
    setIsStarted(true);
    musicRef.current?.play();
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
    if (mode === "resim") {
      speak(MESAJLAR[rIndex % MESAJLAR.length]);
    }
  };

  useEffect(() => {
    if (!mounted || !isStarted) return;

    musicRef.current?.play().catch(() => {});

    if (mode === "video") {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    } else {
      speak(MESAJLAR[rIndex % MESAJLAR.length]);
      const timer = setTimeout(() => {
        if (rIndex < TOPLAM_RESIM) setRIndex(prev => prev + 1);
        else { setMode("video"); setRIndex(1); }
      }, RESIM_SURESI);
      return () => clearTimeout(timer);
    }
  }, [mode, rIndex, speak, mounted, isStarted]);

  const handleVideoEnd = () => {
    if (vIndex < TOPLAM_VIDEO) setVIndex(vIndex + 1);
    else { setMode("resim"); setVIndex(1); }
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      
      {/* MOBİL BAŞLATMA EKRANI */}
      {!isStarted && (
        <div 
          onClick={handleStart}
          style={{ position: 'absolute', inset: 0, zMount: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.95)', cursor: 'pointer' }}
        >
          <div style={{ border: '4px solid #FFD60A', padding: '40px', borderRadius: '50%', marginBottom: '20px', animation: 'pulse 2s infinite' }}>
            <PlayCircle size={80} color="#FFD60A" />
          </div>
          <h2 style={{ color: '#FFD60A', textAlign: 'center' }}>OTONU TANI YAYININI<br/>BAŞLATMAK İÇİN DOKUNUN</h2>
        </div>
      )}

      {/* ANA İÇERİK */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {mode === "video" ? (
          <video
            key={`v-${vIndex}`}
            ref={videoRef}
            src={`/tanitim${vIndex}.mp4`}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={handleVideoEnd}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              key={`r-${rIndex}`}
              src={`/images/slayt1 (${rIndex}).jpeg`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'zoom 15s infinite alternate' }}
              alt="Ekspertiz"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, transparent 40%)' }} />
            <div style={{ position: 'absolute', bottom: '150px', left: '5%', zIndex: 10 }}>
              <h2 style={{ fontSize: '6vw', color: '#FFD60A', fontWeight: '900', textShadow: '0 0 20px #000' }}>
                {MESAJLAR[rIndex % MESAJLAR.length]}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* TABELA */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50 }}>
        <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '15px', border: '2px solid #FFD60A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '4vw', fontWeight: '900', color: '#FFD60A', lineHeight: 1 }}>SERKAN ALTAY</div>
            </div>
            <Zap color="#FFD60A" size={25} fill="#FFD60A" />
        </div>
      </div>

      {/* ALT BANT */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: '#FFD60A', color: '#000', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <Phone size={30} fill="black" />
        <div style={{ fontSize: '8vw', fontWeight: '1000' }}>{SERKAN_NO}</div>
      </div>

      <style jsx global>{`
        @keyframes zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}