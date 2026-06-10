import React, { useState } from "react";
import { 
  Building2, Home, User, Wallet, Map, QrCode, Phone, 
  HelpCircle, Shield, ArrowRight, X, Calendar, MapPin, 
  Sparkles, ExternalLink
} from "lucide-react";

// Sub-modules imports
import PublicHome from "./public/PublicHome";
import PublicProfile from "./public/PublicProfile";
import PublicTransparency from "./public/PublicTransparency";
import PublicGISMap from "./public/PublicGISMap";
import PublicServices from "./public/PublicServices";

interface VillagePublicPortalProps {
  villageData: any;
  addToast: (message: string, type: "success" | "error" | "info" | "warning", title?: string) => void;
  onNavigateToAdminDocs?: () => void;
}

type NavigationTab = "home" | "profil" | "transparansi" | "wilayah" | "layanan";

export default function VillagePublicPortal({ villageData, addToast, onNavigateToAdminDocs }: VillagePublicPortalProps) {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const meta = villageData?.villageMetadata || {};
  const contacts = villageData?.contacts || {};

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[750px] font-sans">
      
      {/* 1. TOP NATIONAL BANNER HEADER */}
      <div className="bg-emerald-900 border-b border-emerald-850 px-6 py-2 text-white flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs gap-2 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-100 border border-white" />
          <span className="font-bold tracking-wide uppercase font-mono text-emerald-200 text-[10px]">
            Portal Resmi Pemerintah Republik Indonesia & Kementerian Desa PDT
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono font-bold text-emerald-300">
          <span>Kec. Teramang Jaya</span>
          <span>●</span>
          <span>Kab. Mukomuko</span>
          <span>●</span>
          <span>Bengkulu</span>
        </div>
      </div>

      {/* 2. MAIN LOGO BAR & NAVIGATION BRANDING */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-left leading-tight">
            <h1 className="text-base md:text-lg font-black text-slate-800 tracking-tight font-sans">
              PEMERINTAH DESA PONDOK PANJANG
            </h1>
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 font-mono">
              Situs Informasi, Transparansi, & Layanan Mandiri Publik
            </span>
          </div>
        </div>

        {/* Action Button: Swaps to Administrator */}
        {onNavigateToAdminDocs ? (
          <button
            onClick={onNavigateToAdminDocs}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-[11px] font-mono font-bold uppercase transition scale-98 hover:scale-100 cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 select-none"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Ke Panel Pamong (Admin)
            <ArrowRight className="w-3.5 h-3.5 text-slate-450" />
          </button>
        ) : (
          <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">
            Akses Warga Desa Aktif
          </div>
        )}
      </div>

      {/* 3. RESPONSIVE WEB BAR TABS SELECTOR */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2.5 flex overflow-x-auto gap-1.5 scrollbar-thin select-none">
        {[
          { id: "home", label: "Beranda", icon: Home },
          { id: "profil", label: "Profil Desa", icon: User },
          { id: "transparansi", label: "Transparansi APBDes", icon: Wallet },
          { id: "wilayah", label: "Peta & Wilayah (GIS)", icon: Map },
          { id: "layanan", label: "Layanan Cetak Mandiri", icon: QrCode }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as NavigationTab);
                addToast(`Pindah ke laman: ${tab.label}`, "info", "Navigasi");
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. MAIN CENTRAL CONTENT WORK AREA */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <PublicHome
            villageData={villageData}
            onNavigateTab={(tabId) => {
              setActiveTab(tabId);
              addToast(`Beralih ke rubrik ${tabId.toUpperCase()}`, "info", "Navigasi Cepat");
            }}
            onReadAnnouncement={(ann) => setSelectedAnnouncement(ann)}
          />
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === "profil" && (
          <PublicProfile />
        )}

        {/* TAB 3: BUDGET TRANSPARENCY */}
        {activeTab === "transparansi" && (
          <PublicTransparency 
            villageData={villageData}
            addToast={addToast}
          />
        )}

        {/* TAB 4: GIS MAP */}
        {activeTab === "wilayah" && (
          <PublicGISMap />
        )}

        {/* TAB 5: MANDIRI SERVICES */}
        {activeTab === "layanan" && (
          <PublicServices 
            villageData={villageData}
            addToast={addToast}
            onNavigateToAdminDocs={onNavigateToAdminDocs}
          />
        )}

      </div>

      {/* 5. GORGEOUS FOOTER OF VILLAGE */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 px-6 py-10 text-left text-xs leading-relaxed select-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <strong className="text-white text-sm tracking-tight font-extrabold uppercase">
                Kantor Kepala Desa Pondok Panjang
              </strong>
            </div>
            <p className="text-slate-400 max-w-sm">
              Situs integrasi milik Desa Pondok Panjang, Kec. Teramang Jaya, Kab. Mukomuko, Bengkulu. Resmi terdaftar di basis data interkomunikasi regional.
            </p>
            <div className="space-y-1 text-slate-450 font-mono text-[10.5px]">
              <p>📍 Alamat: {contacts.address || "Jl. Lintas Barat Sumatera No.12, Pondok Panjang, Bengkulu"}</p>
              <p>✉ Surel Adm: {contacts.email || "info@pondokpanjang.id"}</p>
              <p>📳 Telp/WA: {contacts.phone || "+6281324626243"}</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Tautan Terkait</h4>
            <ul className="space-y-1.5 text-slate-400 font-semibold font-sans">
              <li>
                <a href="https://kemendesa.go.id" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Kementerian Desa RI
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://mukomukokab.go.id" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Kabupaten Mukomuko
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://bengkuluprov.go.id" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Provinsi Bengkulu
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab("layanan");
                    addToast("Pindah ke halaman verifikasi TTE", "info");
                  } }
                  className="hover:text-emerald-400 text-left hover:underline cursor-pointer transition"
                >
                  Verifikasi Keabsahan TTE
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest font-mono">MITRA DESA MANDIRI DIGITAL</h4>
            <p className="text-slate-400 text-[10.5px]">
              Keaslian isi berkas surat dijamin aman melintasi sidik jari kriptografi SHA-250 (Tanda Tangan Elektronik Kades).
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Hukum RI UU ITE No.11</span>
              <span className="text-emerald-600 font-extrabold">✓ DISETUJUI BSR-E</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-slate-500 text-[10px] font-mono">
          <p>© 2026 Pemerintah Desa Pondok Panjang. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-3 mt-2 sm:mt-0 font-bold">
            <span>Sistem Sensus Offline v3</span>
            <span>|</span>
            <span>Kecamatan Teramang Jaya</span>
          </div>
        </div>
      </footer>

      {/* ================= READING BULLETINS POP-UP MODAL ================= */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4 font-sans animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-xl text-xs flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white p-5 text-left flex justify-between items-start">
              <div className="space-y-1 pr-4">
                <span className="bg-emerald-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  WARTA PENGUMUMAN DESA
                </span>
                <h4 className="text-base font-extrabold tracking-tight leading-tight mt-1">{selectedAnnouncement.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1 rounded bg-white/15 hover:bg-white/20 transition cursor-pointer text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[420px] text-left leading-normal">
              
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal: <b>{selectedAnnouncement.date}</b>
                </span>
                <span>•</span>
                <span>Jam: <b>{selectedAnnouncement.time || "08:00 WIB"}</b></span>
                <span>•</span>
                <span className="text-emerald-700 font-extrabold">Oleh: {selectedAnnouncement.author}</span>
              </div>

              {selectedAnnouncement.location && (
                <div className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 flex items-start gap-2 text-[11px]">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-bold block text-[9.5px]">TEMPAT / LOKASI ACARA</span>
                    <strong className="text-slate-800 font-bold">{selectedAnnouncement.location}</strong>
                  </div>
                </div>
              )}

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line pt-2">
                {selectedAnnouncement.content}
              </p>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10.5px] cursor-pointer"
              >
                Tutup Pengumuman
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
