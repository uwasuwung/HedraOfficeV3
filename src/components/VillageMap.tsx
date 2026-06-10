import React, { useState, useRef, useMemo } from "react";
import {
  Map,
  MapPin,
  Compass,
  Layers,
  Search,
  Plus,
  Minus,
  Info,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Trash2,
  Building,
  Activity,
  Users,
  Eye,
  PlusCircle,
  X
} from "lucide-react";
import { DesaDataResponse } from "../types";

// Structuring Dusun / RW clusters to map the 74 RTs perfectly
interface DusunData {
  id: string;
  name: string;
  head: string;
  population: number;
  families: number;
  areaSizeKm: number;
  rtRange: string;
  rtCount: number;
  rtStart: number;
  rtEnd: number;
  povertyRate: number; // For social services view
  color: string;
  bgTailwind: string;
  desc: string;
}

const dusunList: DusunData[] = [
  {
    id: "dusun_1",
    name: "Dusun I (Pondok Panjang Barat)",
    head: "Samsul Bahri",
    population: 1120,
    families: 384,
    areaSizeKm: 2.8,
    rtRange: "RT 01 - RT 15",
    rtCount: 15,
    rtStart: 1,
    rtEnd: 15,
    povertyRate: 15.4,
    color: "#3B82F6",
    bgTailwind: "bg-blue-500",
    desc: "Wilayah pesisir pantai barat yang berbatasan dengan Samudra Hindia. Fokus utama pada sektor perikanan tangkap, pariwisata pesisir, serta perdagangan mikro pelabuhan rakyat."
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
    rtStart: 16,
    rtEnd: 30,
    povertyRate: 8.2,
    color: "#F59E0B",
    bgTailwind: "bg-amber-500",
    desc: "Pusat pemerintahan Desa Pondok Panjang. Menampung kantor kepala desa, pasar mingguan, sekolah, masjid jami', serta fasilitas kesehatan utama. Kepadatan penduduk tertinggi."
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
    rtStart: 31,
    rtEnd: 45,
    povertyRate: 18.1,
    color: "#10B981",
    bgTailwind: "bg-emerald-500",
    desc: "Sentra irigasi dan persawahan Desa Pondok Panjang. Dialiri oleh hilir Sungai Teramang. Pekerjaan dominan warga adalah petani padi sawah dan buruh tani musiman."
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
    rtStart: 46,
    rtEnd: 60,
    povertyRate: 12.5,
    color: "#8B5CF6",
    bgTailwind: "bg-purple-500",
    desc: "Wilayah perbukitan rendah yang kaya akan komoditas perkebunan sawit mandiri dan karet alam. Berbatasan dengan batas areal konsesi hutan produksi terbatas."
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
    rtStart: 61,
    rtEnd: 74,
    povertyRate: 11.2,
    color: "#EC4899",
    bgTailwind: "bg-pink-500",
    desc: "Zona pengembangan baru di utara desa. Mayoritas diisi oleh transmigran lokal dan pekerja perkebunan sawit. Memiliki sekolah kejuruan satelit dan pusat kerajinan anyaman bambu."
  }
];

// Locations of interest on the physical map
interface MapMarker {
  id: string;
  name: string;
  type: "office" | "health" | "school" | "worship" | "program";
  programCode?: string;
  x: number; // percentage
  y: number; // percentage
  desc: string;
}

const landmarkMarkers: MapMarker[] = [
  { id: "lm_1", name: "Kantor Kepala Desa Pondok Panjang", type: "office", x: 42, y: 35, desc: "Pusat pelayanan administrasi kependudukan dan operasional server lokal." },
  { id: "lm_2", name: "Puskesmas Pembina Teramang Jaya", type: "health", x: 48, y: 38, desc: "Fasilitas poliklinik desa, posko imunisasi balita serta rujukan darurat." },
  { id: "lm_3", name: "SD Negeri 02 Teramang Jaya", type: "school", x: 38, y: 44, desc: "Sekolah dasar negeri binaan unggulan pariwisata kelautan." },
  { id: "lm_4", name: "Masjid Raya Baiturrahman", type: "worship", x: 45, y: 28, desc: "Tempat ibadah utama sekaligus pusat pengajian pemuda Nadhlatul Ulama." },
  { id: "lm_5", name: "PR-01: Proyek Jalan Rabat Beton", type: "program", programCode: "PR-01", x: 22, y: 62, desc: "Pembangunan beton tebal di pesisir barat menuju pendaratan perahu." },
  { id: "lm_6", name: "PR-02: Optimalisasi Saluran Drainase", type: "program", programCode: "PR-02", x: 52, y: 46, desc: "Pelebaran selokan induk mengalirkan air limpahan langsung ke parit sekunder." },
  { id: "lm_7", name: "PR-03: Posyandu Lansia & Balita", type: "program", programCode: "PR-03", x: 80, y: 78, desc: "Renovasi dan suplai alat ukur gizi berskala nasional." },
  { id: "lm_8", name: "PR-06: Rehabilitasi Saluran Irigasi", type: "program", programCode: "PR-06", x: 68, y: 25, desc: "Tembok turap penahan longsor saluran air sawah Dusun III." }
];

// Interactive report pins placed by the user
interface IncidentPin {
  id: string;
  title: string;
  category: "Infrastruktur" | "Kebersihan" | "Keamanan" | "Keluhan" | "Lainnya";
  severity: "Rendah" | "Sedang" | "Darurat";
  x: number; // SVG coordinate x (0-800)
  y: number; // SVG coordinate y (0-600)
  lat: number;
  lng: number;
  rt: number;
  reporter: string;
  phone: string;
  date: string;
  status: "Draf Laporan" | "Menunggu Verifikasi" | "Sedang Diproses" | "Selesai";
  description: string;
}

const initialPins: IncidentPin[] = [
  {
    id: "PIN-01",
    title: "Tiang Penerangan Jalan Roboh",
    category: "Infrastruktur",
    severity: "Darurat",
    x: 460,
    y: 290,
    lat: -2.7115,
    lng: 101.4243,
    rt: 22,
    reporter: "Adi Santoso",
    phone: "0813-9878-1211",
    date: "2026-06-09",
    status: "Sedang Diproses",
    description: "Tiang lampu miring ke arah kabel listik tegangan sedang di depan masjid jami RT 22 setelah diterpa angin kencang kemarin sore."
  },
  {
    id: "PIN-02",
    title: "Tumpukan Sampah di Mulut Gorong-Gorong",
    category: "Kebersihan",
    severity: "Sedang",
    x: 320,
    y: 380,
    lat: -2.7162,
    lng: 101.4211,
    rt: 9,
    reporter: "Yulianti",
    phone: "0852-1144-8899",
    date: "2026-06-10",
    status: "Menunggu Verifikasi",
    description: "Saluran tersumbat dahan pohon dan sampah plastik kemasan mengakibatkan air meluap ke badan aspal jalan nasional setiap hujan deras."
  }
];

interface VillageMapProps {
  villageData: DesaDataResponse | null;
  addToast: (message: string, type: "success" | "error" | "info" | "warning", title?: string) => void;
}

export default function VillageMap({ villageData, addToast }: VillageMapProps) {
  // Map settings
  const [mapMode, setMapMode] = useState<"standard" | "density" | "infrastructure" | "welfare">("standard");
  const [selectedDusunId, setSelectedDusunId] = useState<string | null>(null);
  const [hoveredDusunId, setHoveredDusunId] = useState<string | null>(null);
  const [searchRtQuery, setSearchRtQuery] = useState("");
  const [selectedRt, setSelectedRt] = useState<number | null>(null);
  const [isPinModeActive, setIsPinModeActive] = useState(false);
  const [activePins, setActivePins] = useState<IncidentPin[]>(initialPins);

  // Pin droper states
  const [newPinCoords, setNewPinCoords] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const [newPinForm, setNewPinForm] = useState({
    title: "",
    category: "Infrastruktur" as IncidentPin["category"],
    severity: "Sedang" as IncidentPin["severity"],
    rt: 1,
    reporter: "",
    phone: "",
    description: ""
  });

  // Simulated Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapSvgContainerRef = useRef<HTMLDivElement>(null);

  // Generate all 74 RTs list dynamically for lookup
  const rtList = useMemo(() => {
    const list = [];
    for (let rtNum = 1; rtNum <= 74; rtNum++) {
      // Find which Dusun contains this RT
      const dusun = dusunList.find(d => rtNum >= d.rtStart && rtNum <= d.rtEnd);
      if (dusun) {
        // Deterministic mock population and KK per RT
        const seed = (rtNum * 17) % 30;
        const familiesCount = 15 + seed;
        const populationCount = Math.floor(familiesCount * (3.1 + (rtNum % 4) * 0.2));
        const bltRatePercentage = Math.floor(6 + (rtNum % 7) * 4);
        
        // Mock coordinates mapped to physical regions
        // Scale to around standard village boundary: -2.7100 to -2.7300 S, 101.4100 to 101.4400 E
        let latOffset = -2.7120;
        let lngOffset = 101.4220;
        if (dusun.id === "dusun_1") { latOffset = -2.7180 + (rtNum % 15) * 0.0005; lngOffset = 101.4130 + (rtNum % 3) * 0.001; }
        else if (dusun.id === "dusun_2") { latOffset = -2.7130 + (rtNum % 15) * 0.0004; lngOffset = 101.4210 + (rtNum % 4) * 0.0008; }
        else if (dusun.id === "dusun_3") { latOffset = -2.7110 + (rtNum % 15) * 0.0003; lngOffset = 101.4280 + (rtNum % 3) * 0.0009; }
        else if (dusun.id === "dusun_4") { latOffset = -2.7220 + (rtNum % 15) * 0.0004; lngOffset = 101.4260 + (rtNum % 3) * 0.0012; }
        else if (dusun.id === "dusun_5") { latOffset = -2.7090 + (rtNum % 14) * 0.0006; lngOffset = 101.4230 + (rtNum % 4) * 0.001; }

        list.push({
          rt: rtNum,
          dusunId: dusun.id,
          dusunName: dusun.name,
          headOfDusun: dusun.head,
          families: familiesCount,
          population: populationCount,
          bltRate: bltRatePercentage,
          lat: parseFloat(latOffset.toFixed(5)),
          lng: parseFloat(lngOffset.toFixed(5)),
          occupation: rtNum % 5 === 0 ? "Pedagang" : rtNum % 4 === 0 ? "Nelayan" : rtNum % 3 === 0 ? "Petani Sawit" : "Petani Padi"
        });
      }
    }
    return list;
  }, []);

  const filteredRtList = useMemo(() => {
    if (!searchRtQuery) return rtList;
    return rtList.filter(item => 
      `rt ${item.rt}`.toLowerCase().includes(searchRtQuery.toLowerCase()) ||
      `rt${item.rt}`.toLowerCase().includes(searchRtQuery.toLowerCase()) ||
      item.dusunName.toLowerCase().includes(searchRtQuery.toLowerCase()) ||
      item.occupation.toLowerCase().includes(searchRtQuery.toLowerCase())
    );
  }, [searchRtQuery, rtList]);

  // Click handler on the SVG map to check for coordinates and drop report pin
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPinModeActive) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Capture relative coordinates in terms of the viewBox (800 x 600)
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const x = Math.round((clientX / rect.width) * 800);
    const y = Math.round((clientY / rect.height) * 600);

    // Convert coordinates to simulated realistic Lat/Lng coordinate bounds of Pondok Panjang
    // Bengkulu: Southwest Sumatra is negative latitude, positive longitude
    const lat = parseFloat((-2.7100 - (y / 600) * 0.015).toFixed(5));
    const lng = parseFloat((101.4120 + (x / 800) * 0.024).toFixed(5));

    // Guess RT based on proximity or random sector
    let approximateRt = 1;
    // Simple spatial mapping for RT selection
    if (x < 250) { approximateRt = Math.floor(1 + (y % 15)); } // West - Dusun I
    else if (x < 450 && y > 300) { approximateRt = Math.floor(16 + (y % 15)); } // Sentosa - Dusun II
    else if (x >= 450 && y < 250) { approximateRt = Math.floor(31 + (y % 15)); } // East - Dusun III
    else if (x >= 450 && y >= 250) { approximateRt = Math.floor(46 + (y % 15)); } // Plantation - Dusun IV
    else { approximateRt = Math.floor(61 + (y % 14)); } // Maju Makmur - Dusun V

    setNewPinCoords({ x, y, lat, lng });
    setNewPinForm(prev => ({
      ...prev,
      rt: approximateRt,
      title: "",
      description: ""
    }));

    addToast(`Titik koordinat berhasil dikunci pada (${lat}, ${lng}). Silakan isi detail keluhan untuk mengonfirmasi pelaporan.`, "success");
  };

  // Submit the digital report pin
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinCoords || !newPinForm.title.trim() || !newPinForm.reporter.trim()) {
      addToast("Harap isi semua kolom wajib untuk merekrut koordinat aduan.", "error");
      return;
    }

    const pinId = `PIN-0${activePins.length + 1}`;
    const newIncident: IncidentPin = {
      id: pinId,
      title: newPinForm.title,
      category: newPinForm.category,
      severity: newPinForm.severity,
      x: newPinCoords.x,
      y: newPinCoords.y,
      lat: newPinCoords.lat,
      lng: newPinCoords.lng,
      rt: newPinForm.rt,
      reporter: newPinForm.reporter,
      phone: newPinForm.phone || "Tidak Ada",
      date: new Date().toISOString().split("T")[0],
      status: "Menunggu Verifikasi",
      description: newPinForm.description
    };

    setActivePins([newIncident, ...activePins]);
    setIsPinModeActive(false);
    setNewPinCoords(null);
    setSelectedRt(newIncident.rt);

    addToast(`Laporan Geospasial ID ${pinId} berhasil ditambahkan di RT ${newIncident.rt}! Unit Linmas & Satgas Desa akan segera memverifikasi kondisi fisik di lapangan.`, "success");
  };

  // Pan and Zoom controllers
  const handleZoom = (factor: number) => {
    setZoomLevel(prev => Math.max(1, Math.min(4, prev * factor)));
    if (factor < 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPinModeActive) return; // Disable drag during pin dropping
    isDragging.current = true;
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || zoomLevel === 1) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Selected RT properties
  const selectedRtInfo = useMemo(() => {
    if (selectedRt === null) return null;
    return rtList.find(item => item.rt === selectedRt) || null;
  }, [selectedRt, rtList]);

  // Selected Dusun properties
  const activeDusun = useMemo(() => {
    const dId = selectedDusunId || hoveredDusunId;
    if (!dId) return null;
    return dusunList.find(d => d.id === dId) || null;
  }, [selectedDusunId, hoveredDusunId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col xl:flex-row h-[780px]">
      
      {/* LEFT SIDE PANEL: Controls, Search Index, and Selected Object Stats */}
      <div className="w-full xl:w-[380px] border-r border-slate-200 flex flex-col justify-between shrink-0 bg-slate-50 overflow-y-auto">
        
        {/* Header & Mode Selector */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Dashboard GIS Pondok Panjang</h3>
              <p className="text-[11px] text-slate-500">Peta Digital & Monitoring Tata Ruang Wilayah</p>
            </div>
          </div>

          {/* Mode Layers */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 font-mono block uppercase tracking-wide">PILIH LAYER VISUALISASI</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setMapMode("standard")}
                className={`py-1.5 px-2.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 border border-transparent ${
                  mapMode === "standard"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                Sektoral Admon
              </button>
              <button
                onClick={() => setMapMode("density")}
                className={`py-1.5 px-2.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 border border-transparent ${
                  mapMode === "density"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Users className="w-3 h-3 text-amber-400" />
                Kepadatan Penduduk
              </button>
              <button
                onClick={() => setMapMode("infrastructure")}
                className={`py-1.5 px-2.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 border border-transparent ${
                  mapMode === "infrastructure"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Building className="w-3 h-3 text-blue-400" />
                Infrastruktur APBDes
              </button>
              <button
                onClick={() => setMapMode("welfare")}
                className={`py-1.5 px-2.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 border border-transparent ${
                  mapMode === "welfare"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Sosial & Kesejahteraan
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Context Panel */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          
          {/* Active Pin Dropper Form Overlay */}
          {newPinCoords && isPinModeActive ? (
            <form onSubmit={handleSavePin} className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500 animate-bounce" /> Sematkan Laporan Baru
                </span>
                <button 
                  type="button" 
                  onClick={() => setNewPinCoords(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 bg-white/85 p-2 rounded border border-blue-100 text-[10px] font-mono text-slate-600">
                <div><span className="font-semibold">Sim. Koordinat :</span> Lat {newPinCoords.lat}, Lng {newPinCoords.lng}</div>
                <div><span className="font-semibold">Lokasi Dusun    :</span> {(dusunList.find(d => newPinForm.rt >= d.rtStart && newPinForm.rt <= d.rtEnd))?.name || "Luar Batas"}</div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">NAMA KELUHAN / INSIDEN *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gorong-gorong Sumbat"
                    className="w-full px-2 py-1.5 rounded border border-slate-250 bg-white"
                    value={newPinForm.title}
                    onChange={e => setNewPinForm({...newPinForm, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">KATEGORI</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded border border-slate-250 bg-white"
                      value={newPinForm.category}
                      onChange={e => setNewPinForm({...newPinForm, category: e.target.value as IncidentPin["category"]})}
                    >
                      <option value="Infrastruktur">Jalan/Drainase</option>
                      <option value="Kebersihan">Sampah/Kebersihan</option>
                      <option value="Keamanan">Kamtibmas/Lampu</option>
                      <option value="Keluhan">Keluhan Layanan</option>
                      <option value="Lainnya">Lain-lain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">URGENSI</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded border border-slate-250 bg-white"
                      value={newPinForm.severity}
                      onChange={e => setNewPinForm({...newPinForm, severity: e.target.value as IncidentPin["severity"]})}
                    >
                      <option value="Rendah">Rendah (Hijau)</option>
                      <option value="Sedang">Sedang (Kuning)</option>
                      <option value="Darurat">Darurat (Merah)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">PILIH RT (1-74)</label>
                    <input
                      type="number"
                      min={1}
                      max={74}
                      className="w-full px-2 py-1.5 rounded border border-slate-250 bg-white"
                      value={newPinForm.rt}
                      onChange={e => setNewPinForm({...newPinForm, rt: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">PELAPOR (NAMA) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Warga"
                      className="w-full px-2 py-1.5 rounded border border-slate-250 bg-white"
                      value={newPinForm.reporter}
                      onChange={e => setNewPinForm({...newPinForm, reporter: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">HP / WHATSAPP KONTTAK</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-34xx-xxxx"
                    className="w-full px-2 py-1.5 rounded border border-slate-250 bg-white"
                    value={newPinForm.phone}
                    onChange={e => setNewPinForm({...newPinForm, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">DESKRIPSI LENGKAP KELUHAN</label>
                  <textarea
                    rows={2}
                    placeholder="Tulis kronologi singkat kerusakan fisik jalan, jembatan atau fasilitas sosial di sini..."
                    className="w-full px-2 py-1.5 rounded border border-slate-250 bg-white resize-none"
                    value={newPinForm.description}
                    onChange={e => setNewPinForm({...newPinForm, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
                >
                  Ajukan Laporan Geospasial
                </button>
                <button
                  type="button"
                  onClick={() => setNewPinCoords(null)}
                  className="px-3 bg-slate-200 hover:bg-slate-300 rounded font-medium cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* DEFAULT PIN TOGGLER */}
              <div className="bg-slate-800 text-white p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono tracking-wider text-slate-350">PELAPORAN GEOSPASIAL</span>
                  <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Temukan lubang jalan, jembatan rusak atau selokan mati? Klik tombol di bawah ini lalu sematkan titik aduan langsung di atas bidang peta.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsPinModeActive(!isPinModeActive);
                    setNewPinCoords(null);
                    if (!isPinModeActive) {
                      addToast("Mode Semat PIN diaktifkan! Silakan arahkan kursor ke dalam peta dan klik lokasi aduan.", "info");
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold font-mono tracking-wide cursor-pointer transition flex items-center justify-center gap-1.5 border ${
                    isPinModeActive
                      ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                      : "bg-blue-600 text-white border-transparent hover:bg-blue-500"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isPinModeActive ? "animate-bounce" : ""}`} />
                  {isPinModeActive ? "BATALKAN MODE PIN" : "AKTIFKAN MODE PIN ADUAN"}
                </button>
              </div>

              {/* SEARCH RT/RW SECTION */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2.5">
                <span className="block text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Pencarian Indeks RT/RW</span>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Ketik nomor RT (contoh: RT 12, Padi)..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-250 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition"
                    value={searchRtQuery}
                    onChange={e => setSearchRtQuery(e.target.value)}
                  />
                  {searchRtQuery && (
                    <button
                      onClick={() => setSearchRtQuery("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1 rounded hover:bg-slate-100"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* RT search results layout */}
                {searchRtQuery && (
                  <div className="max-h-36 overflow-y-auto border border-slate-150 rounded divide-y divide-slate-100 text-xs bg-white">
                    {filteredRtList.length === 0 ? (
                      <div className="p-3 text-center text-slate-400 text-[11px]">Format pencarian tidak ditemukan.</div>
                    ) : (
                      filteredRtList.map(item => (
                        <button
                          key={item.rt}
                          type="button"
                          onClick={() => {
                            setSelectedRt(item.rt);
                            setSelectedDusunId(item.dusunId);
                            setSearchRtQuery("");
                            // Zoom to RT offset
                            setZoomLevel(1.5);
                            addToast(`RT ${item.rt} berhasil dipilih! Info detail dimuat di panel kiri bawah.`, "info");
                          }}
                          className="w-full px-3 py-2 hover:bg-slate-50 text-left flex justify-between items-center cursor-pointer font-medium text-slate-700 hover:text-slate-900"
                        >
                          <span>Masyarakat Rukun Tetangga (RT {item.rt})</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded-sm text-slate-500 uppercase">{item.occupation}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* DUSUN SECTOR DETAILS */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Detail Geosektoral
                  </h4>
                  {selectedDusunId && (
                    <button
                      onClick={() => {
                        setSelectedDusunId(null);
                        setSelectedRt(null);
                      }}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      Tampilkan Desa Senggang
                    </button>
                  )}
                </div>

                {activeDusun ? (
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900 leading-tight">{activeDusun.name}</span>
                      <span className={`w-3 h-3 rounded-full ${activeDusun.id === "dusun_1" ? "bg-blue-500" : activeDusun.id === "dusun_2" ? "bg-amber-500" : activeDusun.id === "dusun_3" ? "bg-emerald-500" : activeDusun.id === "dusun_4" ? "bg-purple-500" : "bg-pink-500"}`} />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-150/70">
                      {activeDusun.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="block text-[10px] text-slate-500">Kepala Dusun</span>
                        <strong className="text-slate-800 font-bold">{activeDusun.head}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="block text-[10px] text-slate-500">Areal Teritorial</span>
                        <strong className="text-slate-800 font-bold">{activeDusun.areaSizeKm} km²</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="block text-[10px] text-slate-500">Cakupan Wilayah</span>
                        <strong className="text-slate-800 font-bold">{activeDusun.rtRange}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-150">
                        <span className="block text-[10px] text-slate-500">Total Kepadatan</span>
                        <strong className="text-slate-800 font-bold">{activeDusun.population} Jiwa ({activeDusun.families} KK)</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                    <Info className="w-5 h-5 text-slate-300" />
                    <p className="leading-relaxed">Arahkan petunjuk tetikus (mouse hover) atau klik pada bidang wilayah peta di samping untuk mendeteksi rincian tiap Dusun.</p>
                  </div>
                )}
              </div>

              {/* SELECTED RT INDIVIDUAL STATS */}
              {selectedRtInfo && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-200/80 space-y-3">
                  <div className="flex justify-between items-center border-b border-blue-150 pb-2">
                    <h5 className="font-bold text-blue-900 text-xs flex items-center gap-1.5 uppercase font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> STATISTIK RT {selectedRtInfo.rt} / RW 0{selectedRtInfo.dusunId.slice(-1)}
                    </h5>
                    <button
                      onClick={() => setSelectedRt(null)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 hover:bg-slate-100 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Populasi Penduduk</span>
                      <p className="font-bold text-slate-800 text-sm">{selectedRtInfo.population} Jiwa</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Jumlah Kepala Keluarga</span>
                      <p className="font-bold text-slate-800 text-sm">{selectedRtInfo.families} KK</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Mata Pencaharian RT</span>
                      <p className="font-bold text-blue-750">{selectedRtInfo.occupation}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Rasio Bansos (BLT)</span>
                      <p className="font-bold text-amber-700">{selectedRtInfo.bltRate}% Jiwa</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-150/50 text-[10px] font-mono text-slate-500 flex justify-between">
                    <span>G-LAT: {selectedRtInfo.lat}</span>
                    <span>G-LNG: {selectedRtInfo.lng}</span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* BOTTOM LEGEND SECTION */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0 select-none text-[10px] leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> LEGEND PETA TERITORIAL:
          </div>
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-sm shrink-0" />
              <span>Dusun I (Barat)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-sm shrink-0" />
              <span>Dusun II (Sentosa)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#10B981] rounded-sm shrink-0" />
              <span>Dusun III (Timur)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-sm shrink-0" />
              <span>Dusun IV (Rancah)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#EC4899] rounded-sm shrink-0" />
              <span>Dusun V (Maju)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#EF4444] inline-block shrink-0" />
              <span>Jl. Lintas Sumatera</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT MAIN MAP BOX: Dynamic Scale interactive SVG Canvas */}
      <div className="flex-1 bg-slate-900 relative flex flex-col justify-between overflow-hidden">
        
        {/* UPPER MAP OVERLAYS CONTROLLER */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          
          <div className="bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-bold text-slate-200 shadow-sm flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>DATA GIS LIVE DESA PONDOK PANJANG</span>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex gap-3 shadow-sm">
            <div>SCALE: 1:15.000</div>
            <div>74 RT Terplot</div>
          </div>

        </div>

        {/* RIGHT UPPER MAP ACTIONS CONTAINER (ZOOM, RESET, CLEAR PINS) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <div className="bg-slate-950/80 backdrop-blur-xs p-1 rounded-lg border border-slate-800 flex flex-col shadow-md">
            <button
              onClick={() => handleZoom(1.3)}
              className="p-2 hover:bg-slate-800 rounded font-bold text-white transition-colors cursor-pointer"
              title="Perbesar Peta"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1 / 1.3)}
              className="p-2 hover:bg-slate-800 rounded font-bold text-white transition-colors cursor-pointer border-t border-slate-800"
              title="Perkecil Peta"
              disabled={zoomLevel === 1}
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
              setSelectedDusunId(null);
              setSelectedRt(null);
              addToast("Tampilan peta diatur ulang ke bentuk utuh.", "info");
            }}
            className="p-2.5 bg-slate-950/80 backdrop-blur-xs hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg shadow-md cursor-pointer text-xs font-bold font-mono"
            title="Reset Peta"
          >
            FIT
          </button>
        </div>

        {/* SPATIAL INTERACTIVE CANVAS CONTAINER */}
        <div
          ref={mapSvgContainerRef}
          className={`flex-1 w-full h-[580px] select-none relative ${zoomLevel > 1 ? "cursor-move" : "cursor-default"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Simulated Geolocation Coordinate Grid in Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 font-mono text-[8px] text-cyan-400 p-2 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between">
              <span>LAT : -2.7095°</span>
              <span>LAT : -2.7095°</span>
            </div>
            <div className="flex justify-between">
              <span>LNG : 101.4120°</span>
              <span>LNG : 101.4360°</span>
            </div>
            <div className="flex justify-between">
              <span>LAT : -2.7245°</span>
              <span>LAT : -2.7245°</span>
            </div>
          </div>

          {/* MODE EXPLANATORY WATERMARK */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 p-3 rounded-xl border border-slate-800 space-y-1.5 max-w-sm pointer-events-none">
            <h4 className="text-[10px] font-bold text-slate-300 font-mono tracking-wider uppercase">ACTIVE LAYER OVERLAY</h4>
            <div className="flex items-center gap-2">
              {mapMode === "standard" && (
                <>
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <div>
                    <strong className="text-white text-xs block">Batas Sektoral Dusun (Standard)</strong>
                    <span className="text-[10px] text-slate-400">Pembagian administrative kewilayahan RT/RW resmi desa.</span>
                  </div>
                </>
              )}
              {mapMode === "density" && (
                <>
                  <Users className="w-4 h-4 text-amber-400" />
                  <div>
                    <strong className="text-white text-xs block">Heatmap Kepadatan Penduduk</strong>
                    <span className="text-[10px] text-slate-400">Warna merah & orange mengindikasikan konsentrasi pemukiman tinggi.</span>
                  </div>
                </>
              )}
              {mapMode === "infrastructure" && (
                <>
                  <Building className="w-4 h-4 text-blue-400 animate-pulse" />
                  <div>
                    <strong className="text-white text-xs block">Lokasi Program Prioritas APBDes</strong>
                    <span className="text-[10px] text-slate-400">Titik lokasi fisik pembangunan jalan rabat beton, drainase & irigasi.</span>
                  </div>
                </>
              )}
              {mapMode === "welfare" && (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div>
                    <strong className="text-white text-xs block">Indeks Kerentanan Sosial (Bansos)</strong>
                    <span className="text-[10px] text-slate-400">Makin merah/ungu menandakan konsentrasi sasaran BLT-DD tertinggi.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <svg
            viewBox="0 0 800 600"
            className="w-full h-full transition-transform duration-75 origin-center pointer-events-auto"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            }}
            onClick={handleMapClick}
          >
            {/* GRIDS */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
              <radialGradient id="waterGradient" cx="20%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="100%" stopColor="#1C2541" />
              </radialGradient>
            </defs>

            {/* Ocean Area Grid background */}
            <rect width="800" height="600" fill="url(#mapGrid)" />

            {/* SAMUDRA HINDIA (INDIAN OCEAN - Left coastal edge) */}
            <path
              d="M 0,0 L 140,0 Q 150,150 120,300 Q 100,450 160,600 L 0,600 Z"
              fill="#1e293b"
              fillOpacity="0.9"
              stroke="#475569"
              strokeWidth="2"
            />
            
            <path
              d="M 0,0 L 140,0 Q 150,150 120,300 Q 100,450 160,600"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeOpacity="0.4"
            />

            {/* Ocean Typography */}
            <text
              x="50"
              y="320"
              fill="#64748b"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              transform="rotate(-85, 50, 320)"
              className="tracking-wider"
            >
              SAMUDRA HINDIA (PESISIR MUKOMUKO)
            </text>

            <text
              x="110"
              y="590"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              className="tracking-wide"
            >
              Garis Pantai Teramang Jaya
            </text>

            {/* ADMINISTRATIVE DUSUN PATHS (The 5 major polygons of Pondok Panjang) */}
            {/* ================= DUSUN 1: WEST (Blue) ================= */}
            <path
              d="M 140,0 L 320,0 L 280,220 L 220,290 L 125,270 Z"
              fill={mapMode === "density" ? "#ea580c" : mapMode === "welfare" ? "#a855f7" : "#3b82f6"}
              fillOpacity={
                hoveredDusunId === "dusun_1" || selectedDusunId === "dusun_1"
                  ? 0.5
                  : mapMode === "density"
                  ? 0.4
                  : mapMode === "welfare"
                  ? 0.35
                  : 0.18
              }
              stroke="#3b82f6"
              strokeWidth={selectedDusunId === "dusun_1" ? "3 M" : "1.5"}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-45"
              onMouseEnter={() => setHoveredDusunId("dusun_1")}
              onMouseLeave={() => setHoveredDusunId(null)}
              onClick={(e) => {
                if (isPinModeActive) return;
                e.stopPropagation();
                setSelectedDusunId("dusun_1");
                setSelectedRt(null);
                addToast("Dusun I (Pondok Panjang Barat) terpilih di peta.", "info");
              }}
            />

            {/* ================= DUSUN 2: CENTRAL GOV (Orange) ================= */}
            <path
              d="M 320,0 L 520,0 L 480,260 L 280,220 Z"
              fill={mapMode === "density" ? "#b91c1c" : mapMode === "welfare" ? "#4b5563" : "#f59e0b"}
              fillOpacity={
                hoveredDusunId === "dusun_2" || selectedDusunId === "dusun_2"
                  ? 0.5
                  : mapMode === "density"
                  ? 0.65
                  : mapMode === "welfare"
                  ? 0.2
                  : 0.18
              }
              stroke="#f59e0b"
              strokeWidth={selectedDusunId === "dusun_2" ? "3" : "1.5"}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-45"
              onMouseEnter={() => setHoveredDusunId("dusun_2")}
              onMouseLeave={() => setHoveredDusunId(null)}
              onClick={(e) => {
                if (isPinModeActive) return;
                e.stopPropagation();
                setSelectedDusunId("dusun_2");
                setSelectedRt(null);
                addToast("Dusun II (Pondok Panjang Sentosa) terpilih di peta.", "info");
              }}
            />

            {/* ================= DUSUN 3: EAST COOP (Green) ================= */}
            <path
              d="M 520,0 L 800,0 L 800,280 L 480,260 Z"
              fill={mapMode === "density" ? "#f97316" : mapMode === "welfare" ? "#d946ef" : "#10b981"}
              fillOpacity={
                hoveredDusunId === "dusun_3" || selectedDusunId === "dusun_3"
                  ? 0.5
                  : mapMode === "density"
                  ? 0.3
                  : mapMode === "welfare"
                  ? 0.7
                  : 0.18
              }
              stroke="#10b981"
              strokeWidth={selectedDusunId === "dusun_3" ? "3" : "1.5"}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-45"
              onMouseEnter={() => setHoveredDusunId("dusun_3")}
              onMouseLeave={() => setHoveredDusunId(null)}
              onClick={(e) => {
                if (isPinModeActive) return;
                e.stopPropagation();
                setSelectedDusunId("dusun_3");
                setSelectedRt(null);
                addToast("Dusun III (Pondok Panjang Timur) terpilih di peta.", "info");
              }}
            />

            {/* ================= DUSUN 4: MOUNTAIN / SOUTH (Purple) ================= */}
            <path
              d="M 125,270 L 220,290 L 280,220 L 480,260 L 440,600 L 160,600 Z"
              fill={mapMode === "density" ? "#f97316" : mapMode === "welfare" ? "#a855f7" : "#8b5cf6"}
              fillOpacity={
                hoveredDusunId === "dusun_4" || selectedDusunId === "dusun_4"
                  ? 0.5
                  : mapMode === "density"
                  ? 0.35
                  : mapMode === "welfare"
                  ? 0.45
                  : 0.18
              }
              stroke="#8b5cf6"
              strokeWidth={selectedDusunId === "dusun_4" ? "3" : "1.5"}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-45"
              onMouseEnter={() => setHoveredDusunId("dusun_4")}
              onMouseLeave={() => setHoveredDusunId(null)}
              onClick={(e) => {
                if (isPinModeActive) return;
                e.stopPropagation();
                setSelectedDusunId("dusun_4");
                setSelectedRt(null);
                addToast("Dusun IV (Rancah Indah) terpilih di peta.", "info");
              }}
            />

            {/* ================= DUSUN 5: NEW DEVELOPMENT - SOUTH EAST (Pink) ================= */}
            <path
              d="M 480,260 L 800,280 L 800,600 L 440,600 Z"
              fill={mapMode === "density" ? "#ea580c" : mapMode === "welfare" ? "#a855f7" : "#ec4899"}
              fillOpacity={
                hoveredDusunId === "dusun_5" || selectedDusunId === "dusun_5"
                  ? 0.5
                  : mapMode === "density"
                  ? 0.25
                  : mapMode === "welfare"
                  ? 0.35
                  : 0.18
              }
              stroke="#ec4899"
              strokeWidth={selectedDusunId === "dusun_5" ? "3" : "1.5"}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-45"
              onMouseEnter={() => setHoveredDusunId("dusun_5")}
              onMouseLeave={() => setHoveredDusunId(null)}
              onClick={(e) => {
                if (isPinModeActive) return;
                e.stopPropagation();
                setSelectedDusunId("dusun_5");
                setSelectedRt(null);
                addToast("Dusun V (Maju Makmur) terpilih di peta.", "info");
              }}
            />

            {/* GEOGRAPHICAL FEATURES */}
            {/* Sungai Teramang (Winding River in cyan) */}
            <path
              d="M 800,120 Q 640,110 550,150 T 360,200 T 260,250 T 130,280 L 125,270"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            {/* Small river typography */}
            <text
              x="530"
              y="185"
              fill="#0891b2"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
              className="tracking-wider animate-pulse"
            >
              Areal Aliran S. Teramang
            </text>

            {/* Sawah / Paddy field decoration pattern inside Dusun III */}
            <g opacity="0.35" stroke="#10b981" strokeWidth="1" fill="none">
              <path d="M 600,60 L 590,75 M 605,60 L 595,75 M 610,60 L 600,75" />
              <path d="M 680,80 L 670,95 M 685,80 L 675,95 M 690,80 L 680,95" />
              <path d="M 720,110 L 710,125 M 725,110 L 715,125 M 730,110 L 720,125" />
            </g>

            {/* Perkebunan Sawit (Palm Plantation pattern lines inside Dusun IV) */}
            <g opacity="0.3" stroke="#8b5cf6" strokeWidth="1" fill="none">
              <circle cx="280" cy="400" r="10" strokeDasharray="3 3" />
              <path d="M 280,390 L 280,410 M 270,400 L 290,400" />
              <circle cx="350" cy="450" r="10" strokeDasharray="3 3" />
              <path d="M 350,440 L 350,460 M 340,450 L 360,450" />
            </g>

            {/* PHYSICAL ROADS (Main Arterial National Road - Jalan Lintas Barat Sumatera) */}
            <path
              d="M 450,0 Q 420,200 440,320 T 400,600"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              className="opacity-90"
            />
            <path
              d="M 450,0 Q 420,200 440,320 T 400,600"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="8 5"
              className="opacity-100"
            />

            {/* SECONDARY VILLAGE ROADS */}
            {/* Coastal Road Section */}
            <path
              d="M 130,280 Q 200,320 220,500 L 160,600"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            {/* East Settlement Road */}
            <path
              d="M 435,300 L 680,270 Q 750,310 760,540"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />

            {/* MOUNT / HILL CLUSTERS */}
            <g opacity="0.35" fill="none" stroke="#64748b" strokeWidth="1">
              <path d="M 180,420 Q 190,405 200,420" />
              <path d="M 195,425 Q 205,410 215,425" />
              <path d="M 300,510 Q 312,490 324,510" />
            </g>

            {/* DUSUN LABEL TXT */}
            <g fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" className="pointer-events-none select-none">
              {/* Dusun 1 */}
              <text x="210" y="100" fill="#cbd5e1" opacity="0.95">DUSUN I</text>
              <text x="210" y="113" fill="#94a3b8" fontSize="8" fontWeight="medium">PONDOK PANJANG BARAT</text>

              {/* Dusun 2 */}
              <text x="400" y="80" fill="#fef08a" opacity="0.95">DUSUN II (SENTRAL)</text>
              <text x="400" y="93" fill="#e2e8f0" fontSize="8" fontWeight="medium">PONDOK PANJANG SENTOSA</text>

              {/* Dusun 3 */}
              <text x="650" y="65" fill="#a7f3d0" opacity="0.95">DUSUN III</text>
              <text x="650" y="78" fill="#bcf3cc" fontSize="8" fontWeight="medium">AGROPOLITAN/SAWAH</text>

              {/* Dusun 4 */}
              <text x="310" y="340" fill="#e9d5ff" opacity="0.95">DUSUN IV</text>
              <text x="310" y="353" fill="#cbd5e1" fontSize="8" fontWeight="medium">PERKEBUNAN RANCAH</text>

              {/* Dusun 5 */}
              <text x="620" y="360" fill="#fbcfe8" opacity="0.95">DUSUN V</text>
              <text x="620" y="373" fill="#e2e8f0" fontSize="8" fontWeight="medium">MAJU MAKMUR</text>
            </g>

            {/* INFRASTRUCTURE APBDES PROJECT COORDINATE DOTS (Visible in infrastructure mode or default as light indicators) */}
            {landmarkMarkers.map(mark => {
              const isProgramActive = mark.type === "program";
              const isSelected = selectedRtInfo && isProgramActive && mark.id.includes(selectedRtInfo.dusunId.slice(-1));
              
              if (mapMode !== "infrastructure" && isProgramActive) return null;

              // Convert percentage container styles to 800x600 dimensions
              const calculatedX = (mark.x / 100) * 800;
              const calculatedY = (mark.y / 100) * 600;

              return (
                <g
                  key={mark.id}
                  className="transition-transform duration-200 cursor-pointer select-none"
                  onClick={(e) => {
                    if (isPinModeActive) return;
                    e.stopPropagation();
                    addToast(`Pilihan Bangunan: ${mark.name}. ${mark.desc}`, "info");
                  }}
                >
                  {/* Flashing Outer pulsing aura */}
                  <circle
                    cx={calculatedX}
                    cy={calculatedY}
                    r={isProgramActive ? 12 : 7}
                    fill={isProgramActive ? "#10b981" : "#3b82f6"}
                    className="opacity-30 animate-pulse"
                  />
                  <circle
                    cx={calculatedX}
                    cy={calculatedY}
                    r={isProgramActive ? 6 : 4}
                    fill={isProgramActive ? "#10b981" : "#60a5fa"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Title flags on map */}
                  <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <rect
                      x={calculatedX - 60}
                      y={calculatedY - 28}
                      width="120"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <text
                      x={calculatedX}
                      y={calculatedY - 16}
                      fill="#ffffff"
                      fontSize="7.5"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {mark.name.split(":")[0]}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* ACTIVE REPORT GEOSPATIAL PINS (Digital Pin droppings) */}
            {activePins.map(pin => {
              const pulseColor = pin.severity === "Darurat" ? "fill-red-500" : pin.severity === "Sedang" ? "fill-amber-500" : "fill-emerald-500";
              const strokeColor = pin.severity === "Darurat" ? "#ef4444" : pin.severity === "Sedang" ? "#f59e0b" : "#10b981";

              return (
                <g
                  key={pin.id}
                  onClick={(e) => {
                    if (isPinModeActive) return;
                    e.stopPropagation();
                    setSelectedRt(pin.rt);
                    addToast(`Geolink Laporan ${pin.id} (${pin.category}): "${pin.title}" diajukan oleh ${pin.reporter}. Status: ${pin.status}.`, "warning");
                  }}
                  className="cursor-pointer"
                >
                  {/* Pulsing hazard area */}
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="15"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    className="animate-spin-slow opacity-60"
                  />

                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="8"
                    className={`${pulseColor} opacity-30 animate-ping`}
                  />

                  {/* Core Pin Needle Point */}
                  <path
                    d={`M ${pin.x},${pin.y} 
                        C ${pin.x - 5},${pin.y - 12} ${pin.x - 5},${pin.y - 20} ${pin.x},${pin.y - 20} 
                        C ${pin.x + 5},${pin.y - 20} ${pin.x + 5},${pin.y - 12} ${pin.x},${pin.y}`}
                    fill={strokeColor}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <circle
                    cx={pin.x}
                    cy={pin.y - 14}
                    r="2.5"
                    fill="#ffffff"
                  />

                  {/* Pin label label */}
                  <rect
                    x={pin.x - 30}
                    y={pin.y - 32}
                    width="60"
                    height="10"
                    rx="2"
                    fill="#ef4444"
                    fillOpacity="0.85"
                  />
                  <text
                    x={pin.x}
                    y={pin.y - 25}
                    fill="#ffffff"
                    fontSize="6"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {pin.id} ({pin.severity.slice(0, 3)})
                  </text>
                </g>
              );
            })}

            {/* MOCK SEARCH RT TARGET RETICLE INDICATOR */}
            {selectedRtInfo && (
              <g className="animate-pulse">
                {/* Find approximate geographical mapping coordinates dynamically */}
                {(() => {
                  // Calculate approximate spot for RT pointer targeting from generated coordinates
                  // Map Lat bounds (-2.7095 to -2.7245) and Lng bounds (101.4120 to 101.4360) to 800x600 size
                  const targetX = Math.round(((selectedRtInfo.lng - 101.4120) / 0.024) * 800) || 400;
                  const targetY = Math.round(((-2.7095 - selectedRtInfo.lat) / 0.015) * 600) || 300;

                  return (
                    <>
                      {/* Targeting circles */}
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r="30"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                        className="animate-spin-slow"
                      />
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r="12"
                        className="fill-blue-400/20 stroke-blue-500"
                        strokeWidth="2"
                      />
                      {/* Center Crosshair needle */}
                      <line x1={targetX - 18} y1={targetY} x2={targetX + 18} y2={targetY} stroke="#2563eb" strokeWidth="1" />
                      <line x1={targetX} y1={targetY - 18} x2={targetX} y2={targetY + 18} stroke="#2563eb" strokeWidth="1" />
                      
                      <text
                        x={targetX}
                        y={targetY - 36}
                        fill="#60a5fa"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-slate-900 border"
                      >
                        TARGET LOCK: RT 0{selectedRtInfo.rt}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* CURSOR DRAFT MARKER PREVIEW IN ACTIVE DROPPING PIN MODE */}
            {isPinModeActive && !newPinCoords && (
              <g opacity="0.8">
                {/* Render instructions around mouse pointer layout inside SVG bounds */}
                <rect x="10" y="565" width="320" height="25" rx="5" fill="#f59e0b" />
                <text x="20" y="581" fill="#000000" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  ⚠️ PILIH LOKASI DI PETA & KLIK UNTUK MENARUH PIN KELUHAN
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* BOTTOM ACTIVE REPORT TICKER PANEL */}
        <div className="bg-slate-950/90 backdrop-blur-xs p-3.5 border-t border-slate-800 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-350 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> DAFTAR ADUAN SEKTORAL GEOSPASIAL AKTIF
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Total Terbuka: {activePins.length} Laporan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-24 overflow-y-auto">
            {activePins.map(pin => (
              <div
                key={pin.id}
                onClick={() => {
                  setSelectedRt(pin.rt);
                  addToast(`Melacak aduan ${pin.id} di RT ${pin.rt} secara dinamis!`, "info");
                }}
                className="bg-slate-900 hover:bg-slate-850 p-2.5 rounded-lg border border-slate-800 transition cursor-pointer text-left flex justify-between items-start"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-400 font-mono">{pin.id}</span>
                    <span className={`text-[9px] font-bold px-1 rounded-sm text-white ${
                      pin.severity === "Darurat" ? "bg-red-600 animate-pulse" : pin.severity === "Sedang" ? "bg-amber-600" : "bg-emerald-600"
                    }`}>
                      {pin.severity}
                    </span>
                  </div>
                  <h6 className="font-semibold text-slate-200 text-[11px] truncate w-44">{pin.title}</h6>
                  <p className="text-[10px] text-slate-400 truncate w-44">{pin.description}</p>
                </div>

                <div className="text-right text-[10px] shrink-0 font-mono text-slate-500 space-y-0.5">
                  <div className="text-[9px] font-bold px-1 py-0.5 bg-slate-800 rounded-sm text-slate-300">RT {pin.rt}</div>
                  <div>{pin.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
