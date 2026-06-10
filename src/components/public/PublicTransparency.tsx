import React, { useState } from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { 
  TrendingUp, PiggyBank, Calendar, MapPin, Users, 
  CheckCircle2, Clock, Eye, X, HelpCircle, FileText
} from "lucide-react";

interface PublicTransparencyProps {
  villageData: any;
  addToast: any;
}

// Full specifications of priority programs
const localProgramDetails: Record<string, {
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
    targetLocation: "Akses Jalan Sentra Tani RT 12 (Dusun I - III)",
    pemberiManfaat: "185 KK Petani Kelapa Sawit & Karet"
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
    targetLocation: "Kawasan Pemukiman Padat RT 04 (Dusun II)",
    pemberiManfaat: "96 Kepala Keluarga dari ancaman luapan air parit"
  },
  "PR-03": {
    timeline: [
      { phase: "Januari - Maret (Triwulan I)", desc: "Penyediaan vitamin A, imunisasi dasar polio/DPT, & pembagian susu formula balita.", status: "Selesai" },
      { phase: "April - Juni (Triwulan II)", desc: "Distribusi makanan tambahan bergizi (bubur kacang hijau, biskuit sehat, telur rebus).", status: "Selesai" },
      { phase: "Juli - Desember (Triwulan III-IV)", desc: "Monitoring berkala berat badan balita & penyuluhan hidup bersih sehat kader lansia.", status: "Rutin" }
    ],
    budget: [
      { item: "Pengadaan Alat Kesehatan Timbangan Digital & Stadiometer Tinggi Badan", amount: 8000000 },
      { item: "Bahan PMT Bergizi (Susu, Kacang Hijau, Telur, Suplemen Ibu Hamil)", amount: 25000000 },
      { item: "Insentif Mengajar Lansia & Transport Pemantau Kader KB", amount: 12000050 }
    ],
    targetLocation: "Gedung Poskesdes Melati Indah, Dusun III Sektor Barat",
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
    targetLocation: "PAUD Harapan Bangsa & SD Negeri 02 Teramang Jaya",
    pemberiManfaat: "80 Anak Usia Sekolah & 4 Tenaga Pendidik PAUD"
  },
  "PR-05": {
    timeline: [
      { phase: "Tahap I (Juni)", desc: "Sosialisasi program kemitraan & pendaftaran minat usaha mikro desa.", status: "Selesai" },
      { phase: "Tahap II (Juli)", desc: "Penyusunan modul pelatihan kemasan produk & tata cara digital marketing.", status: "Perencanaan" }
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
      { phase: "Tahap I (Mei)", desc: "Survei rumah calon penerima manfaat & verifikasi kepemilikan status tanah.", status: "Selesai" },
      { phase: "Tahap II (Juni)", desc: "Finalisasi daftar 3 sasaran rumah & penyusunan rencana anggaran biaya detail.", status: "Selesai" },
      { phase: "Tahap III (Juli - Agustus)", desc: "Droping material bangunan primer (Kayu, bata, spandek).", status: "Perencanaan" }
    ],
    budget: [
      { item: "Paket Bahan Bangunan Konstruksi (Bata, Semen, Spandek, Kusen Kayu)", amount: 60000000 },
      { item: "Sanitasi MCK Sederhana & Instalasi Kelistrikan", amount: 15000000 },
      { item: "Uang Saku Padat Karya Tukang & Konsumsi Gotong Royong", amount: 15000000 }
    ],
    targetLocation: "Rumah Prasejahtera Dusun I & Dusun V",
    pemberiManfaat: "3 Keluarga Kurang Mampu (Yatim Piatu, Buruh Harian)"
  }
};

export default function PublicTransparency({ villageData, addToast }: PublicTransparencyProps) {
  const apbdes = villageData?.apbdes || [];
  const priorityPrograms = villageData?.priorityPrograms || [];
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // Transform data for recharts PieChart
  const pieData = apbdes.map((item: any) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: item.color || "#10B981"
  }));

  const totalBudget = apbdes.reduce((acc: number, cur: any) => acc + cur.amount, 0);

  const handleOpenProgram = (prog: any) => {
    const details = localProgramDetails[prog.code] || {
      timeline: [],
      budget: [],
      targetLocation: "Dusun Sektor Tersebar",
      pemberiManfaat: "Seluruh Masyarakat Desa"
    };

    setSelectedProgram({
      ...prog,
      ...details
    });
    addToast(`Memuat lembar spesifikasi program ${prog.code}: ${prog.name}`, "success", "Info Program");
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* 1. STATE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">PAGU ANGGARAN APBDes</span>
            <strong className="text-xl font-black text-slate-800 font-sans tracking-tight">Rp {totalBudget.toLocaleString("id-ID")}</strong>
            <p className="text-[10px] text-emerald-600 font-mono font-bold mt-0.5">✓ 100% Ditransfer Pusat & Kemenkeu</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">PRIORITAS PEMBANGUNAN</span>
            <strong className="text-xl font-black text-slate-800 font-sans tracking-tight">{priorityPrograms.length} Sektor</strong>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Padat karya tunai desa warga lokal</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">PENILAIAN TRANSPARANSI</span>
            <strong className="text-xl font-black text-slate-800 font-sans tracking-tight">Kelas A (Unggul)</strong>
            <p className="text-[10px] text-amber-600 font-mono font-bold mt-0.5">✓ Rekomendasi Bebas Korupsi DPMD</p>
          </div>
        </div>
      </div>

      {/* 2. APBDES DEEP DIVE GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Pie Chart Alokasi Sektor (%)
            </h3>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Pembagian proporsi modal anggaran berdasarkan keputusan APBDes murni kesepakatan Musrenbangdes Pondok Panjang.
            </p>
          </div>

          <div className="h-56 my-4 relative flex items-center justify-center font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`} 
                  contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total Dana</span>
              <span className="block text-sm font-extrabold text-slate-700 font-mono">Rp 1.5 M</span>
            </div>
          </div>

          <div className="space-y-1.5 select-none text-[10px]">
            {pieData.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-slate-650">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold">{item.name} ({item.percentage}%)</span>
                </div>
                <strong className="font-mono text-slate-800 text-[10.5px]">Rp {item.value.toLocaleString("id-ID")}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LIST OF BUDGET CATEGORIES WITH PROGRESS */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Detail Rencana Penggunaan Tiap Bidang Sektoral
          </h3>
          <p className="text-[11.5px] text-slate-500 leading-relaxed">
            Anggaran APBDes dialokasikan murni untuk memihak pada kepentingan warga prasejahtera, stabilitas ketahanan pangan, tanggap darurat bencana, dan pemberdayaan operasional administrasi.
          </p>

          <div className="space-y-3.5 pt-1">
            {apbdes.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-extrabold text-slate-800 block">Bidang {item.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Porsi Sektoral: {item.percentage}%</span>
                  </div>
                  <strong className="font-mono text-emerald-700 text-xs md:text-sm">Rp {item.amount.toLocaleString("id-ID")}</strong>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color || "#10B981" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PRIORITY PROGRAMS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex justify-between items-center bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            7 Program Infrastruktur Prioritas & Pemberdayaan Aktif
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Pilih program untuk Lembar Detail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 text-xs">
          {priorityPrograms.map((p: any) => (
            <div 
              key={p.code} 
              onClick={() => handleOpenProgram(p)}
              className="group border border-slate-200 hover:border-emerald-500 p-4 rounded-xl bg-slate-50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold uppercase">
                    ID: {p.code}
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                    p.status === "Selesai" 
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-400/20" 
                      : p.status === "Sedang Berjalan"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-400/20"
                      : p.status === "Rutin"
                      ? "bg-purple-500/10 text-purple-600 border border-purple-400/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-400/20"
                  }`}>
                    ● {p.status}
                  </span>
                </div>

                <strong className="text-slate-800 font-extrabold group-hover:text-emerald-700 transition leading-snug block">
                  {p.name}
                </strong>
                <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                  {p.desc}
                </p>
              </div>

              <div className="border-t border-slate-100/80 mt-4 pt-3.5 flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Anggaran Alokasi</span>
                  <strong className="text-slate-800 font-extrabold font-mono text-xs">Rp {p.cost.toLocaleString("id-ID")}</strong>
                </div>
                <div className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px] uppercase font-mono group-hover:translate-x-1 duration-200">
                  <span>Lihat Detil</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. INTERACTIVE DETAIL OVERLAY MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4 font-sans animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-xl text-xs flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white p-5 text-left flex justify-between items-start relative">
              <div className="space-y-1">
                <span className="bg-emerald-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  LEMBAR KHUSUS INVESTASI PRIORITAS ({selectedProgram.code})
                </span>
                <h4 className="text-base font-extrabold tracking-tight">{selectedProgram.name}</h4>
                <p className="text-[11px] text-slate-200">Keterangan rinci penyerapan anggaran modal fisik Desa Pondok Panjang.</p>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 hover:scale-105 transition cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[460px] text-left leading-normal">
              
              {/* Meta Stats Panel */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">LOKASI FISIK TARGET</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    {selectedProgram.targetLocation}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">PENERIMA MANFAAT</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {selectedProgram.pemberiManfaat}
                  </span>
                </div>
              </div>

              {/* Budget Item Analysis */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Draf Pos Pengeluaran Dana</span>
                <div className="border border-slate-150 rounded divide-y divide-slate-100 text-[11px]">
                  {selectedProgram.budget.map((bItem: any, bIdx: number) => (
                    <div key={bIdx} className="p-2 flex justify-between items-center font-medium">
                      <span className="text-slate-650 max-w-[280px] truncate" title={bItem.item}>{bItem.item}</span>
                      <strong className="font-mono text-slate-800 shrink-0">Rp {bItem.amount.toLocaleString("id-ID")}</strong>
                    </div>
                  ))}
                  <div className="p-2 flex justify-between items-center font-bold bg-slate-50 text-emerald-800 border-t border-slate-200">
                    <span>JUMLAH ALOKASI (RAB)</span>
                    <span className="font-mono">Rp {selectedProgram.cost.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {/* Timelines Phases list */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tahapan Realisasi Fisik Lapangan</span>
                <div className="space-y-2.5 border-l border-slate-200 pl-3.5 relative">
                  {selectedProgram.timeline.map((stage: any, sIdx: number) => (
                    <div key={sIdx} className="space-y-0.5 relative text-[11px]">
                      {/* Timeline status badge dot */}
                      <span className={`absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        stage.status === "Selesai" 
                          ? "bg-emerald-500" 
                          : stage.status === "Sedang Berjalan"
                          ? "bg-blue-500"
                          : "bg-slate-300"
                      }`} />
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800 font-extrabold">{stage.phase}</strong>
                        <span className={`text-[8.5px] font-bold px-1 rounded uppercase tracking-wider ${
                          stage.status === "Selesai" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : stage.status === "Sedang Berjalan"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>{stage.status}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-[10.5px]">
                        {stage.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10.5px] cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
