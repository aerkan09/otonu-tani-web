"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Phone, PlayCircle, ShieldCheck, Car, MapPin } from "lucide-react";

const SERKAN_NO = "0507 451 66 25";
const ADRES = "İstiklal Mah. Şehit Asteğmen Süleyman Çamlıca Bulvarı No: 183";
const TOPLAM_VIDEO = 10;
const TOPLAM_RESIM = 50;
const RESIM_SURESI = 15000; 

const HIZMETLER = [
  "Araç Dosya Sorgulama",
  "Kaporta Boya Ekspertizi",
  "Alt - Ön - Mekanik Ekspertiz",
  "Motor Ekspertizi",
  "Ön Muayene Hizmeti",
  "Dış Kondisyon Ekspertizi",
  "İç Kondisyon Ekspertizi",
  "Yanal Kayma Testi",
  "Fren Testleri",
  "Süspansiyon Testleri",
  "Dyno Test (Motor Performans)",
  "Elektronik Kontroller"
];

const MESAJLAR = [
  "Otonu Tanı teknoloji merkezine hoş geldiniz. Neden Serkan Altay Otonu Tanı? Çünkü işi uzmanına bırakıyoruz.",
  "Kaliteli, güvenilir ve tarafsız oto ekspertiz hizmeti ile her zaman sizlerin yanındayız.",
  "Ekspertizi şansa değil, bize bırakın. İşte sunduğumuz profesyonel çözümler:",
  ...HIZMETLER.map(h => `Hizmetlerimiz arasında ${h} titizlikle yapılmaktadır.`),
  "Serkan Altay güvencesiyle, aracınızın kimliğini dijital sistemlerle eksiksiz raporluyoruz."
];

export default function OtonuTaniTamSurum() {
  const [mode, setMode] = useState<"video" | "resim">("video");
  const [vIndex, setVIndex] = useState(0); // 0 = tanitim.mp4, 1-10 = digerleri
  const [rIndex, setRIndex] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

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
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    musicRef.current = new Audio("/muzik.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.12;
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    musicRef.current?.play().catch(() => {});
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!mounted || !isStarted) return;

    if (mode === "video") {
      musicRef.current?.play().catch(() => {});
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
        else { setMode("video"); setRIndex(1); setVIndex(0); }
      }, RESIM_SURESI);
      return () => { clearTimeout(timer); window.speechSynthesis.cancel(); };
    }
  }, [mode, rIndex, speak, mounted, isStarted]);

  const handleVideoEnd = () => {
    if (vIndex === 0) {
      setVIndex(1); // tanitim.mp4 bitti, tanitim1.mp4'e gec
    } else if (vIndex < TOPLAM_VIDEO) {
      setVIndex(vIndex + 1);
    } else {
      setMode("resim");
      setVIndex(0);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' }}>
      
      {!isStarted && (
        <div onClick={handleStart} style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', cursor: 'pointer' }}>
          <PlayCircle size={100} color="#FFD60A" />
          <h1 style={{ color: '#FFD60A', marginTop: '20px', letterSpacing: '2px', textAlign: 'center' }}>YAYINI BAŞLAT</h1>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0 }}>
        {mode === "video" ? (
          <video
            key={`v-${vIndex}`}
            ref={videoRef}
            src={vIndex === 0 ? "/tanitim.mp4" : `/tanitim${vIndex}.mp4`}
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
              src={`/images/slayt1 (${rIndex}).jpg`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Ekspertiz"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 50%)' }} />
            
            <div style={{ position: 'absolute', bottom: '220px', left: '50px', right: '50px', zIndex: 20 }}>
               <div style={{ background: 'rgba(255, 214, 10, 0.95)', color: '#000', padding: '20px 40px', borderRadius: '0 50px 50px 0', display: 'inline-block', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)' }}>
                  <h2 style={{ fontSize: '3vw', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
                    {MESAJLAR[rIndex % MESAJLAR.length]}
                  </h2>
               </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '155px', width: '100%', padding: '10px 50px', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 110 }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px 25px', borderRadius: '50px', border: '2px solid #FFD60A', display: 'flex', alignItems: 'center', gap: '15px' }}>
             <MapPin size={25} color="#FFD60A" />
             <span style={{ color: '#fff', fontSize: '1.4vw', fontWeight: 'bold' }}>{ADRES.toUpperCase()}</span>
          </div>
      </div>

      <div style={{ position: 'absolute', bottom: '100px', width: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)', height: '55px', overflow: 'hidden', display: 'flex', alignItems: 'center', borderTop: '2px solid #FFD60A', zIndex: 90 }}>
         {/* eslint-disable-next-line react/no-unknown-property */}
         <marquee scrollamount="12" style={{ color: '#FFD60A', fontSize: '1.8vw', fontWeight: 'bold' }}>
            {HIZMETLER.map((h, i) => (
              <span key={i} style={{ marginRight: '60px' }}>
                • {h.toUpperCase()}
              </span>
            ))}
            <span style={{ marginRight: '60px', color: '#fff' }}> • ADRES: {ADRES.toUpperCase()}</span>
         </marquee>
      </div>

      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100px', background: '#FFD60A', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', zIndex: 100, borderTop: '5px solid #fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ShieldCheck size={50} />
          <div style={{ fontSize: '2vw', fontWeight: '900' }}>KALİTELİ • GÜVENİLİR • TARAFSIZ</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Phone size={40} fill="black" />
          <div style={{ fontSize: '5vw', fontWeight: '1000' }}>{SERKAN_NO}</div>
        </div>
      </div>
    </div>
  );
}