import React, { useState } from "react";
import { Map, MapPin, Compass, Layers, Info, Users, School, Building2, HelpCircle } from "lucide-react";

interface DusunData {
  id: string;
  name: string;
  head: string;
  population: number;
  families: number;
  areaSizeKm: number;
  rtRange: string;
  rtCount: number;
  occupation: string;
  color: string;
  bgTailwind: string;
  desc: string;
  // SVG Sector boundaries representation
  points: string; 
  textX: number;
  textY: number;
}

const dusunDirectory: DusunData[] = [
  {
    id: "dusun_1",
    name: "Dusun I (Pondok Panjang Barat)",
    head: "Samsul Bahri",
    population: 1120,
    families: 384,
    areaSizeKm: 2.8,
    rtRange: "RT 01 - RT 15",
    rtCount: 15,
    occupation: "Nelayan Tangkap & Kuliner Pesisir",
    color: "#3B82F6",
    bgTailwind: "bg-blue-500",
    desc: "Wilayah pesisir Samudra Hindia bagian barat. Berfokus pada penataan ekonomi pelayaran nelayan rakyat, budidaya tambak, pariwisata laut jeti lama, dan kelsyabandaraan mikro.",
    points: "20,50 250,55 240,420 50,450",
    textX: 110,
    textY: 210
  },
  {
    id: "dusun_2",
    name: "Dusun II (Pondok Panjang Sentosa)",
    head: "Andi Wijaya, SE",
    population: 1350,
    families: 462,
    areaSizeKm: 2.1,
    rtRange: "RT 16 - RT 30",
    rtCount: 15,
    occupation: "Pedagang, PNS, & Jasa Konstruksi",
    color: "#F59E0B",
    bgTailwind: "bg-amber-500",
    desc: "Pusat hunian padat sekaligus sentral ekonomi urat nadi desa. Menampung kompleks Kantor Kepala Desa, pasar komoditas mingguan rakyat, sekolah vokasi binaan, Masjid Agung, dan pusat kesehatan Poskesdes Utama.",
    points: "250,55 450,60 380,350 240,420",
    textX: 330,
    textY: 180
  },
  {
    id: "dusun_3",
    name: "Dusun III (Pondok Panjang Timur)",
    head: "Bambang Supriyadi",
    population: 980,
    families: 335,
    areaSizeKm: 3.4,
    rtRange: "RT 31 - RT 45",
    rtCount: 15,
    occupation: "Petani Padi Sawah & Peternak Sapi",
    color: "#10B981",
    bgTailwind: "bg-emerald-500",
    desc: "Lahan basah subur irigasi sekunder dari terusan aliran Sungai Teramang. Pusat ketahanan pangan desa yang didominasi oleh blok persawahan hijau, lumbung beras, dan lokasi peternakan warga mandiri.",
    points: "450,60 780,70 650,380 380,350",
    textX: 580,
    textY: 190
  },
  {
    id: "dusun_4",
    name: "Dusun IV (Rancah Indah)",
    head: "Maryono",
    population: 720,
    families: 248,
    areaSizeKm: 3.2,
    rtRange: "RT 46 - RT 60",
    rtCount: 15,
    occupation: "Petani / Kelompok Tani Sawit & Karet",
    color: "#8B5CF6",
    bgTailwind: "bg-purple-500",
    desc: "Wilayah lereng perbukitan rendah bagian selatan yang kaya akan komoditas perkebunan sawit rakyat mandiri dan getah karet alam. Terhubung langsung dengan jalur logistik antar-kabupaten.",
    points: "240,420 380,350 650,380 500,560 180,550",
    textX: 410,
    textY: 460
  },
  {
    id: "dusun_5",
    name: "Dusun V (Maju Makmur)",
    head: "Hj. Erna Susilowati",
    population: 706,
    families: 243,
    areaSizeKm: 2.8,
    rtRange: "RT 61 - RT 74",
    rtCount: 14,
    occupation: "Pekebun Sawit, Padi, & Anyaman Bambu",
    color: "#EC4899",
    bgTailwind: "bg-pink-500",
    desc: "Zona rintisan pengembangan transmigrasi lokal utara. Sentra penghasil kerajinan anyaman bambu bernilai guna tinggi, sayur palawija organik, dan program bedah rumah bantuan sosial rujukan.",
    points: "50,450 240,420 180,550 40,540",
    textX: 130,
    textY: 490
  }
];

const landmarkMarkers = [
  { id: "lm_1", name: "Kantor Kepala Desa Pondok Panjang", type: "office", x: 330, y: 155, desc: "Sumbu utama pelayanan administrasi terpadu." },
  { id: "lm_2", name: "Puskesmas Pembina Teramang Jaya", type: "health", x: 345, y: 310, desc: "Layanan darurat kesehatan masyarakat." },
  { id: "lm_3", name: "SD Negeri 02 Teramang Jaya", type: "school", x: 190, y: 220, desc: "Sekolah dasar negeri binaan unggulan pariwisata kelautan." },
  { id: "lm_4", name: "Masjid Raya Baiturrahman", type: "worship", x: 420, y: 120, desc: "Pusat ibadah dan rembuk silaturahmi warga." }
];

export default function PublicGISMap() {
  const [selectedDusunId, setSelectedDusunId] = useState<string | null>(null);
  const [hoveredDusunId, setHoveredDusunId] = useState<string | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<any>(null);

  const selectedDusun = dusunDirectory.find(d => d.id === (selectedDusunId || hoveredDusunId));

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* 1. MAP PANEL HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">Sistem Informasi Geografis (GIS) Desa</h3>
            <p className="text-[11px] text-slate-500">Peta interaktif pembagian administrative Dusun, cakupan RT, dan situs prasarana.</p>
          </div>
        </div>
        <div className="bg-slate-900 text-white rounded-lg px-3 py-1 text-[10px] uppercase font-mono shadow-xs flex items-center gap-1.5 animate-pulse shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
          <span>DATA DEMOGRAFI VALID SINKRON</span>
        </div>
      </div>

      {/* 2. MAIN GRID: INTERACTIVE SVG MAP & DETAILED SIDEBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-2xs">
        
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-cyan-400 z-10">
            KORDINAT SUMATERA: -2.7115° S / 101.4243° E
          </div>

          <div className="absolute top-3 right-3 bg-indigo-950/85 backdrop-blur-xs px-2.5 py-1 rounded border border-indigo-900/60 text-[10px] font-mono text-slate-300 z-10 flex gap-2">
            <span>Darat: 14.30 km²</span>
            <span>Nelayan: 15 RT</span>
          </div>

          {/* Map Vector Stage */}
          <div className="flex-1 flex items-center justify-center py-4">
            <svg 
              viewBox="0 0 800 600" 
              className="w-full max-h-[460px] select-none"
            >
              <defs>
                <pattern id="gridLines" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>

              <rect width="800" height="600" fill="transparent" />
              <rect width="800" height="600" fill="url(#gridLines)" pointerEvents="none" />

              {/* DUSUN VECTOR POLYGONS */}
              {dusunDirectory.map((d) => {
                const isSelected = selectedDusunId === d.id;
                const isHovered = hoveredDusunId === d.id;

                return (
                  <g key={d.id} className="cursor-pointer">
                    <polygon
                      points={d.points}
                      fill={d.color}
                      fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.15}
                      stroke={d.color}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                      strokeDasharray={d.id === "dusun_4" ? "4,4" : "0"}
                      onClick={() => {
                        setSelectedDusunId(selectedDusunId === d.id ? null : d.id);
                      }}
                      onMouseEnter={() => setHoveredDusunId(d.id)}
                      onMouseLeave={() => setHoveredDusunId(null)}
                      className="transition-all duration-300"
                    />

                    {/* Central Text Flag labels */}
                    <rect
                      x={d.textX - 50}
                      y={d.textY - 14}
                      width="100"
                      height="24"
                      rx="4"
                      fill="#0f172a"
                      fillOpacity={0.8}
                      stroke={isSelected ? d.color : "#334155"}
                      strokeWidth="1"
                    />
                    <text
                      x={d.textX}
                      y={d.textY + 2}
                      textAnchor="middle"
                      fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {d.id === "dusun_1" ? "DUSUN I" : d.id === "dusun_2" ? "DUSUN II" : d.id === "dusun_3" ? "DUSUN III" : d.id === "dusun_4" ? "DUSUN IV" : "DUSUN V"}
                    </text>
                  </g>
                );
              })}

              {/* LANDMARKS INTERACTIVE MAP PINS */}
              {landmarkMarkers.map((m) => (
                <g 
                  key={m.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLandmark(m)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                >
                  <circle 
                    cx={m.x} 
                    cy={m.y} 
                    r="12" 
                    fill="#ef4444" 
                    fillOpacity="0.2" 
                    className="animate-ping" 
                  />
                  <circle 
                    cx={m.x} 
                    cy={m.y} 
                    r="5" 
                    fill="#ef4444" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Floating Hover Landmark Context */}
          {hoveredLandmark && (
            <div className="absolute bottom-3 left-3 bg-slate-950/90 text-white p-3.5 rounded-lg border border-red-500/40 text-[11px] leading-relaxed max-w-xs animate-fadeIn z-20">
              <span className="text-red-400 font-extrabold uppercase tracking-wider block font-mono text-[9px]">📍 LOKASI PRASARANA DESA</span>
              <strong className="block text-slate-100 font-bold mt-0.5">{hoveredLandmark.name}</strong>
              <p className="text-slate-400 mt-0.5 leading-normal">{hoveredLandmark.desc}</p>
            </div>
          )}

          {/* Interactive Tutorial Hint */}
          <div className="absolute bottom-3 right-3 bg-slate-950/75 p-2 rounded-md border border-slate-800 text-[9.5px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Klik bidang berwarna Dusun di atas untuk memfilter rincian sektoral.</span>
          </div>
        </div>

        {/* Informative Sideboard */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-extrabold font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Rincian Bidang Dusun
              </span>
            </div>

            {selectedDusun ? (
              <div className="space-y-3 text-xs leading-normal">
                <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-md p-2">
                  <strong className="text-slate-800 font-extrabold text-[12.5px] block truncate">{selectedDusun.name}</strong>
                  <span className={`w-3 h-3 rounded-full shrink-0 ${selectedDusun.bgTailwind}`} />
                </div>

                <p className="text-slate-500 leading-relaxed text-[11px] bg-white p-2.5 rounded border border-slate-100">
                  {selectedDusun.desc}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="block text-slate-400">Kepala Dusun (Kadus)</span>
                    <strong className="text-slate-705 font-bold">{selectedDusun.head}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="block text-slate-400">Rasio Luas Alokasi</span>
                    <strong className="text-slate-705 font-bold">{selectedDusun.areaSizeKm} km²</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="block text-slate-400">Cakupan Kelompok</span>
                    <strong className="text-emerald-700 font-bold">{selectedDusun.rtRange}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="block text-slate-400">Pekerjaan Terbanyak</span>
                    <span className="block font-bold text-slate-705 truncate" title={selectedDusun.occupation}>{selectedDusun.occupation}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/70 text-slate-650 flex justify-between items-center text-[10.5px]">
                  <span>Total Pemukim Sektor:</span>
                  <strong className="font-mono text-slate-800 text-[11.5px]">{selectedDusun.population} Jiwa ({selectedDusun.families} Keluarga)</strong>
                </div>

                {selectedDusunId && (
                  <button
                    onClick={() => setSelectedDusunId(null)}
                    className="w-full text-center bg-slate-200 hover:bg-slate-300 text-slate-700 py-1.5 rounded text-[10px] font-bold uppercase transition"
                  >
                    Buka Fokus Sektoral
                  </button>
                )}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2">
                <Compass className="w-8 h-8 text-slate-300 animate-spin-slow" />
                <p className="text-[11px] leading-relaxed">Letakkan kursor di atas sektor peta atau klik bidang poligonal untuk memotong analisis demografi spasial per Dusun secara instan.</p>
              </div>
            )}
          </div>

          {/* Static Sektoral occupation insights */}
          <div className="bg-emerald-900 text-white rounded-xl p-4 border border-emerald-800 shadow-2xs space-y-2">
            <h4 className="text-[10px] font-bold text-emerald-300 font-mono tracking-wider uppercase block">POTENSI KOMODITAS DESA</h4>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-100">Perkebunan Sawit Mandiri</span>
              <span className="font-bold font-mono text-emerald-300">54% Areal</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-100">Pertanian Padi & Palawija</span>
              <span className="font-bold font-mono text-emerald-300">28% Areal</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-100">Perikanan Pesisir Jeti Laut</span>
              <span className="font-bold font-mono text-emerald-300">18% Areal</span>
            </div>
            <p className="text-[10px] text-emerald-200/70 pt-1.5 border-t border-emerald-800/60 leading-normal">
              75% hasil panen komoditas diangkut melintasi Jalan Sentra Tani RT 12 yang kini sedang dirabat beton setebal 25cm.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
