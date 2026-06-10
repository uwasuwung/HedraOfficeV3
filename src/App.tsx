import React, { useState, useEffect } from "react";
import {
  Monitor,
  Code,
  RefreshCw,
  Download,
  Database,
  Users,
  Home,
  TrendingUp,
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Search,
  CodeXml,
  Image as ImageIcon,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Settings,
  ChevronRight,
  Globe,
  X,
  Calendar,
  DollarSign,
  Activity,
  Award
} from "lucide-react";
import { csharpCodeFiles } from "./data/csharpCode";
import { DesaDataResponse, SqlQueryLog } from "./types";
import { Toast, ToastContainer } from "./components/Toast";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const initialVillageData: DesaDataResponse = {
  timestamp: "2026-06-10T00:00:00Z",
  sourceUrl: "https://pondokpanjang.id",
  status: "success",
  villageMetadata: {
    name: "Pondok Panjang",
    subdistrict: "Teramang Jaya",
    regency: "Mukomuko",
    province: "Bengkulu",
    head: {
      name: "Heru Purnomo, ST",
      title: "Kepala Desa",
      greetings: "Selamat datang di portal resmi pelayanan dan transparansi Desa Pondok Panjang. Aplikasi hedra-office-v3 ini dirancang untuk memudahkan aparatur desa dalam memantau statistik, menyusun anggaran pendapatan dan belanja desa (APBDes), serta menyebarkan sirkuler pengumuman penting bagi seluruh warga desa secara akurat dan akuntabel."
    }
  },
  stats: {
    population: 4876,
    families: 1672,
    rtrw: 74,
    areaSize: "14.30",
    growthRate: "1.25%",
    malePopulation: 2512,
    femalePopulation: 2364
  },
  apbdes: [
    { category: "Pemerintahan", percentage: 22, amount: 330000000, color: "#3B82F6" },
    { category: "Pembangunan", percentage: 28, amount: 420000000, color: "#10B981" },
    { category: "Kemasyarakatan", percentage: 20, amount: 300000000, color: "#F59E0B" },
    { category: "Pemberdayaan", percentage: 18, amount: 270000000, color: "#8B5CF6" },
    { category: "Bencana & Mendesak", percentage: 12, amount: 180000000, color: "#EF4444" }
  ],
  priorityPrograms: [
    { code: "PR-01", name: "Jalan Desa", desc: "Pembangunan rabat beton dan pengerasan jalan usaha tani untuk kelancaran transportasi hasil bumi.", status: "Sedang Berjalan", cost: 120000000 },
    { code: "PR-02", name: "Drainase", desc: "Optimalisasi saluran air pemukiman mencegah genangan banjir di musim penghujan.", status: "Selesai", cost: 75000000 },
    { code: "PR-03", name: "Posyandu", desc: "Peningkatan mutu sarana posyandu balita dan lansia serta pemberian makanan tambahan (PMT) gizi.", status: "Rutin", cost: 45000000 },
    { code: "PR-04", name: "Pendidikan", desc: "Bantuan perlengkapan siswa kurang mampu dan insentif guru PAUD binaan desa.", status: "Selesai", cost: 35000000 },
    { code: "PR-05", name: "UMKM", desc: "Pelatihan keterampilan digital, manajemen keuangan, serta penyaluran hibah modal usaha mikro.", status: "Perencanaan", cost: 60000000 },
    { code: "PR-06", name: "Irigasi", desc: "Rehabilitasi parit irigasi persawahan untuk stabilisasi pasokan air tanaman padi penduduk.", status: "Sedang Berjalan", cost: 85000000 },
    { code: "PR-07", name: "RTLH", desc: "Program bedah Rumah Tidak Layak Huni (RTLH) bagi keluarga prasejahtera.", status: "Perencanaan", cost: 90000000 }
  ],
  announcements: [
    {
      id: "ANN-001",
      title: "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) APBDes Tahun Anggaran Berikutnya",
      date: "14 Juni 2026",
      time: "09:00 WIB - Selesai",
      location: "Balai Pertemuan Desa Pondok Panjang",
      content: "Mengundang seluruh tokoh masyarakat, Ketua RT/RW, LPM, PKK, dan keterwakilan perempuan untuk hadir merumuskan arah prioritas pembangunan fisik dan pemberdayaan masyarakat untuk tahun anggaran berikutnya.",
      author: "Sekretariat Desa"
    },
    {
      id: "ANN-002",
      title: "Penyaluran BLT Dana Desa (BLT-DD) Tahap II untuk Penerima Manfaat",
      date: "11 Juni 2026",
      time: "08:30 s.d 12:00 WIB",
      location: "Kantor Kepala Desa Pondok Panjang",
      content: "Harap membahwa dokumen asli Kartu Keluarga (KK) dan KTP Elektronik untuk verifikasi. Penerima diwajibkan mematuhi tata tertib antrean yang telah diatur oleh petugas pamong desa.",
      author: "Kaur Keuangan"
    },
    {
      id: "ANN-003",
      title: "Kerja Bakti Masal & Gotong Royong Kebersihan Lingkungan Lingkar Desa",
      date: "18 Juni 2026",
      time: "07:00 WIB - Selesai",
      location: "Masing-masing RT (RT 01 sampai RT 12)",
      content: "Dalam rangka kesiapsiagaan memasuki puncak musim penghujan dan pencegahan DBD, seluruh warga dihimbau membersihkan selokan, menimbun kaleng bekas, dan merapikan tanaman rindang.",
      author: "Kepala Desa"
    }
  ],
  gallery: [
    { title: "Rapat Koordinasi Pamong Desa", date: "05 Juni 2026", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60" },
    { title: "Pembangunan Saluran Drainase RT 04", date: "28 Mei 2026", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60" },
    { title: "Kegiatan Poskesdes Bulanan", date: "15 Mei 2026", url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500&auto=format&fit=crop&q=60" }
  ],
  contacts: {
    phone: "+6281324626243",
    whatsapp: "6281324626243",
    email: "info@pondokpanjang.id",
    address: "Jl. Lintas Barat Sumatera No.12, Pondok Panjang, Kec. Teramang Jaya, Kabupaten Mukomuko, Bengkulu 38765"
  }
};

const detailedProgramData: Record<string, {
  timeline: { phase: string; desc: string; status: "Selesai" | "Sedang Berjalan" | "Rutin" | "Perencanaan" }[];
  budget: { item: string; amount: number }[];
  targetLocation: string;
  pemberiManfaat: string;
}> = {
  "PR-01": {
    timeline: [
      { phase: "Tahap I (Januari - Maret)", desc: "Perizinan rincian pembebasan lahan warga, rapat rembuk desa, & mobilisasi material dasar pasir/batu.", status: "Selesai" },
      { phase: "Tahap II (April - Juni)", desc: "Pemancangan batas sisi, perataan permukaan dengan motor grader, pemasangan tulangan besi dowel.", status: "Selesai" },
      { phase: "Tahap III (Juli - September)", desc: "Pengecoran slab rabat beton K-250 menggunakan mixer keliling & uji kuat tekan beton lapangan.", status: "Sedang Berjalan" },
      { phase: "Tahap IV (Oktober - Desember)", desc: "Finishing oprit jembatan penghubung parit & pembersihan sisa pekerjaan sipil.", status: "Perencanaan" }
    ],
    budget: [
      { item: "Bahan Material Pokok (Semen Portland, Pasir Pasang, Besi Baja Ulir)", amount: 75000000 },
      { item: "Peralatan Penunjang (Sewa Vibrator Concrete, Molen, & Pompa Air)", amount: 15000000 },
      { item: "Harian Upah Kerja Warga Padat Karya Tunai Desa", amount: 30000000 }
    ],
    targetLocation: "Akses Jalan Sentra Tani RT 05 - RT 08",
    pemberiManfaat: "185 KK Petani Kelapa Sawit & Palawija"
  },
  "PR-02": {
    timeline: [
      { phase: "Tahap I (Maret - April)", desc: "Survei kemiringan elevasi topografi tanah menggunakan teodolit digital.", status: "Selesai" },
      { phase: "Tahap II (Mei - Juni)", desc: "Penggalian manual, perataan jalur dasar lapis pasir, pemasangan precast U-Ditch beton 40x40.", status: "Selesai" }
    ],
    budget: [
      { item: "Bahan U-Ditch Beton Precast Berstandar SNI (300 unit)", amount: 45000000 },
      { item: "Upah Tenaga Kerja Lokal & Tukang Batu", amount: 20000000 },
      { item: "Pemasangan Besi Grid Penutup Bak Kontrol Drainase", amount: 10000000 }
    ],
    targetLocation: "Kawasan Pemukiman Padat RT 02 & RT 03",
    pemberiManfaat: "96 Kepala Keluarga dari ancaman luapan air parit"
  },
  "PR-03": {
    timeline: [
      { phase: "Januari - Maret (Triwulan I)", desc: "Penyediaan vitamin A, imunisasi dasar polio/DPT, & pembagian susu formula balita.", status: "Selesai" },
      { phase: "April - Juni (Triwulan II)", desc: "Distribusi makanan tambahan bergizi (bubur kacang hijau, biskuit sehat, telur rebus).", status: "Sedang Berjalan" },
      { phase: "Juli - Desember (Triwulan III-IV)", desc: "Monitoring berkala berat badan balita & penyuluhan hidup bersih sehat kader lansia.", status: "Perencanaan" }
    ],
    budget: [
      { item: "Pengadaan Alat Kesehatan Timbangan Digital & Stadiometer Tinggi Badan", amount: 8000000 },
      { item: "Bahan PMT Bergizi (Susu, Kacang Hijau, Telur, Suplemen Ibu Hamil)", amount: 25000000 },
      { item: "Insentif Mengajar Lansia & Transport Pemantau Kader KB", amount: 12000000 }
    ],
    targetLocation: "Gedung Posyandu Melati Indah, Dusun II",
    pemberiManfaat: "142 Balita & 65 Lansia Desa Pondok Panjang"
  },
  "PR-04": {
    timeline: [
      { phase: "Tahap I (April)", desc: "Pendataan siswa berprestasi & yatim-piatu dari keluarga prasejahtera.", status: "Selesai" },
      { phase: "Tahap II (Mei)", desc: "Pembelian seragam sekolah merah-putih/biru, tas ransel anti-air, sepatu, & buku tulis gratis.", status: "Selesai" },
      { phase: "Tahap III (Juni)", desc: "Penyaluran langsung kepada 80 siswa terpilih disaksikan kepala sekolah & komite.", status: "Selesai" }
    ],
    budget: [
      { item: "Paket Perlengkapan Sekolah (Seragam, Sepatu, Tas, Alat Tulis Utama)", amount: 20000000 },
      { item: "Bantuan Insentif Mengajar 4 Guru PAUD Binaan Desa (12 bulan)", amount: 12000000 },
      { item: "Biaya Transportasi & Admin Distribusi Bantuan Siswa", amount: 3000000 }
    ],
    targetLocation: "PAUD Harapan Bangsa & SD Negeri 03 Teramang Jaya",
    pemberiManfaat: "80 Anak Usia Sekolah & 4 Tenaga Pendidik PAUD"
  },
  "PR-05": {
    timeline: [
      { phase: "Tahap I (Juni)", desc: "Sosialisasi program kemitraan & registrasi pendaftaran minat usaha mikro.", status: "Selesai" },
      { phase: "Tahap II (Juli)", desc: "Penyusunan modul pelatihan kemasan aseptik produk & pelatihan pemasaran digital.", status: "Perencanaan" },
      { phase: "Tahap III (Agustus)", desc: "Pelaksanaan kelas inkubator UMKM dengan narasumber profesional Dinas Koperasi.", status: "Perencanaan" },
      { phase: "Tahap IV (September)", desc: "Penyaluran stimulan alat bantu produksi (perajang kelapa, sealer elektrik, mixer adonan).", status: "Perencanaan" }
    ],
    budget: [
      { item: "Fee Ahli Narasumber, Modul Cetak, & Konsumsi Peserta Kelas UMKM", amount: 15000000 },
      { item: "Pengurusan Sertifikasi Halal Gratis & NIB Kolektif (20 UMKM)", amount: 10000000 },
      { item: "Paket Peralatan Penunjang Usaha Stimulan (Alat Spinner Minyak, Sealer)", amount: 35000000 }
    ],
    targetLocation: "Balai Pelatihan Kantor Kepala Desa",
    pemberiManfaat: "35 Pelaku Usaha Mikro (Keripik, Anyaman, Kuliner Tradisional)"
  },
  "PR-06": {
    timeline: [
      { phase: "Tahap I (Januari - Februari)", desc: "Pembersihan lumpur sedimen parit pembawa utama sawah secara bergotong royong.", status: "Selesai" },
      { phase: "Tahap II (Maret - Mei)", desc: "Pemasangan pondasi batu kali/turap penahan tebing irigasi agar tidak mudah longsor.", status: "Selesai" },
      { phase: "Tahap III (Juni - September)", desc: "Instalasi pintu air geser penampang plat baja handwheel diameter 400mm.", status: "Sedang Berjalan" }
    ],
    budget: [
      { item: "Pengadaan Bahan Konstruksi (Batu Kali Belah, Semen, Besi Tulangan)", amount: 50000000 },
      { item: "Pintu Air Geser Sistem Ulir Pemutar Handwheel Baja (2 unit)", amount: 15000000 },
      { item: "Upah Tenaga Harian Padat Karya Kelompok Tani Pemakai Air (P3A)", amount: 20000000 }
    ],
    targetLocation: "Blok Persawahan Hamparan Air Hitam, Dusun III",
    pemberiManfaat: "112 Hektar Sawah Aktif milik kelompok tani desa"
  },
  "PR-07": {
    timeline: [
      { phase: "Tahap I (Mei)", desc: "Survei rumah calon penerima manfaat & verifikasi kepemilikan status tanah bermeterai.", status: "Selesai" },
      { phase: "Tahap II (Juni)", desc: "Finalisasi daftar 3 rumah sasaran renovasi & penyusunan rencana anggaran biaya detail.", status: "Selesai" },
      { phase: "Tahap III (Juli - Agustus)", desc: "Droping material bangunan primer (Kayu kaso, bata merah, semen, besi, atap spandek).", status: "Perencanaan" },
      { phase: "Tahap IV (September - Oktober)", desc: "Pelaksanaan rekonstruksi atap bocor, dinding papan lapuk dipasang bata, & sanitasi MCK sederhana.", status: "Perencanaan" }
    ],
    budget: [
      { item: "Paket Bahan Bangunan Konstruksi (Bata, Semen, Pasir, Atap Spandek, Kusen Kayu)", amount: 60000000 },
      { item: "Kusen Jendela, Pintu Kayu panel, & Peralatan Instalasi Kabel Kelistrikan", amount: 15000000 },
      { item: "Uang Saku Padat Karya Tukang & Konsumsi Gotong Royong Tetangga", amount: 15000000 }
    ],
    targetLocation: "Rumah Warga Prasejahtera (Dusun I dan Dusun III)",
    pemberiManfaat: "3 Keluarga Kurang Mampu (Yatim Piatu, Buruh Harian Lepas)"
  }
};

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<"emulator" | "code">("emulator");
  const [emulatorActiveTab, setEmulatorActiveTab] = useState<string>("dashboard");
  const [villageData, setVillageData] = useState<DesaDataResponse | null>(initialVillageData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isScrapedOnline, setIsScrapedOnline] = useState<boolean>(false);
  const [scrapeMsg, setScrapeMsg] = useState<string>("");
  const [selectedProgramCode, setSelectedProgramCode] = useState<string | null>(null);
  
  // Code Viewer States
  const [selectedCodeIndex, setSelectedCodeIndex] = useState<number>(1); // Default to ScraperService.cs
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // SQLite Console States
  const [sqlLogs, setSqlLogs] = useState<SqlQueryLog[]>([]);
  const [customSqlQuery, setCustomSqlQuery] = useState<string>("SELECT * FROM file_refresh_log ORDER BY id DESC LIMIT 5;");
  const [sqlQueryResult, setSqlQueryResult] = useState<{
    headers: string[];
    rows: any[][];
    message: string;
  } | null>(null);

  // Toast Notification System
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info", title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Initial Scraper Content
  useEffect(() => {
    fetchScrapedData();
    // Seed initial SQLite history
    const initialLogs: SqlQueryLog[] = [
      {
        timestamp: "2026-06-09 11:24:12",
        query: "CREATE TABLE IF NOT EXISTS file_refresh_log (id INTEGER PRIMARY KEY, timestamp TEXT, penduduk INTEGER, kepala_keluarga INTEGER, rtrw INTEGER, status TEXT);",
        status: "success",
        rowsAffected: 0,
      },
      {
        timestamp: "2026-06-09 23:45:00",
        query: "INSERT INTO file_refresh_log (timestamp, penduduk, kepala_keluarga, rtrw, status) VALUES ('2026-06-09 23:45:00', 4876, 1672, 74, 'OFFLINE_FALLBACK');",
        status: "success",
        rowsAffected: 1,
      }
    ];
    setSqlLogs(initialLogs);
  }, []);

  const fetchScrapedData = async (isManual: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scrape");
      if (response.ok) {
        const data: DesaDataResponse = await response.json();
        setVillageData(data);
        setIsScrapedOnline(data.isScrapedReal || false);
        setScrapeMsg(data.status_msg || "");
        
        const dateFormatted = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        setLastUpdated(dateFormatted);

        // Add to SQLite live log
        const logQuery = `INSERT INTO file_refresh_log (timestamp, penduduk, kepala_keluarga, rtrw, status) VALUES ('2026-06-10 ${dateFormatted}', ${data.stats.population}, ${data.stats.families}, ${data.stats.rtrw}, '${data.isScrapedReal ? "ONLINE_SCRAPE" : "OFFLINE_FALLBACK"}');`;
        setSqlLogs(prev => [
          {
            timestamp: `2026-06-10 ${dateFormatted}`,
            query: logQuery,
            status: "success",
            rowsAffected: 1,
          },
          ...prev
        ]);

        if (isManual) {
          if (data.isScrapedReal) {
            addToast(
              `Data kependudukan & APBDes berhasil ditarik online dari pondokpanjang.id pada ${dateFormatted}.`,
              "success",
              "Sinkronisasi Berhasil"
            );
          } else {
            addToast(
              `Data dimuat menggunakan database SQLite cache offline desa terintegrasi pada ${dateFormatted}.`,
              "warning",
              "Database Diperbarui (Mode Offline)"
            );
          }
        }
      } else {
        throw new Error("HTTP Gagal");
      }
    } catch (err) {
      console.error(err);
      if (isManual) {
        addToast(
          "Gagal memicu koneksi integrasi scraping ke situs utama. Silakan coba kembali.",
          "error",
          "Koneksi Scraping Gagal"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const executeSqlQuery = () => {
    const q = customSqlQuery.trim().toLowerCase();
    
    if (!villageData) {
      setSqlQueryResult({
        headers: [],
        rows: [],
        message: "Error: Basis data kosong. Silakan muat data terlebih dahulu."
      });
      return;
    }

    // Add query log
    const nowTime = new Date().toLocaleTimeString("id-ID");
    setSqlLogs(prev => [
      {
        timestamp: `2026-06-10 ${nowTime}`,
        query: customSqlQuery,
        status: "success",
        rowsAffected: q.startsWith("select") ? 1 : 0
      },
      ...prev
    ]);

    if (q.includes("select") && q.includes("file_refresh_log")) {
      const headers = ["id", "timestamp", "penduduk", "kepala_keluarga", "rtrw", "status"];
      const rows = sqlLogs.map((log, idx) => [
        sqlLogs.length - idx,
        log.timestamp,
        villageData.stats.population,
        villageData.stats.families,
        villageData.stats.rtrw,
        log.query.includes("ONLINE_SCRAPE") ? "ONLINE_SCRAPE" : "OFFLINE"
      ]);
      setSqlQueryResult({
        headers,
        rows,
        message: `Query berhasil dieksekusi. Menampilkan ${rows.length} record dari database offline.`
      });
    } else if (q.includes("select") && q.includes("pengumuman")) {
      const headers = ["judul", "tanggal", "isi"];
      const rows = villageData.announcements.map(ann => [ann.title, ann.date, ann.content]);
      setSqlQueryResult({
        headers,
        rows,
        message: `Query berhasil dieksekusi. Menampilkan ${rows.length} pengumuman desa.`
      });
    } else if (q.includes("select") && q.includes("apbdes")) {
      const headers = ["kategori", "persentase_dana", "estimasi_anggaran"];
      const rows = villageData.apbdes.map(ap => [ap.category, `${ap.percentage}%`, `Rp ${ap.amount.toLocaleString("id-ID")}`]);
      setSqlQueryResult({
        headers,
        rows,
        message: `Query berhasil dieksekusi. Menampilkan alokasi anggaran APBDes TA 2026.`
      });
    } else {
      setSqlQueryResult({
        headers: ["Status", "Pesan"],
        rows: [["OK", "Kueri diproses dalam cache sitem virtual."]],
        message: "Sintaks SQL valid tetapi data virtual terbatas. Coba jalankan 'SELECT * FROM file_refresh_log' atau 'SELECT * FROM pengumuman'."
      });
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    addToast(
      `Kode berkas ${csharpCodeFiles[selectedCodeIndex].filename} telah sukses disalin ke clipboard!`,
      "success",
      "Penyalinan Berhasil"
    );
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Manual Trigger Refresh
  const handleRefresh = () => {
    fetchScrapedData(true);
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    if (!villageData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama Desa,Kepala Desa,Jumlah Penduduk,Jumlah KK,RT/RW,Luas Wilayah\n";
    csvContent += `1,${villageData.villageMetadata.name},${villageData.villageMetadata.head.name},${villageData.stats.population},${villageData.stats.families},${villageData.stats.rtrw},"${villageData.stats.areaSize} km²"\n\n`;
    
    csvContent += "ALOKASI APBDES CATEGORY,PERSENTASE,ESTIMASI NOMINAL\n";
    villageData.apbdes.forEach(categ => {
      csvContent += `"${categ.category}","${categ.percentage}%","Rp ${categ.amount}"\n`;
    });

    csvContent += "\nPENGUMUMAN TERBARU,TANGGAL,DESKRIPSI\n";
    villageData.announcements.forEach(ann => {
      csvContent += `"${ann.title.replace(/"/g, '""')}","${ann.date}","${ann.content.replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Desa_Pondok_Panjang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(
      "Berkas CSV sukses diekspor! Siap diolah menggunakan Microsoft Excel atau Google Sheets.",
      "success",
      "Ekspor CSV Berhasil"
    );
  };

  // Export Data to TXT
  const handleExportTXT = () => {
    if (!villageData) return;
    let txt = `========================================================\n`;
    txt += `     LAPORAN TRANSParanSI DESA PONDOK PANJANG (HEDRA-OFFICE) \n`;
    txt += `========================================================\n`;
    txt += `Ekstraksi Website: ${villageData.sourceUrl}\n`;
    txt += `Waktu Ekstraksi  : 2026-06-10 (Lokal)\n`;
    txt += `Sistem Operasi   : Windows OS (Simulated C# / SQLite)\n`;
    txt += `--------------------------------------------------------\n\n`;
    
    txt += `1. RINGKASAN STATISTIK DESA:\n`;
    txt += `   - Jumlah Penduduk: ${villageData.stats.population} Jiwa\n`;
    txt += `   - Jumlah KK      : ${villageData.stats.families} Keluarga\n`;
    txt += `   - Jumlah RT & RW : ${villageData.stats.rtrw} Unit\n`;
    txt += `   - Luas Wilayah   : ${villageData.stats.areaSize} km²\n\n`;

    txt += `2. SAMBUTAN KEPALA DESA:\n`;
    txt += `   Nama Kepala Desa: ${villageData.villageMetadata.head.name}\n`;
    txt += `   Sambutan        : "${villageData.villageMetadata.head.greetings}"\n\n`;

    txt += `3. ANGGARAN APBDES (ALOKASI):\n`;
    villageData.apbdes.forEach(apb => {
      txt += `   - ${apb.category.padEnd(20)}: ${apb.percentage}% (Estimasi: Rp ${apb.amount.toLocaleString("id-ID")})\n`;
    });

    txt += `\n4. PROGRAM PRIORITAS DESA:\n`;
    villageData.priorityPrograms.forEach((p, i) => {
      txt += `   [${p.code}] ${p.name.padEnd(16)}: ${p.desc} (${p.status})\n`;
    });

    txt += `\n5. PENGUMUMAN TERAKHIR:\n`;
    villageData.announcements.forEach((ann, i) => {
      txt += `   ${i+1}. ${ann.title} (${ann.date})\n`;
      txt += `      Pesan: ${ann.content}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `C#_Export_Desa_Pondok_Panjang_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    addToast(
      "Laporan detail transparansi Anggaran & Kegiatan Desa sukses diunduh dalam berkas teks (.txt).",
      "success",
      "Ekspor TXT Berhasil"
    );
  };

  // Export Data to PDF
  const handleExportPDF = () => {
    if (!villageData) return;
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // ================= PAGE 1 =================
      // Page Border
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.35);
      doc.rect(10, 10, 190, 277, "S");

      // Custom Kop Surat
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("PEMERINTAH KABUPATEN MUKOMUKO", 105, 19, { align: "center" });

      doc.setFontSize(10.5);
      doc.text("KECAMATAN TERAMANG JAYA", 105, 24, { align: "center" });

      doc.setFontSize(14);
      doc.text("PEMERINTAH DESA PONDOK PANJANG", 105, 30, { align: "center" });

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Alamat: Jalan Raya Lintas Barat Bengkulu-Padang KM.270, Desa Pondok Panjang, Mukomuko, Bengkulu", 105, 35, { align: "center" });

      // Double divider line
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.8);
      doc.line(15, 38, 195, 38);
      doc.setLineWidth(0.2);
      doc.line(15, 40, 195, 40);

      // Title
      let y = 49;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("LAPORAN TRANSPARANSI KINERJA & STATISTIK DESA", 105, y, { align: "center" });

      // Document details box
      y += 6;
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 23, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, y, 180, 23, "S");

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Tanggal Pembuatan: " + new Date().toLocaleDateString("id-ID") + " " + new Date().toLocaleTimeString("id-ID"), 20, y + 6);
      doc.text("Sistem Aplikasi   : Hedra-Office v3 (WinForms App)", 20, y + 11);
      doc.text("Basis Data Cache  : SQLite Local Storage (desa_data.sqlite)", 20, y + 16);

      doc.text("Otoritas Penilai : Kantor Kecamatan Teramang Jaya", 110, y + 6);
      doc.text("Sumber Sinkron   : Official https://pondokpanjang.id", 110, y + 11);
      doc.text("Status Keamanan  : Terverifikasi Digital / Otentik", 110, y + 16);

      // SECTION 1: Profil Statistik
      y += 33;
      // Blue indicator marker
      doc.setFillColor(37, 99, 235);
      doc.rect(15, y - 4, 3, 5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text("1. RINGKASAN PROFIL & STATISTIK KEPENDUDUKAN DESA", 21, y);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.line(15, y + 3, 195, y + 3);

      // 2x2 Grid of stats
      const yStart = y + 7;
      
      // Box 1
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yStart, 85, 23, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, yStart, 85, 23, "S");
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("TOTAL PENDUDUK AKTIF", 19, yStart + 5.5);
      doc.setFontSize(13);
      doc.setTextColor(29, 78, 216);
      doc.text(villageData.stats.population.toLocaleString("id-ID") + " Jiwa", 19, yStart + 13.5);
      doc.setFontSize(7);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`Laki-laki: ${villageData.stats.malePopulation.toLocaleString("id-ID")} | Perempuan: ${villageData.stats.femalePopulation.toLocaleString("id-ID")}`, 19, yStart + 19.5);

      // Box 2
      doc.setFillColor(248, 250, 252);
      doc.rect(110, yStart, 85, 23, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(110, yStart, 85, 23, "S");
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("KEPALA KELUARGA (KK)", 114, yStart + 5.5);
      doc.setFontSize(13);
      doc.setTextColor(29, 78, 216);
      doc.text(villageData.stats.families.toLocaleString("id-ID") + " Kepala Keluarga", 114, yStart + 13.5);
      doc.setFontSize(7);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Tercatat terdaftar pada kartu keluarga kependudukan", 114, yStart + 19.5);

      const yStart2 = yStart + 27;

      // Box 3
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yStart2, 85, 23, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, yStart2, 85, 23, "S");
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("UNIT RUKUN TETANGGA (RT) / RW", 19, yStart2 + 5.5);
      doc.setFontSize(13);
      doc.setTextColor(29, 78, 216);
      doc.text(villageData.stats.rtrw + " Unit Terdata", 19, yStart2 + 13.5);
      doc.setFontSize(7);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Pembagian rukun administratif dusun secara merata", 19, yStart2 + 19.5);

      // Box 4
      doc.setFillColor(248, 250, 252);
      doc.rect(110, yStart2, 85, 23, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(110, yStart2, 85, 23, "S");
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("LUAS WILAYAH ADMINISTRATIF", 114, yStart2 + 5.5);
      doc.setFontSize(13);
      doc.setTextColor(29, 78, 216);
      doc.text(villageData.stats.areaSize + " km²", 114, yStart2 + 13.5);
      doc.setFontSize(7);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Rasio laju pertumbuhan penduduk: " + villageData.stats.growthRate, 114, yStart2 + 19.5);

      // SECTION 2: Sambutan Kades
      y = yStart2 + 34;
      doc.setFillColor(37, 99, 235);
      doc.rect(15, y - 4, 3, 5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text("2. SAMBUTAN DAN KOMITMEN REFORMASI KEPALA DESA", 21, y);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 3, 195, y + 3);

      y += 7;
      const greetingsText = `"${villageData.villageMetadata.head.greetings}"`;
      const quoteLines = doc.splitTextToSize(greetingsText, 166);
      const quoteBoxHeight = quoteLines.length * 5.2 + 8;

      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, quoteBoxHeight, "F");
      doc.setFillColor(59, 130, 246);
      doc.rect(15, y, 1.5, quoteBoxHeight, "F");

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(quoteLines, 20, y + 6);

      y += quoteBoxHeight + 4;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(villageData.villageMetadata.head.name, 20, y);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Kepala Desa Pondok Panjang (Terpilih secara Konstitusional)", 20, y + 4.5);


      // ================= PAGE 2 =================
      doc.addPage();
      
      // Page Border
      doc.setDrawColor(203, 213, 225);
      doc.rect(10, 10, 190, 277, "S");

      // Custom header accent
      doc.setFillColor(29, 78, 216);
      doc.rect(15, 12, 180, 1.5, "F");

      y = 20;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("LAPORAN TRANSPARANSI DATA DESA PONDOK PANJANG", 15, y);
      doc.text("Halaman 2 / 2", 195, y, { align: "right" });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(15, y + 3.5, 195, y + 3.5);

      // SECTION 3: APBDes Anggaran
      y += 13;
      doc.setFillColor(37, 99, 235);
      doc.rect(15, y - 4, 3, 5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text("3. ALOKASI ANGGARAN APBDes (TRANSPARANSI PUBLIK)", 21, y);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 3, 195, y + 3);

      // Table Header APBDes
      y += 7;
      doc.setFillColor(30, 41, 59);
      doc.rect(15, y, 180, 8.5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("No", 18, y + 5.5);
      doc.text("Kategori Bidang Alokasi APBDes", 27, y + 5.5);
      doc.text("Persentase", 120, y + 5.5);
      doc.text("Estimasi Anggaran Wilayah", 150, y + 5.5);

      let yRow = y + 8.5;
      villageData.apbdes.forEach((apb, idx) => {
        const isAlternate = idx % 2 === 1;
        if (isAlternate) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, yRow, 180, 8, "F");
        }
        doc.setDrawColor(241, 245, 249);
        doc.rect(15, yRow, 180, 8, "S");

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text((idx + 1).toString(), 18, yRow + 5.2);
        doc.text(apb.category, 27, yRow + 5.2);
        doc.text(apb.percentage + "%", 120, yRow + 5.2);
        
        doc.setFont("Helvetica", "bold");
        doc.text("Rp " + apb.amount.toLocaleString("id-ID"), 150, yRow + 5.2);
        yRow += 8;
      });

      // SECTION 4: Prioritas Program
      y = yRow + 10;
      doc.setFillColor(37, 99, 235);
      doc.rect(15, y - 4, 3, 5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text("4. PROGRAM PRIORITAS DAN PEMBANGUNAN FISIK UTAMA", 21, y);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 3, 195, y + 3);

      // Table Header Programs
      y += 7;
      doc.setFillColor(30, 41, 59);
      doc.rect(15, y, 180, 8.5, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text("Kode", 18, y + 5.5);
      doc.text("Nama Program Unggulan", 35, y + 5.5);
      doc.text("Penjelasan Fokus Kerja", 90, y + 5.5);
      doc.text("Status Realisasi", 160, y + 5.5);

      let yRow2 = y + 8.5;
      villageData.priorityPrograms.forEach((p, idx) => {
        const isAlternate = idx % 2 === 1;
        if (isAlternate) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, yRow2, 180, 11, "F");
        }
        doc.setDrawColor(241, 245, 249);
        doc.rect(15, yRow2, 180, 11, "S");

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(p.code, 18, yRow2 + 6.5);
        doc.text(p.name, 35, yRow2 + 6.5);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const wrappedDesc = doc.splitTextToSize(p.desc, 65);
        doc.text(wrappedDesc, 90, yRow2 + 4.5);

        doc.setFont("Helvetica", "bold");
        if (p.status.toLowerCase().includes("selesai") || p.status.toLowerCase().includes("100%")) {
          doc.setTextColor(16, 185, 129); // Green
        } else {
          doc.setTextColor(217, 119, 6); // Amber
        }
        doc.text(p.status, 160, yRow2 + 6.5);
        yRow2 += 11;
      });

      // Signature Block
      y = yRow2 + 14;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text("Pondok Panjang, " + new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }), 140, y);
      
      doc.setFont("Helvetica", "bold");
      doc.text("Kepala Desa Pondok Panjang", 140, y + 5.2);

      // Signature line space
      doc.text(villageData.villageMetadata.head.name, 140, y + 24);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Pangkat: Penata / Kepala Wilayah Resmi", 140, y + 28);

      // Disclaimer Bottom Left
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("* Dokumen transparansi ini diproduksi secara valid bersumberkan data", 15, y + 10);
      doc.text("  terintegrasi C# Windows WinForms Desktop Suite (HedraOfficeV3).", 15, y + 13.5);
      doc.text("  Segala hak cipta dilindungi undang-undang desa kependudukan.", 15, y + 17);

      // Save Document
      doc.save(`Laporan_Realisasi_Desa_Pondok_Panjang_${new Date().toISOString().slice(0, 10)}.pdf`);

      addToast(
        "Laporan formal statistik & realisasi APBDes kependudukan sukses diekspor ke format PDF!",
        "success",
        "Ekspor PDF Berhasil"
      );
    } catch (err) {
      console.error(err);
      addToast(
        "Gagal memformulasikan dokumen PDF menggunakan pustaka sistem JS.",
        "error",
        "Ekspor PDF Gagal"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Premium Elegant Navigation Ribbon */}
      <header className="bg-white border-b border-slate-200 shadow-xs px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/10 flex justify-center items-center">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-mono">hedra-office-v3</h1>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs font-semibold rounded-full border border-blue-500/20">
                Code-Suite & Simulator
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instruksi C# Windows .NET Desktop App & Simulasi Scraping Desa Pondok Panjang (Teramang Jaya, Mukomuko)
            </p>
          </div>
        </div>

        {/* Global Tab Selector */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center">
          <button
            onClick={() => setActiveMainTab("emulator")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-semibold cursor-pointer ${
              activeMainTab === "emulator"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Simulator Windows (WinForms)
          </button>
          <button
            onClick={() => setActiveMainTab("code")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-semibold cursor-pointer ${
              activeMainTab === "code"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-4 h-4" />
            C# Code & Panduan Studio
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-100">
        
        {/* ================================== TAB 1: EMULATOR ================================== */}
        {activeMainTab === "emulator" && (
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 flex items-center justify-center bg-slate-100">
            
            {/* Simulated Desktop Component in Modern styling */}
            <div className="w-full max-w-6xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[750px]">
              
              {/* Windows Window Title Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors" />
                  </div>
                  <span className="text-xs text-slate-700 font-sans select-none ml-2 font-medium">HedraOfficeV3.exe - Windows Form .NET 8 (Segoe UI)</span>
                </div>
                
                <div className="text-xs bg-slate-200/60 border border-slate-300 text-slate-700 rounded px-2.5 py-1 flex items-center gap-1.5 select-none font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  SQLite Mode: Active
                </div>
              </div>

              {/* Toolbar Ribbons */}
              <div className="bg-slate-50/50 border-b border-slate-200 px-4 py-2 flex flex-wrap justify-between items-center gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded shadow-xs border border-blue-600 cursor-pointer select-none"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh Data dari Web
                  </button>

                  <div className="relative inline-block text-left">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer select-none shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Eksport CSV
                    </button>
                  </div>

                  <button
                    onClick={handleExportTXT}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer select-none shadow-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Eksport TXT
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer select-none shadow-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    Eksport PDF Resmi
                  </button>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                  Terakhir Pembaruan: <span className="text-blue-600 font-bold">{lastUpdated || "Menghubungkan..."}</span>
                </div>
              </div>

              {/* Offline Warning Banner */}
              {scrapeMsg && (
                <div className="bg-amber-50 border-b border-amber-250 text-amber-900 text-xs px-4 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{scrapeMsg}</span>
                </div>
              )}

              {/* Main Emulator Application Shell */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* WinForms Left Sidebar Navigation */}
                <aside className="w-56 bg-slate-800 border-r border-slate-200 p-3 flex flex-col gap-1 shrink-0 select-none overflow-y-auto">
                  
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase font-mono">
                    Navigasi Dashboard
                  </div>

                  <button
                    onClick={() => setEmulatorActiveTab("dashboard")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "dashboard"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4 shrink-0" />
                    Satu Pandang Desa
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("stats")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "stats"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    Statistik Lengkap
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("apbdes")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "apbdes"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    Alokasi APBDes Detail
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("programs")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "programs"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    Program Prioritas Desa
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("kades")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "kades"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    Sambutan Kepala Desa
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("gallery")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "gallery"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 shrink-0" />
                    Dokumentasi Desa
                  </button>

                  <div className="border-t border-slate-700 my-2" />

                  <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase font-mono">
                    Integrasi & Debugger
                  </div>

                  <button
                    onClick={() => setEmulatorActiveTab("webview")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "webview"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <Globe className="w-4 h-4 shrink-0 text-blue-400 animate-pulse" />
                    WebView2 (Web Asli)
                  </button>

                  <button
                    onClick={() => setEmulatorActiveTab("sqlite")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-left cursor-pointer transition ${
                      emulatorActiveTab === "sqlite"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    <Terminal className="w-4 h-4 shrink-0 text-amber-400" />
                    SQLite DB Console
                  </button>

                  {/* Kades Fast Contact Card */}
                  <div className="mt-auto bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Layanan WhatsApp</p>
                    <p className="text-[11px] text-slate-300 mb-2 truncate">Kantor Kepala Desa</p>
                    <a
                      href={`https://wa.me/6281324626243?text=Halo%20Kantor%20Desa%20Pondok%20Panjang`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold bg-green-600 text-white hover:bg-green-500 rounded active:scale-95 transition cursor-pointer select-none"
                    >
                      <Phone className="w-3 h-3" />
                      Kirim Pesan (Fast)
                    </a>
                  </div>
                </aside>

                {/* Simulated Viewer Area */}
                <div className="flex-1 bg-slate-50 overflow-y-auto p-5 relative">
                  
                  {isLoading && (
                    <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200/80 backdrop-blur-xs text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-40 animate-pulse font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      MEMULIHKAN DATA WEB...
                    </div>
                  )}

                  {!villageData ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-slate-800">
                      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <p className="text-lg font-bold">Harap Tunggu...</p>
                      <p className="text-slate-500 text-sm">Menghubungkan scraping dan database lokal</p>
                    </div>
                  ) : (
                    <>
                      {/* SUBTABS SECTION */}
                      
                      {/* ================= emulatorActiveTab: DASHBOARD ================= */}
                      {emulatorActiveTab === "dashboard" && (
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6 text-slate-855"
                        >
                          
                          {/* Welcome Hero Panel */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-xl shadow-xs relative overflow-hidden">
                            <div className="absolute right-0 top-0 -mt-6 -mr-6 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl" />
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-ping" />
                              <span className="text-blue-600 font-mono text-[10px] tracking-wider uppercase font-bold">Sistem Administrasi Transparan</span>
                            </div>
                            <h2 className="text-xl font-bold font-sans text-slate-905">Selamat Datang di Portal Desa Pondok Panjang</h2>
                            <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                              Aplikasi <strong className="font-mono text-blue-604 text-xs">hedra-office-v3</strong> berhasil mengekstrak statistik aktual. Data telah dikeraskan pada database offline sqlite lokal untuk penunjang kecepatan pimpinan.
                            </p>
                          </div>

                          {/* Stat Grid Numbers */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 }}
                              whileHover={!isLoading ? { y: -3, scale: 1.02, transition: { duration: 0.2 } } : undefined}
                              className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs cursor-default hover:border-blue-300 transition-colors"
                            >
                              {isLoading ? (
                                <div className="p-2.5 bg-slate-100 rounded-lg animate-pulse w-11 h-11 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-slate-300" />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                  <Users className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">Total Penduduk</p>
                                {isLoading ? (
                                  <div className="h-6 w-24 bg-slate-200/80 rounded-md animate-pulse mt-1" />
                                ) : (
                                  <p className="text-lg font-bold text-slate-900 mt-0.5">{villageData.stats.population.toLocaleString()}</p>
                                )}
                                {isLoading ? (
                                  <div className="h-3 w-16 bg-slate-100/70 rounded-sm animate-pulse mt-1" />
                                ) : (
                                  <span className="text-[10px] text-slate-500">Jiwa Terdaftar</span>
                                )}
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              whileHover={!isLoading ? { y: -3, scale: 1.02, transition: { duration: 0.2 } } : undefined}
                              className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs cursor-default hover:border-emerald-300 transition-colors"
                            >
                              {isLoading ? (
                                <div className="p-2.5 bg-slate-100 rounded-lg animate-pulse w-11 h-11 flex items-center justify-center">
                                  <Home className="w-6 h-6 text-slate-300" />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                  <Home className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">Kepala Keluarga</p>
                                {isLoading ? (
                                  <div className="h-6 w-24 bg-slate-200/80 rounded-md animate-pulse mt-1" />
                                ) : (
                                  <p className="text-lg font-bold text-slate-900 mt-0.5">{villageData.stats.families.toLocaleString()}</p>
                                )}
                                {isLoading ? (
                                  <div className="h-3 w-16 bg-slate-100/70 rounded-sm animate-pulse mt-1" />
                                ) : (
                                  <span className="text-[10px] text-slate-500">Pamong Terdata</span>
                                )}
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.15 }}
                              whileHover={!isLoading ? { y: -3, scale: 1.02, transition: { duration: 0.2 } } : undefined}
                              className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs cursor-default hover:border-amber-300 transition-colors"
                            >
                              {isLoading ? (
                                <div className="p-2.5 bg-slate-100 rounded-lg animate-pulse w-11 h-11 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-slate-300" />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                                  <FileText className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">Jumlah RT/RW</p>
                                {isLoading ? (
                                  <div className="h-6 w-24 bg-slate-200/80 rounded-md animate-pulse mt-1" />
                                ) : (
                                  <p className="text-lg font-bold text-slate-900 mt-0.5">{villageData.stats.rtrw}</p>
                                )}
                                {isLoading ? (
                                  <div className="h-3 w-16 bg-slate-100/70 rounded-sm animate-pulse mt-1" />
                                ) : (
                                  <span className="text-[10px] text-slate-500">Wilayah Rukun</span>
                                )}
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              whileHover={!isLoading ? { y: -3, scale: 1.02, transition: { duration: 0.2 } } : undefined}
                              className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs cursor-default hover:border-purple-300 transition-colors"
                            >
                              {isLoading ? (
                                <div className="p-2.5 bg-slate-100 rounded-lg animate-pulse w-11 h-11 flex items-center justify-center">
                                  <MapPin className="w-6 h-6 text-slate-300" />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                                  <MapPin className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">Luas Wilayah</p>
                                {isLoading ? (
                                  <div className="h-6 w-24 bg-slate-200/80 rounded-md animate-pulse mt-1" />
                                ) : (
                                  <p className="text-lg font-bold text-slate-900 mt-0.5">{villageData.stats.areaSize} km²</p>
                                )}
                                {isLoading ? (
                                  <div className="h-3 w-16 bg-slate-100/70 rounded-sm animate-pulse mt-1" />
                                ) : (
                                  <span className="text-[10px] text-slate-500">Teramang Jaya</span>
                                )}
                              </div>
                            </motion.div>

                          </div>

                          {/* Quick Layout Split Pane */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            
                            {/* Announcements Feed Left side */}
                            <div className="lg:col-span-2 bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-xs">
                              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                                <h3 className="text-xs uppercase tracking-wider text-slate-850 font-mono font-bold flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  Pengumuman Terbaru & Agenda Desa
                                </h3>
                                <button
                                  onClick={() => setEmulatorActiveTab("announcements")}
                                  className="text-[10px] text-blue-600 hover:underline cursor-pointer font-bold"
                                >
                                  Selengkapnya
                                </button>
                              </div>

                              <div className="space-y-4">
                                {isLoading ? (
                                  [1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 bg-slate-50/40 rounded-lg border border-slate-150 animate-pulse">
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="h-3 w-20 bg-slate-200 rounded" />
                                        <div className="h-3 w-24 bg-slate-200/60 rounded" />
                                      </div>
                                      <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
                                      <div className="h-3 w-full bg-slate-100 rounded mb-1" />
                                      <div className="h-3 w-5/6 bg-slate-100 rounded" />
                                    </div>
                                  ))
                                ) : (
                                  villageData.announcements.map((ann) => (
                                    <div key={ann.id} className="p-3 bg-slate-50/70 rounded-lg border border-slate-150 hover:bg-slate-50 transition">
                                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-mono">
                                        <span className="text-blue-600 font-bold">{ann.author}</span>
                                        <span>Tanggal: {ann.date}</span>
                                      </div>
                                      <h4 className="text-xs font-bold text-slate-800 mb-1.5 leading-relaxed hover:text-blue-600">
                                        {ann.title}
                                      </h4>
                                      <p className="text-[11px] text-slate-600 leading-relaxed truncate">
                                        {ann.content}
                                      </p>
                                      <div className="mt-2 text-[10px] text-slate-500">
                                        Waktu: <span className="text-slate-600">{ann.time}</span> | Lokasi: <span className="text-slate-600">{ann.location}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            {/* APBDes Overview Bar chart mini */}
                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col shadow-xs">
                              <h3 className="text-xs uppercase tracking-wider text-slate-850 font-mono font-bold mb-4 pb-2 border-b border-slate-100">
                                Ringkasan Alokasi APBDes
                              </h3>
                              
                              <p className="text-[11px] text-slate-500 mb-4 font-sans leading-relaxed">
                                Distribusi rencana anggaran fungsional belanja desa dari portal resmi.
                              </p>

                              <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                                {isLoading ? (
                                  [1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="animate-pulse">
                                      <div className="flex justify-between items-center mb-1.5">
                                        <div className="h-3 w-28 bg-slate-200 rounded" />
                                        <div className="h-3 w-8 bg-slate-200 rounded" />
                                      </div>
                                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/30">
                                        <div className="bg-slate-200 h-full w-2/3 rounded-full animate-pulse" />
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  villageData.apbdes.map((categ) => (
                                    <div key={categ.category}>
                                      <div className="flex justify-between items-center text-xs mb-1">
                                        <span className="text-slate-700 truncate font-medium">{categ.category}</span>
                                        <span className="font-mono font-bold text-slate-900">{categ.percentage}%</span>
                                      </div>
                                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                                        <div
                                          className="h-full rounded-full"
                                          style={{
                                            width: `${categ.percentage}%`,
                                            backgroundColor: categ.color
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                                <button
                                  onClick={() => setEmulatorActiveTab("apbdes")}
                                  className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  Tampilkan Versi Grafik C#
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: STATS ================= */}
                      {emulatorActiveTab === "stats" && (
                        <motion.div
                          key="stats"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              Statistik Demografis Lengkap Desa
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Informasi kependudukan mendasar, perbandingan rasio jenis kelamin, dan rukun tetangga.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* General Stats Data Table */}
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-3">Tabel Parameter Penduduk</h3>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="border-b border-slate-200 text-slate-550 uppercase font-mono text-[9px]">
                                      <th className="py-2.5">Parameter</th>
                                      <th className="py-2.5 text-right">Data Scraping</th>
                                      <th className="py-2.5 text-right">Keterangan</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    <tr>
                                      <td className="py-3 text-slate-700 font-medium font-sans">Jumlah Penduduk</td>
                                      <td className="py-3 text-right text-slate-900 font-mono font-bold">4.876</td>
                                      <td className="py-3 text-right text-slate-500">Jiwa registered</td>
                                    </tr>
                                    <tr>
                                      <td className="py-3 text-slate-700 font-medium">Kepala Keluarga</td>
                                      <td className="py-3 text-right text-slate-900 font-mono font-bold">1.672</td>
                                      <td className="py-3 text-right text-slate-500">KK Aktif</td>
                                    </tr>
                                    <tr>
                                      <td className="py-3 text-slate-700 font-medium">Jumlah Rukun Tetangga (RT)</td>
                                      <td className="py-3 text-right text-slate-900 font-mono font-bold">74</td>
                                      <td className="py-3 text-right text-slate-500">Struktur Kewargaan</td>
                                    </tr>
                                    <tr>
                                      <td className="py-3 text-slate-700 font-medium">Luas Area Administrasi</td>
                                      <td className="py-3 text-right text-slate-900 font-mono font-bold">14,30 km²</td>
                                      <td className="py-3 text-right text-slate-500">Kepadatan: 341/km²</td>
                                    </tr>
                                    <tr>
                                      <td className="py-3 text-slate-700 font-medium">Rata-rata Anggota Per KK</td>
                                      <td className="py-3 text-right text-slate-900 font-mono font-bold">2.9 Jiwa</td>
                                      <td className="py-3 text-right text-slate-500">Keluarga Sedang</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Gender Distribution Visual */}
                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                              <div>
                                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-3">Distribusi Jenis Kelamin</h3>
                                <p className="text-[11px] text-slate-500 mb-5">
                                  Rasio perimbangan kependudukan laki-laki terhadap wanitany.
                                </p>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-blue-600 font-semibold flex items-center gap-1">Laki-Laki</span>
                                    <span className="font-mono text-slate-800 font-bold">51.5% (2.512 Jiwa)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
                                    <div className="h-full bg-blue-500" style={{ width: "51.5%" }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-pink-600 font-semibold flex items-center gap-1">Perempuan</span>
                                    <span className="font-mono text-slate-800 font-bold">48.5% (2.364 Jiwa)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
                                    <div className="h-full bg-pink-500" style={{ width: "48.5%" }} />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed text-center">
                                Rasio Jenis Kelamin desa Pondok Panjang berada pada kisaran stabil <strong className="text-slate-900 font-mono text-xs font-bold">106.2</strong>, menjamin kestabilan produktivitas tenaga kerja pertanian desa.
                              </div>
                            </div>

                            {/* Year over Year Population Growth Trend using Recharts */}
                            <div className="md:col-span-2 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    Tren Pertumbuhan Penduduk Desa (YoY)
                                  </h3>
                                  <p className="text-[11px] text-slate-500 font-sans">
                                    Visualisasi historis pertumbuhan berkas kependudukan Desa Pondok Panjang (2018 - 2026)
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs font-mono">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                    <span className="text-slate-600">Total Penduduk</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-550" style={{ backgroundColor: "#10b981" }} />
                                    <span className="text-slate-600">Laju Pertumbuhan (+YoY)</span>
                                  </div>
                                </div>
                              </div>

                              <div className="h-[280px] w-full mt-2 font-mono text-[10px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                    data={[
                                      { tahun: "2018", total: 3892, pertumbuhan: 0 },
                                      { tahun: "2019", total: 4005, pertumbuhan: 113 },
                                      { tahun: "2020", total: 4120, pertumbuhan: 115 },
                                      { tahun: "2021", total: 4235, pertumbuhan: 115 },
                                      { tahun: "2022", total: 4380, pertumbuhan: 145 },
                                      { tahun: "2023", total: 4510, pertumbuhan: 130 },
                                      { tahun: "2024", total: 4640, pertumbuhan: 130 },
                                      { tahun: "2025", total: 4765, pertumbuhan: 125 },
                                      { tahun: "2026", total: 4876, pertumbuhan: 111 }
                                    ]}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                      dataKey="tahun"
                                      stroke="#94a3b8"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={{ stroke: "#e2e8f0" }}
                                    />
                                    <YAxis
                                      yAxisId="left"
                                      stroke="#2563eb"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={{ stroke: "#e2e8f0" }}
                                      domain={[3500, 5000]}
                                      tickFormatter={(v) => `${v}`}
                                    />
                                    <YAxis
                                      yAxisId="right"
                                      orientation="right"
                                      stroke="#10b981"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={{ stroke: "#e2e8f0" }}
                                      tickFormatter={(v) => `+${v}`}
                                    />
                                    <Tooltip
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-sans space-y-1.5 border border-slate-700">
                                              <p className="font-mono font-bold text-slate-300">Tahun {label}</p>
                                              <p className="flex items-center justify-between gap-6">
                                                <span className="text-slate-400">Total Penduduk:</span>
                                                <span className="font-bold font-mono text-blue-400">{payload[0].value?.toLocaleString()} Jiwa</span>
                                              </p>
                                              {payload[1] && typeof payload[1].value === "number" && payload[1].value > 0 && (
                                                <p className="flex items-center justify-between gap-6">
                                                  <span className="text-slate-400">Delta YoY:</span>
                                                  <span className="font-bold font-mono text-emerald-400">+{payload[1].value} Jiwa</span>
                                                </p>
                                              )}
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Line
                                      yAxisId="left"
                                      type="monotone"
                                      dataKey="total"
                                      stroke="#2563eb"
                                      strokeWidth={3}
                                      activeDot={{ r: 6 }}
                                      dot={{ r: 4, stroke: "#2563eb", strokeWidth: 1, fill: "#fff" }}
                                    />
                                    <Line
                                      yAxisId="right"
                                      type="monotone"
                                      dataKey="pertumbuhan"
                                      stroke="#10b981"
                                      strokeWidth={2}
                                      strokeDasharray="4 4"
                                      dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#fff" }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="mt-4 flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50 text-[10.5px] text-slate-600 leading-relaxed font-sans">
                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5">Analisis</span>
                                <div>
                                  Pertumbuhan penduduk Desa Pondok Panjang menampakkan kurva kenaikan yang konsisten dari <strong className="text-slate-900 font-mono">3.892 Jiwa (2018)</strong> hingga mencapai <strong className="text-slate-900 font-mono">4.876 Jiwa (2026)</strong> dengan rata-rata pertumbuhan riil berkisar antara 110 hingga 145 jiwa per tahun, didorong oleh peningkatan kualitas sanitasi dan fasilitas kesehatan desa terpadu.
                                </div>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: APBDES ================= */}
                      {emulatorActiveTab === "apbdes" && (
                        <motion.div
                          key="apbdes"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-905 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-blue-600" />
                              Alokasi Anggaran APBDes TA 2026
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Rincian fungsional alokasi sirkulasi APBD Desa dan peruntukannya berlandaskan asas musyawarah bersama.
                            </p>
                          </div>

                          {/* Graphical bar chart simulation */}
                          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-4 text-center">
                              Grafis Perbandingan APBDes (.NET WinForms Chart Simulation)
                            </h3>
                            
                            {/* Realistic Bar Chart Representation */}
                            <div className="space-y-5 py-2">
                              {villageData.apbdes.map(apb => (
                                <div key={apb.category} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                  <div className="md:col-span-3 text-xs text-slate-705 font-medium">
                                    {apb.category}
                                  </div>
                                  <div className="md:col-span-7 flex items-center gap-3">
                                    <div className="flex-1 bg-slate-100 h-6 rounded-md overflow-hidden border border-slate-200 flex relative">
                                      <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                          width: `${apb.percentage}%`,
                                          backgroundColor: apb.color
                                        }}
                                      />
                                      <span className="absolute inset-y-0 right-30 flex items-center text-[10px] font-mono font-bold text-slate-400 select-none pointer-events-none">
                                        Limit Target
                                      </span>
                                    </div>
                                    <span className="w-12 text-xs font-mono font-bold text-slate-800 text-right">
                                      {apb.percentage}%
                                    </span>
                                  </div>
                                  <div className="md:col-span-2 text-right font-mono text-xs text-blue-600 font-bold">
                                    Rp {(apb.percentage * 15000000).toLocaleString("id-ID")}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <p className="text-[10px] text-slate-500 mt-4 text-center">
                              *Estimasi anggaran diasumsikan berlandaskan baseline APBDes total senilai Rp 1.500.000.000 (Satu Milyar Lima Ratus Juta Rupiah).
                            </p>
                          </div>

                          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-3">Tabel Breakdown Anggaran</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[9px]">
                                    <th className="py-2.5">Sektor Pengeluaran</th>
                                    <th className="py-2.5 text-center">Proporsi %</th>
                                    <th className="py-2.5 text-center">Asumsi Rupiah</th>
                                    <th className="py-2.5 text-right">Target Sasaran Transparansi</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {villageData.apbdes.map(apb => (
                                    <tr key={apb.category} className="hover:bg-slate-50 transition">
                                      <td className="py-3 text-slate-700 font-medium">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: apb.color }} />
                                          {apb.category}
                                        </div>
                                      </td>
                                      <td className="py-3 text-center text-slate-800 font-mono font-bold">{apb.percentage}%</td>
                                      <td className="py-3 text-center text-blue-600 font-mono">Rp {(apb.percentage * 15000000).toLocaleString("id-ID")}</td>
                                      <td className="py-3 text-right text-slate-650">
                                        {apb.category === "Pemerintahan" && "Operasional kaur, insentif RT/RW, ATK"}
                                        {apb.category === "Pembangunan" && "Jalan rabat beton, parit drainase"}
                                        {apb.category === "Kemasyarakatan" && "Gerebek gotong royong, adat, pemuda"}
                                        {apb.category === "Pemberdayaan" && "Pelatihan tani, komputer, UMKM"}
                                        {apb.category === "Bencana & Mendesak" && "BLT Dana Desa (BLT-DD) stimulus"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: PROGRAMS ================= */}
                      {emulatorActiveTab === "programs" && (
                        <motion.div
                          key="programs"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                              Program Kerja Prioritas Desa
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Tujuh program pembangunan desa mutlak yang menjadi prioritas utama pembangunan sirkulasi tahun anggaran ini.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {villageData.priorityPrograms.map(p => (
                              <div
                                key={p.code}
                                onClick={() => setSelectedProgramCode(p.code)}
                                className="group bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-650 text-[10px] font-mono rounded">
                                      {p.code}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${
                                      p.status === "Selesai"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : p.status === "Sedang Berjalan"
                                        ? "bg-blue-50 text-blue-750 border-blue-200"
                                        : p.status === "Rutin"
                                        ? "bg-purple-50 text-purple-705 border-purple-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>
                                      {p.status}
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1.5">{p.name}</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                    {p.desc}
                                  </p>
                                </div>
                                <div>
                                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono">
                                    <span className="text-slate-500">Estimasi Biaya:</span>
                                    <span className="text-blue-600 font-bold">Rp {p.cost.toLocaleString("id-ID")}</span>
                                  </div>
                                  <div className="mt-2 pt-0.5 flex items-center justify-end text-[10px] text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Detail & Timeline &rarr;
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: KADES ================= */}
                      {emulatorActiveTab === "kades" && (
                        <motion.div
                          key="kades"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-blue-600" />
                              Sambutan Kepala Desa Pondok Panjang
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Pernyataan visi dan komitmen dari pimpinan desa Heru Purnomo, ST.
                            </p>
                          </div>

                          <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center shadow-xs">
                            
                            {/* Kades Graphic Photo */}
                            <div className="w-40 h-40 shrink-0 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-3 relative overflow-hidden group shadow-xs">
                              <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent pointer-events-none" />
                              
                              {/* Simple Profile Mockup */}
                              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mb-2 shadow-md shadow-blue-500/10">
                                HP
                              </div>
                              <span className="text-xs font-bold text-slate-800 font-sans text-center">Heru Purnomo, ST</span>
                              <span className="text-[9px] uppercase font-mono tracking-wider text-blue-650 font-bold mt-1">Kepala Desa</span>
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="bg-slate-105 p-4 rounded-lg border border-slate-200 relative">
                                <span className="absolute -top-3 left-4 text-3xl font-serif text-blue-500/40 select-none">“</span>
                                <p className="text-xs text-slate-700 leading-relaxed italic pl-3 pr-2">
                                  {villageData.villageMetadata.head.greetings}
                                </p>
                                <span className="absolute -bottom-6 right-4 text-3xl font-serif text-blue-500/40 select-none">”</span>
                              </div>

                              <div className="pt-2 text-xs text-slate-500">
                                <p>Tanda Tangan Pimpinan,</p>
                                <p className="font-bold text-slate-900 font-sans mt-1.5 text-xs">Heru Purnomo, ST</p>
                                <p className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">Kepala Desa Pondok Panjang</p>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: GALLERY ================= */}
                      {emulatorActiveTab === "gallery" && (
                        <motion.div
                          key="gallery"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-blue-600" />
                              Galeri Dokumentasi & Kegiatan
                            </h2>
                            <p className="text-xs text-slate-505 mt-1">
                              Koleksi visual bukti implementasi program pembangunan fisik di wilayah desa Pondok Panjang.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {villageData.gallery.map(item => (
                              <div key={item.title} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="h-44 bg-slate-100 relative overflow-hidden">
                                  <img
                                    src={item.url}
                                    alt={item.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-800 text-[9px] font-mono text-slate-300">
                                    {item.date}
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="text-xs font-bold text-slate-805 leading-relaxed truncate">{item.title}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Pondok Panjang, Teramang Jaya</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: WEBVIEW ================= */}
                      {emulatorActiveTab === "webview" && (
                        <motion.div
                          key="webview"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-4 h-full flex flex-col justify-between"
                        >
                          <div className="border-b border-slate-200 pb-3 shrink-0">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <Globe className="w-5 h-5 text-blue-600" />
                              Microsoft WebView2 Control Simulator
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Menampilkan situs web resmi asli pondokpanjang.id di draf panel.
                            </p>
                          </div>

                          {/* Embedded Simulated webView controls */}
                          <div className="bg-white border border-slate-200 p-2 rounded-xl flex items-center justify-between text-xs font-mono shrink-0 shadow-xs">
                            <div className="flex items-center gap-2 pl-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                              <span className="text-slate-600">Secure Connection:</span>
                              <span className="text-blue-600 font-bold underline">https://pondokpanjang.id</span>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href="https://pondokpanjang.id"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 border border-blue-200 text-xs rounded text-blue-700 cursor-pointer transition-colors"
                              >
                                Buka di Browser Modern
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Real-time Iframe fallback if iframe allowed or friendly guide */}
                          <div className="flex-1 min-h-[380px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
                            {/* Attempt to display the live site, with fall-back styling since some user environments block frames */}
                            <iframe
                              src="https://pondokpanjang.id"
                              title="Pondok Panjang Live App"
                              className="w-full h-full border-0 absolute inset-0 bg-slate-100"
                              sandbox="allow-scripts allow-same-origin"
                            />
                            
                            <div className="absolute inset-y-0 right-0 w-64 bg-white/95 backdrop-blur-xs border-l border-slate-200 p-4 flex flex-col justify-between text-slate-800 z-10 pointer-events-none md:pointer-events-auto shadow-md">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Informasi WebView2</h4>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  Pada aplikasi C# native yang Anda buat dengan visual studio, file <code className="text-blue-600 text-[10px] font-mono leading-none bg-slate-100 px-1 rounded">MainForm.cs</code> akan memetakan kontrol <code className="text-[10px] text-blue-600">Microsoft.Web.WebView2.WinForms.WebView2</code>.
                                </p>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  Segala konten HTML5, scripts, CSS, terbukti berjalan lancar bersumberkan server hosting web asli tanpa hambatan CORS.
                                </p>
                              </div>
                              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="text-[9px] font-mono text-slate-400 uppercase block">C# Binding Engine</span>
                                <code className="text-[10px] text-blue-600 font-mono block select-all">
                                  webView.Source = new Uri("https://pondokpanjang.id");
                                </code>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ================= emulatorActiveTab: SQLITE ================= */}
                      {emulatorActiveTab === "sqlite" && (
                        <motion.div
                          key="sqlite"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <Terminal className="w-5 h-5 text-amber-600" />
                              SQLite Database Console Virtualizer
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Daftar riwayat audit refresh data scraping desa Pondok Panjang yang tersimpan di database lokal.
                            </p>
                          </div>

                          {/* SQLite Console Command query input */}
                          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                              Query Editor (Virtual ADO.NET SQLiteConnection)
                            </label>
                            
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customSqlQuery}
                                onChange={(e) => setCustomSqlQuery(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono rounded text-slate-800 focus:outline-none focus:border-blue-500"
                                placeholder="Ketik SQL query disini..."
                              />
                              <button
                                onClick={executeSqlQuery}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white rounded cursor-pointer transition active:scale-95 select-none shadow-xs"
                              >
                                Jalankan SQL
                              </button>
                            </div>
                            
                            <p className="text-[9px] text-slate-500 leading-relaxed">
                              *Kueri didukung: <code className="text-amber-600 font-mono text-[9px] bg-slate-50 px-1 rounded">SELECT * FROM file_refresh_log;</code> atau <code className="text-amber-600 font-mono text-[9px] bg-slate-50 px-1 rounded">SELECT * FROM pengumuman;</code>
                            </p>
                          </div>

                          {/* SQL QUERY RESULT OUTPUT */}
                          {sqlQueryResult && (
                            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-xs">
                              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-1.5 border-b border-slate-200">
                                <span>Hasil Eksekusi</span>
                                <span className="text-emerald-600 font-bold">{sqlQueryResult.message}</span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-[11px] text-left font-mono">
                                  <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[9px]">
                                      {sqlQueryResult.headers.map((h, i) => (
                                        <th key={i} className="py-1.5 pr-2">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {sqlQueryResult.rows.map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50 transition">
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx} className="py-1.5 pr-2 max-w-xs truncate">{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Core Log history database log */}
                          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-3">Logs Historis SQLite (Virtual DB: desa_data.sqlite)</h3>
                            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                              {sqlLogs.map((log, idx) => (
                                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-155 text-[11px] font-mono flex justify-between gap-4 shadow-2xs">
                                  <div>
                                    <span className="text-blue-600 font-bold">[{log.timestamp}]</span>{" "}
                                    <span className="text-slate-700">{log.query}</span>
                                  </div>
                                  <span className="text-green-600 font-bold shrink-0">Rows: {log.rowsAffected}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </motion.div>
                      )}

                    </>
                  )}

                </div>

              </div>

              {/* Windows Form Footer Status Strip */}
              <footer className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex justify-between text-[11px] text-slate-600 select-none shrink-0 font-sans font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Aplikasi Siap
                  </span>
                  <span>|</span>
                  <span>Database: SQLite (desa_data.sqlite)</span>
                  <span>|</span>
                  <span>DPI Scale: 100%</span>
                </div>
                <div>
                  Operating System: <strong className="text-slate-800">Windows 10/11 Compatible</strong>
                </div>
              </footer>

            </div>

          </div>
        )}

        {/* ================================== TAB 2: CODE GENERATOR ================================== */}
        {activeMainTab === "code" && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Sidebar selection for C# files */}
            <aside className="w-full md:w-80 bg-slate-50 p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">C# Source File list</h3>
                <p className="text-xs text-slate-500">Pilih berkas kode di bawah ini untuk disalin ke project Visual Studio Anda.</p>
              </div>

              <div className="space-y-1.5 mt-2 flex-1">
                {csharpCodeFiles.map((file, idx) => (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedCodeIndex(idx)}
                    className={`w-full flex items-start gap-2.5 p-3 rounded-lg text-left transition shadow-2xs ${
                      selectedCodeIndex === idx
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "bg-white border border-slate-150 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <CodeXml className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${selectedCodeIndex === idx ? "text-blue-600" : "text-slate-400"}`} />
                    <div>
                      <h4 className="text-xs font-bold font-mono">{file.filename}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[210px]">{file.title}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-205 shadow-2xs">
                <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold block mb-1 font-mono">Dependensi NuGet</span>
                <ul className="text-[10px] text-slate-600 space-y-1">
                  <li>• HtmlAgilityPack (v1.11+)</li>
                  <li>• Microsoft.Web.WebView2 (v1.0+)</li>
                  <li>• System.Data.SQLite.Core (v1.0+)</li>
                </ul>
              </div>
            </aside>

            {/* Code text content view box */}
            <section className="flex-1 overflow-hidden flex flex-col bg-slate-100 relative">
              
              {/* Header inside code panel */}
              <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5">
                    {csharpCodeFiles[selectedCodeIndex].filename}
                    <span className="px-2 py-0.5 bg-slate-105 text-[9px] font-semibold text-slate-500 rounded border border-slate-200">
                      {csharpCodeFiles[selectedCodeIndex].language.toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-550 mt-1">
                    {csharpCodeFiles[selectedCodeIndex].description}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCode(csharpCodeFiles[selectedCodeIndex].content)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 font-bold text-white px-4 py-2 text-xs rounded shadow transition cursor-pointer select-none active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-305" />
                      Berhasil Disalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Salin Kode C#
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre container */}
              <div className="flex-1 overflow-auto p-5 bg-slate-50 font-mono text-xs text-slate-700 leading-relaxed scrollbar-thin">
                <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 select-all overflow-x-auto whitespace-pre shadow-sm">
                  <code>{csharpCodeFiles[selectedCodeIndex].content}</code>
                </pre>
              </div>

              {/* Quick Steps Guide pane footer */}
              <div className="bg-slate-100 border-t border-slate-200 p-4 shrink-0 font-sans shadow-inner">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Bagaimana Cara Menjalankan Kode di Atas?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-655">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="font-bold text-blue-600 block mb-1">1. Buat Proyek</span>
                    Buka Visual Studio 2022, pilih template <strong className="text-slate-800">Windows Forms App (.NET)</strong> dengan target framework <strong className="text-slate-800 font-mono">.NET 8.0 (Windows)</strong>. Beri nama <strong className="text-slate-800">hedra-office-v3</strong>.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="font-bold text-blue-600 block mb-1">2. Install NuGet</span>
                    Klik kanan proyek di Solution Explorer &gt; Manage NuGet Packages. Cari dan instal tiga komponen: <strong className="text-slate-800">HtmlAgilityPack</strong>, <strong className="text-slate-800 font-mono">Microsoft.Web.WebView2</strong>, dan <strong className="text-slate-800 font-mono">System.Data.SQLite.Core</strong>.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="font-bold text-blue-600 block mb-1">3. Salin Kode</span>
                    Buat berkas-berkas sesuai nama di samping kiri panel (<strong className="text-slate-800 font-mono">ScraperService.cs</strong>, dll), salin isinya, kemudian ganti kode file desainer utama.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="font-bold text-blue-600 block mb-1">4. Build & Run</span>
                    Tekan tombol <strong className="text-slate-800">F5</strong> atau tombol play hijau di Visual Studio untuk mengompilasi. Program siap berjalan offline & online dengan lancar di Windows 10/11!
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

      </main>

      {/* Priority Program Detail Modal */}
      <AnimatePresence>
        {selectedProgramCode && (() => {
          const originalProgram = villageData?.priorityPrograms.find(p => p.code === selectedProgramCode);
          const detailedData = detailedProgramData[selectedProgramCode];
          if (!originalProgram || !detailedData) return null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4"
              onClick={() => setSelectedProgramCode(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] text-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-slate-900 text-white p-5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 bg-blue-600/30 border border-blue-500/20 text-blue-400 text-[10px] font-mono leading-none rounded-md font-bold uppercase tracking-wider">
                        {originalProgram.code}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md border ${
                        originalProgram.status === "Selesai"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : originalProgram.status === "Sedang Berjalan"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : originalProgram.status === "Rutin"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        {originalProgram.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-white leading-snug">{originalProgram.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProgramCode(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
                  {/* Executive Summary */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Deskripsi Program</h4>
                    <p className="text-sm text-slate-655 leading-relaxed font-sans">{originalProgram.desc}</p>
                  </div>

                  {/* Program Meta Information Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-450 block font-bold">Lokasi Sasaran</span>
                        <span className="text-xs font-semibold text-slate-700 leading-relaxed">{detailedData.targetLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-450 block font-bold">Penerima Manfaat</span>
                        <span className="text-xs font-semibold text-slate-700 leading-relaxed">{detailedData.pemberiManfaat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deep Structural Timeline Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Timeline & Kemajuan Pengerjaan
                    </h4>
                    <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 space-y-5">
                      {detailedData.timeline.map((item, index) => {
                        let isCompleted = item.status === "Selesai" || originalProgram.status === "Selesai";
                        let isOngoing = item.status === "Sedang Berjalan";
                        return (
                          <div key={index} className="relative">
                            {/* Bullet pin */}
                            <span className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full ring-4 ${
                              isCompleted
                                ? "bg-emerald-500 ring-emerald-50"
                                : isOngoing
                                ? "bg-blue-500 ring-blue-50 animate-pulse"
                                : "bg-slate-300 ring-slate-50"
                            }`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{item.phase}</span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                                  isCompleted
                                    ? "bg-emerald-50 text-emerald-700 font-bold"
                                    : isOngoing
                                    ? "bg-blue-50 text-blue-700 font-bold"
                                    : "bg-slate-100 text-slate-450 font-semibold"
                                }`}>
                                  {isCompleted ? "Selesai" : isOngoing ? "Sedang Berjalan" : "Perencanaan"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-505 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Deep Budget Items Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      Alokasi Pengeluaran Anggaran (APBDes)
                    </h4>
                    <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-150">
                      <div className="divide-y divide-slate-150/70">
                        {detailedData.budget.map((item, index) => (
                          <div key={index} className="p-3 font-sans flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium flex-1 pr-4">{item.item}</span>
                            <span className="font-mono font-bold text-slate-800 shrink-0 text-right">
                              Rp {item.amount.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-emerald-55/30 p-3.5 border-t border-slate-150 flex justify-between items-center text-xs font-mono font-bold">
                        <span className="text-slate-700 uppercase tracking-wide">Total Estimasi Realisasi:</span>
                        <span className="text-emerald-700 text-sm">
                          Rp {originalProgram.cost.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center">
                  <span className="text-[10px] text-slate-405 font-mono">
                    ID Kode Proyek: <strong className="text-slate-500">{originalProgram.code}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedProgramCode(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
