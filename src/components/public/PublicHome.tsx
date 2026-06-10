import React, { useState } from "react";
import { 
  Building2, Users, MapPin, Calendar, ArrowRight, 
  Sparkles, Award, Star, MessageSquareCode, Volume2
} from "lucide-react";

interface PublicHomeProps {
  villageData: any;
  onNavigateTab: (tab: "profil" | "transparansi" | "layanan" | "wilayah") => void;
  onReadAnnouncement: (announcement: any) => void;
}

export default function PublicHome({ villageData, onNavigateTab, onReadAnnouncement }: PublicHomeProps) {
  const meta = villageData?.villageMetadata || {};
  const stats = villageData?.stats || {};
  const kades = meta.head || {};
  const announcements = villageData?.announcements || [];
  const gallery = villageData?.gallery || [];

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 text-white p-8 md:p-12 shadow-md">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Website Resmi Desa Mandiri
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Portal Publik <br />
            <span className="text-emerald-400">Desa {meta.name || "Pondok Panjang"}</span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl">
            Pusat pelayanan administratif mandiri warga, sirkuler transparansi pengelolaan dana anggaran APBDes, sarana geospasial keluhan wilayah, serta kearsipan data hukum tersertifikasi TTE Kepala Desa.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("layanan")}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white rounded-lg text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              Ajukan Dokumen & SKU Mandiri
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab("transparansi")}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              Transparansi Anggaran Desa
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Penduduk", value: `${stats.population || 4876} Jiwa`, desc: `Rasio: L:${stats.malePopulation || "2.512"} / P:${stats.femalePopulation || "2.364"}` },
          { icon: Building2, label: "Kepala Keluarga (KK)", value: `${stats.families || 1672} KK`, desc: "Tercatat di basis adminduk" },
          { icon: MapPin, label: "Luas Wilayah", value: `${stats.areaSize || "14.30"} km²`, desc: "Pesisir & perkebunan" },
          { icon: Award, label: "Rukun Tetangga (RT)", value: `${stats.rtrw || 74} RT / RW 05`, desc: "Mencakup 5 Dusun Sektor" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{item.label}</span>
                <strong className="text-lg font-extrabold text-slate-800 tracking-tight block">{item.value}</strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. WELCOME SPEECH FROM KEPALA DESA */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Star className="w-4 h-4 text-emerald-500" />
              Sapaan Pamong Desa
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center shrink-0 font-bold text-emerald-700 text-lg">
                HP
              </div>
              <div>
                <strong className="text-base font-extrabold text-slate-800 leading-tight block">{kades.name || "Heru Purnomo, ST"}</strong>
                <span className="text-xs text-emerald-600 font-semibold">{kades.title || "Kepala Desa"}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{kades.greetings || "Selamat datang di pelayanan mandiri digital desa kami. Kami terus berkomitmen menghadirkan keterbukaan informasi, pembangunan infastruktur berkeadilan, serta kemudahan kepengurusan berkas administratif untuk mewujudkan kemandirian sosial ekonomi warga."}"
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Stampel Resmi: <b>DS-PP Verified</b></span>
            <span className="text-emerald-600 font-bold">✓ TTE Terdaftar</span>
          </div>
        </div>

        {/* 4. NEWS & ANNOUNCEMENTS MAGAZINE */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
              Sirkuler Berita & Pengumuman Desa
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full">
              Paling Baru
            </span>
          </div>

          <div className="space-y-4.5">
            {announcements.map((ann: any, idx: number) => (
              <div key={ann.id || idx} className="group p-3 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition flex flex-col md:flex-row justify-between gap-4 text-xs">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{ann.date}</span>
                    <span className="w-1 h-1 bg-slate-350 rounded-full" />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono uppercase">{ann.author}</span>
                  </div>
                  <strong className="text-xs md:text-sm font-extrabold text-slate-800 group-hover:text-emerald-700 transition leading-snug block">
                    {ann.title}
                  </strong>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-2">
                    {ann.content}
                  </p>
                </div>
                <button
                  onClick={() => onReadAnnouncement(ann)}
                  className="self-start md:self-center shrink-0 px-3.5 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-[11px] font-bold text-slate-650 transition cursor-pointer flex items-center gap-1"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PHOTO GALLERY WORKSHOP */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Star className="w-4 h-4 text-emerald-500" />
          Galeri Visual Kegiatan & Pembangunan Fisik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gallery.map((item: any, idx: number) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden shadow-2xs border border-slate-150 p-2 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all duration-300">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-200 relative">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="object-cover w-full h-full group-hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded">
                  {item.date}
                </div>
              </div>
              <div className="p-2 text-xs">
                <strong className="font-extrabold text-slate-800 block truncate group-hover:text-emerald-600 transition">
                  {item.title}
                </strong>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">Desa Pondok Panjang</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
