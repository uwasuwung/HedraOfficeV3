import React, { useState } from "react";
import { DollarSign, ShieldAlert, Users, Search, AlertCircle, CheckCircle, FileText, Send, Upload, Info, Check, Plus } from "lucide-react";

interface VillageServicesProps {
  villageData: any;
  setVillageData: React.Dispatch<React.SetStateAction<any>>;
  addToast: (message: string, type: "success" | "error" | "info", title?: string) => void;
}

interface Complaint {
  id: string;
  name: string;
  nik: string;
  phone: string;
  category: string;
  title: string;
  content: string;
  location: string;
  date: string;
  status: "Diterima" | "Verifikasi" | "Tindak Lanjut" | "Selesai";
  reply: string;
  image?: string;
}

export default function VillageServices({ villageData, setVillageData, addToast }: VillageServicesProps) {
  const [activeServiceTab, setActiveServiceTab] = useState<"pbb" | "pengaduan" | "lapor">("pbb");

  // ================= PBB (PAJAK BUMI & BANGUNAN) STATES =================
  const [nopInput, setNopInput] = useState("17.06.040.012.008-0192.0");
  const [queriedPbb, setQueriedPbb] = useState<any>({
    nop: "17.06.040.012.008-0192.0",
    namaWp: "H. Sukiman Prayitno",
    alamatOp: "Dusun III RT 08, Desa Pondok Panjang",
    luasBumi: 1200, // m2
    luasBangunan: 150, // m2
    njopBumi: 140000, // per m2
    njopBangunan: 650000, // per m2
    taxYear: "2026",
    pajakTerhutang: 215000,
    statusBayar: "Belum Bayar",
    billingCode: "8206917028300"
  });

  // Custom PBB Calculator state
  const [calcBumi, setCalcBumi] = useState(1000);
  const [calcBangunan, setCalcBangunan] = useState(120);
  const [customNjopBumi, setCustomNjopBumi] = useState(150000);
  const [customNjopBangunan, setCustomNjopBangunan] = useState(700000);

  // ================= PENGADUAN COMPLAINT STATES =================
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "ADU-2026-001",
      name: "Suryaman Hendri",
      nik: "1706041104850002",
      phone: "081273948501",
      category: "Infrastruktur",
      title: "Jembatan Gantung Penghubung Sawit Lapuk & Rapuh",
      content: "Pondasi kayu bagian tengah jembatan penyebrangan motor di Blok Sentra Tani RT 11 sudah keropos parah. Ada beberapa warga yang bannya terperosok berulang kali kemarin lusa. Tolong segera ditambal sementara dengan semen raba sebelum ambruk total.",
      location: "Batas Aliran Parit Blok Sentra Tani Dusun II",
      date: "08 Juni 2026",
      status: "Tindak Lanjut",
      reply: "Terima kasih Pak Suryaman. Laporan dikonfirmasi oleh Kasi Kesejahteraan Desa. Hari ini (10 Juni) dropping bahan kayu kaso pengganti dan solar jembatan sudah berada di lokasi. Gotong royong perbaikan darurat akan dimulai besok pagi bersama warga setempat.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400"
    },
    {
      id: "ADU-2026-002",
      name: "Anonim / Rahasia Warga",
      nik: "1706042308900001",
      phone: "082384910291",
      category: "Ketertiban Umum",
      title: "Pembuangan Sampah Liar di Pinggiran Kebun Karet",
      content: "Ada oknum yang sering membuang bundel plastik sampah rumah tangga dan sampah sayuran busuk setiap malam sekitar pukul 22:00 WIB di pinggir jalan kebun karet Dusun I. Menyebabkan bau busuk menyengat arah angin pemukiman terdekat. Mohon dipasang papan peringatan larangan membuang sampah.",
      location: "Pinggiran Jalan Kebun Karet Dusun I",
      date: "04 Juni 2026",
      status: "Selesai",
      reply: "Laporan sukses ditindaklanjuti. Linmas desa telah merazia tersembunyi dan memasang papan spanduk larangan denda adat Rp 500.000 bagi oknum pembuang sampah liar di wilayah tersebut. Kebun karet kini bersih kembali.",
    }
  ]);

  const [newComplaint, setNewComplaint] = useState({
    name: "",
    nik: "",
    phone: "",
    category: "Infrastruktur",
    title: "",
    content: "",
    location: "",
    isAnonim: false
  });

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ================= LAPOR KEPENDUDUKAN STATES =================
  const [laporType, setLaporType] = useState<"birth" | "death" | "mutasi">("birth");
  const [birthForm, setBirthForm] = useState({
    namaBayi: "Andika Pratama",
    namaAyah: "Suprapto",
    namaIbu: "Siti Rahmawati",
    tanggalLahir: "2026-06-01",
    tempatLahir: "Puskesmas Teramang Jaya",
    dusun: "Dusun II"
  });

  const [deathForm, setDeathForm] = useState({
    namaAlmarhum: "Mbah Kartono",
    nik: "1706040801350001",
    tanggalWafat: "2026-05-28",
    penyebab: "Usia Lanjut (Sakit Tua)",
    tempatWafat: "Rumah Duka Dusun I"
  });

  const [mutasiForm, setMutasiForm] = useState({
    namaKepala: "Wawan Hermawan",
    nik: "3204121508880004",
    arahMutasi: "masuk", // masuk / keluar
    asalProvinsi: "Jawa Barat",
    jumlahKeluarga: 3,
    alamatBaru: "Dusun III RT 07, Desa Pondok Panjang"
  });

  const [lastSubmissionSlip, setLastSubmissionSlip] = useState<any>(null);

  // ================= PBB LOGIC =================
  const handlePbbSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nopInput === "17.06.040.012.008-0192.0") {
      setQueriedPbb({
        nop: "17.06.040.012.008-0192.0",
        namaWp: "H. Sukiman Prayitno",
        alamatOp: "Dusun III RT 08, Desa Pondok Panjang",
        luasBumi: 1200,
        luasBangunan: 150,
        njopBumi: 140000,
        njopBangunan: 650000,
        taxYear: "2026",
        pajakTerhutang: 215000,
        statusBayar: "Belum Bayar",
        billingCode: "8206917028300"
      });
      addToast("Data objek pajak NOP Sukses ditemukan!", "success", "NOP Ditemukan");
    } else {
      // Simulate generated random NOP info
      const numericNop = nopInput.replace(/[^0-9]/g, "");
      if (numericNop.length < 10) {
        addToast("Nomor Objek Pajak (NOP) tidak valid! Periksa kembali 18 digit angka Anda.", "error", "NOP Salah");
        return;
      }
      const randomSeed = parseInt(numericNop.slice(-4)) || 4520;
      const isPaid = randomSeed % 2 === 0;
      const calculatedBumi = (randomSeed % 500) + 200;
      const calculatedBangunan = (randomSeed % 120) + 40;
      const tax = (calculatedBumi * 120) + (calculatedBangunan * 450);

      setQueriedPbb({
        nop: nopInput,
        namaWp: `Wajib Pajak (Desa No. ${randomSeed})`,
        alamatOp: `RT ${String((randomSeed % 12) + 1).padStart(2, "0")}, Desa Pondok Panjang`,
        luasBumi: calculatedBumi,
        luasBangunan: calculatedBangunan,
        njopBumi: 120000,
        njopBangunan: 600000,
        taxYear: "2026",
        pajakTerhutang: Math.round(tax / 100) * 100,
        statusBayar: isPaid ? "Sudah Bayar" : "Belum Bayar",
        billingCode: `82026${randomSeed}${numericNop.slice(-5)}`
      });
      addToast("Objek pajak baru di-query dari basis data kependudukan desa.", "info", "PBB Ditemukan");
    }
  };

  const handleSimulatePayment = () => {
    if (!queriedPbb) return;
    setQueriedPbb(prev => ({
      ...prev,
      statusBayar: "Sudah Bayar"
    }));
    addToast(
      "Pembayaran PBB senilai Rp " + queriedPbb.pajakTerhutang.toLocaleString("id-ID") + " disimulasikan LUNAS via Bank Bengkulu / Kantor Pos!",
      "success",
      "Simulasi PBB Lunas"
    );
  };

  // ================= CALCULATE EST PBB =================
  const estNjopBumi = calcBumi * customNjopBumi;
  const estNjopBangunan = calcBangunan * customNjopBangunan;
  const totalNjop = estNjopBumi + estNjopBangunan;
  const njoptkp = 12000000; // Standar NJOPTKP Rp 12 juta
  const njopKenaPajak = Math.max(0, totalNjop - njoptkp);
  // Nilai Jual Kena Pajak (NJKP) 20%
  const njkp = njopKenaPajak * 0.20;
  // Tarif PBB Sektor Perdesaan 0.1%
  const estTarifPbb = Math.round(njkp * 0.001);

  // ================= COMPLAINT INCIDENT =================
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      addToast(`Bukti gambar ${e.dataTransfer.files[0].name} tersambung!`, "success", "Berkas Diterima");
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      addToast(`Berkas lampiran ${e.target.files[0].name} siap diunggah.`, "info", "File Terlampir");
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.title || !newComplaint.content) {
      addToast("Mohon isi judul dan isi lengkap narasi laporan pengaduan Anda.", "error", "Gagal Mengadukan");
      return;
    }

    const complainId = `ADU-2026-` + String(complaints.length + 1).padStart(3, "0");
    const docAuthor = newComplaint.isAnonim ? "Anonim / Privat Warga" : (newComplaint.name || "Warga Terdaftar");

    const submittedObj: Complaint = {
      id: complainId,
      name: docAuthor,
      nik: newComplaint.isAnonim ? "****************" : (newComplaint.nik || "1706************"),
      phone: newComplaint.phone || "0812********",
      category: newComplaint.category,
      title: newComplaint.title,
      content: newComplaint.content,
      location: newComplaint.location || "Wilayah Desa Pondok Panjang",
      date: "10 Juni 2026 (Baru saja)",
      status: "Diterima",
      reply: "Laporan baru saja ditransmisikan ke sistem pamong desa. Tim Sekretariat PPID/Kasi Pemerintahan akan memeriksa validitas visual bukti dan rincian koordinat Anda dalam waktu maksimal 2x24 jam.",
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };

    setComplaints(prev => [submittedObj, ...prev]);
    setNewComplaint({
      name: "",
      nik: "",
      phone: "",
      category: "Infrastruktur",
      title: "",
      content: "",
      location: "",
      isAnonim: false
    });
    setSelectedFile(null);

    addToast(
      `Pengaduan warga sukses terkirim dengan ID Tiket: ${complainId}! Pantau progress tindak lanjut dibawah.`,
      "success",
      "Laporan Terkirim"
    );
  };

  // ================= LAPOR KEPENDUDUKAN =================
  const handleLaporSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let label = "";
    let detailCode = "";
    let dataPayload: any = {};

    if (laporType === "birth") {
      label = "KELAHIRAN BAYI BARU";
      detailCode = `LBR-2026-BIR-${Math.floor(100 + Math.random() * 900)}`;
      dataPayload = birthForm;
      
      // Update local population counter as a joke/feature!
      if (villageData) {
        const currentPop = villageData.stats.population;
        setVillageData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            population: currentPop + 1
          }
        }));
      }
    } else if (laporType === "death") {
      label = "KEMATIAN WARGA";
      detailCode = `LBR-2026-DED-${Math.floor(100 + Math.random() * 900)}`;
      dataPayload = deathForm;
      if (villageData) {
        const currentPop = villageData.stats.population;
        setVillageData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            population: currentPop - 1
          }
        }));
      }
    } else {
      label = "MUTASI DOMISILI";
      detailCode = `LBR-2026-MUT-${Math.floor(100 + Math.random() * 900)}`;
      dataPayload = mutasiForm;
      if (villageData) {
        const currentPop = villageData.stats.population;
        const currentFam = villageData.stats.families;
        const offset = mutasiForm.arahMutasi === "masuk" ? mutasiForm.jumlahKeluarga : -mutasiForm.jumlahKeluarga;
        const offsetFam = mutasiForm.arahMutasi === "masuk" ? 1 : -1;
        setVillageData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            population: currentPop + offset,
            families: currentFam + offsetFam
          }
        }));
      }
    }

    const receipt = {
      code: detailCode,
      type: label,
      time: "10 Juni 2026 - 01:31 UTC",
      data: dataPayload,
      officer: "Kasi Pelayanan Umum Desa (Andrian Saputra)"
    };

    setLastSubmissionSlip(receipt);
    addToast(
      `Laporan data demografi kependudukan bertransaksi sukses dengan No Slip: ${detailCode}! Statistik kependudukan di dashboard ikut terupdate secara real-time.`,
      "success",
      "Laporan Sensus Masuk"
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab select buttons */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-205">
        <button
          onClick={() => setActiveServiceTab("pbb")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeServiceTab === "pbb"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Layanan Pajak PBB Desa
        </button>
        <button
          onClick={() => setActiveServiceTab("pengaduan")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeServiceTab === "pengaduan"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          E-Pengaduan & Kritik Warga
        </button>
        <button
          onClick={() => setActiveServiceTab("lapor")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeServiceTab === "lapor"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          Sensus & Laporan Kependudukan
        </button>
      </div>

      {/* ======================================= TAB 1: PBB ======================================= */}
      {activeServiceTab === "pbb" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query SPPT Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-left">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">CEK SURAT PEMBERITAHUAN PAJAK (SPPT PBB)</h3>
              <form onSubmit={handlePbbSearch} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Objek Pajak (NOP) - 18 Digit</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nopInput}
                      onChange={(e) => setNopInput(e.target.value)}
                      placeholder="e.g. 17.06.040..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono tracking-wider focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-950 text-white p-2 rounded-md hover:shadow cursor-pointer transition flex items-center justify-center"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-405 leading-relaxed">
                  Contoh NOP Default: <strong>17.06.040.012.008-0192.0</strong> (Milik objek sawah H. Sukiman). NOP lain akan di-generate otomatis oleh logik server.
                </p>
              </form>
            </div>

            {/* Tax Estimator / Calculator */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-left space-y-3">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">INTERAKTIF KALKULATOR ESTIMASI PBB-P2</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Luas Bumi (Tanah/Sawah)</span>
                    <strong className="text-slate-800 font-mono">{calcBumi} m²</strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="50"
                    value={calcBumi}
                    onChange={(e) => setCalcBumi(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-ew-resize"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Luas Bangunan (Tapak Rumah)</span>
                    <strong className="text-slate-800 font-mono">{calcBangunan} m²</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={calcBangunan}
                    onChange={(e) => setCalcBangunan(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-ew-resize"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">NJOP Bumi / m²</label>
                    <input
                      type="number"
                      value={customNjopBumi}
                      onChange={(e) => setCustomNjopBumi(Number(e.target.value))}
                      className="w-full p-1 border rounded bg-slate-55"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">NJOP Bangunan / m²</label>
                    <input
                      type="number"
                      value={customNjopBangunan}
                      onChange={(e) => setCustomNjopBangunan(Number(e.target.value))}
                      className="w-full p-1 border rounded bg-slate-55"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs text-slate-700 font-sans space-y-1">
                  <div className="flex justify-between">
                    <span>NJOP Bumi ({calcBumi} * Rp {customNjopBumi.toLocaleString()}):</span>
                    <span className="font-mono font-semibold">Rp {estNjopBumi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-1 borders-b border-dashed">
                    <span>NJOP Bangunan ({calcBangunan} * Rp {customNjopBangunan.toLocaleString()}):</span>
                    <span className="font-mono font-semibold">Rp {estNjopBangunan.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-slate-800">
                    <span>Total NJOP:</span>
                    <span className="font-mono">Rp {totalNjop.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>NJOPTKP Pengurang (Standard):</span>
                    <span className="font-mono text-red-600">-Rp {njoptkp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11.5px] font-bold text-blue-700 border-t border-slate-200 pt-1.5">
                    <span>Estimasi Pajak Terhutang (0.1% * 20%):</span>
                    <span className="font-mono">Rp {estTarifPbb.toLocaleString()} / th</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Queried Info Cards */}
          <div className="lg:col-span-7">
            {queriedPbb ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left">
                {/* Header card state */}
                <div className={`p-5 text-white flex justify-between items-center ${queriedPbb.statusBayar === "Lunas" || queriedPbb.statusBayar === "Sudah Bayar" ? "bg-emerald-600" : "bg-amber-500"}`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded font-bold leading-none">
                      STATUS PERPAJAKAN SPPT
                    </span>
                    <h4 className="text-base font-bold font-sans mt-1.5">{queriedPbb.namaWp}</h4>
                  </div>
                  <span className="px-3 py-1 font-bold tracking-wide rounded-md text-xs uppercase bg-white text-slate-900 border">
                    {queriedPbb.statusBayar === "Sudah Bayar" || queriedPbb.statusBayar === "Lunas" ? "Lunas Terbayar" : "Belum Lunas"}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Grid details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold font-mono">NOMOR OBJEK PAJAK (NOP)</span>
                      <span className="font-mono text-slate-800 font-bold tracking-wider">{queriedPbb.nop}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold font-mono">TAHUN PAJAK</span>
                      <span className="text-slate-800 font-bold">{queriedPbb.taxYear} / Tagihan Resmi</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block font-bold font-mono">ALAMAT OBJEK KEBUN/BUMI</span>
                      <span className="text-slate-700 font-semibold">{queriedPbb.alamatOp}</span>
                    </div>
                  </div>

                  <hr className="border-slate-150" />

                  {/* Calculations breakdown for accuracy */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] text-slate-400 block font-bold font-mono">RINCIAN STRUKTUR PBB</span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-550">Luas Tanah Sawah ({queriedPbb.luasBumi} m² * Rp {queriedPbb.njopBumi.toLocaleString()})</span>
                      <span className="font-mono text-slate-705">Rp {(queriedPbb.luasBumi * queriedPbb.njopBumi).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-550">Luas Rumah Bangunan ({queriedPbb.luasBangunan} m² * Rp {queriedPbb.njopBangunan.toLocaleString()})</span>
                      <span className="font-mono text-slate-705">Rp {(queriedPbb.luasBangunan * queriedPbb.njopBangunan).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 border rounded-md">
                      <span className="text-slate-900 font-bold uppercase tracking-wide">Pajak Terhutang Bersih</span>
                      <span className="font-mono text-sm font-extrabold text-blue-700">Rp {queriedPbb.pajakTerhutang.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {queriedPbb.statusBayar === "Belum Bayar" ? (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center gap-4">
                      <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide leading-none mb-1">Kode E-Billing Pembayaran Aktif</h4>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="font-mono font-bold text-sm text-slate-800 bg-slate-100 px-2.5 py-0.5 border border-slate-200 rounded">
                            {queriedPbb.billingCode}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-700 mt-1.5 leading-relaxed">
                          Gunakan kode di atas untuk melakukan transfer bayar fiktif melalui Agen Brilink Desa, Kantor Pos Mukomuko, atau simulasi klik bayar dibawah ini.
                        </p>
                      </div>
                      <button
                        onClick={handleSimulatePayment}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg border-emerald-600 hover:shadow cursor-pointer transition"
                      >
                        Simulasikan Lunas
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-800 uppercase">Objek Perpajakan PBB Lunas & Tertib</h4>
                        <p className="text-[10px] text-emerald-600 mt-0.5">
                          Terima kasih atas ketepatan kontribusi Anda menunaikan pajak rutin demi kelengkapan sirkulasi APBDes Pembangunan Desa Pondok Panjang.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-50 border border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-slate-400">
                <Search className="w-8 h-8 text-slate-300 mb-2" />
                <span className="text-xs font-semibold">Masukkan Nomor Objek Pajak (NOP) Anda di kolom kiri untuk melacak tagihan SPPT PBB tahunan</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================= TAB 2: PENGADUAN ======================================= */}
      {activeServiceTab === "pengaduan" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Complaint Form */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">CONTER PENGADUAN DIGITAL WARGA</h3>
              <form onSubmit={handleComplaintSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded-lg border">
                  <input
                    type="checkbox"
                    id="isAnonim"
                    checked={newComplaint.isAnonim}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, isAnonim: e.target.checked }))}
                    className="rounded text-blue-600 accent-blue-600"
                  />
                  <label htmlFor="isAnonim" className="text-[11px] font-bold text-slate-650 cursor-pointer">
                    Aduan Rahasia / Sembunyikan Identitas (Anonim)
                  </label>
                </div>

                {!newComplaint.isAnonim && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Nama Pengapor</label>
                        <input
                          type="text"
                          value={newComplaint.name}
                          onChange={(e) => setNewComplaint(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Suryo"
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">NIK (Verifikasi)</label>
                        <input
                          type="text"
                          value={newComplaint.nik}
                          onChange={(e) => setNewComplaint(prev => ({ ...prev, nik: e.target.value }))}
                          placeholder="1706..."
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-501 uppercase mb-1">No. WhatsApp Aktif (Klarifikasi)</label>
                      <input
                        type="text"
                        value={newComplaint.phone}
                        onChange={(e) => setNewComplaint(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0813..."
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Kategori Masalah</label>
                    <select
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                    >
                      <option value="Infrastruktur">Sipil / Infrastruktur</option>
                      <option value="Ketertiban Umum">Ketertiban / Keamanan</option>
                      <option value="Perangkat Desa">Layanan Perangkat Desa</option>
                      <option value="Bantuan Sosial">Distribusi Bansos / BLT</option>
                      <option value="Lainnya">Kritik / Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Lokasi Kejadian</label>
                    <input
                      type="text"
                      value={newComplaint.location}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Dusun II RT 04"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Subjek / Judul Laporan</label>
                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Lampu PJU Padam Berkelanjutan"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-850 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Deskripsi Narasi Kronologi</label>
                  <textarea
                    value={newComplaint.content}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Tuliskan detail waktu, kronologi kejadian perkara, dan tuntutan solusi warga..."
                    rows={3}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Drag and Drop Image Uploader */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Lampirkan Foto Bukti Lapangan</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-red-500 bg-red-50"
                        : selectedFile
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-slate-250 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className={`w-6 h-6 mx-auto mb-1 ${selectedFile ? "text-emerald-500" : "text-slate-400"}`} />
                    {selectedFile ? (
                      <span className="text-[10px] font-bold text-emerald-700 block truncate">{selectedFile.name} (Tersimpan)</span>
                    ) : (
                      <span className="text-[10px] text-slate-500 block">Drag & drop foto atau <strong className="text-blue-600 underline">klik untuk cari</strong></span>
                    )}
                    <span className="text-[8px] text-slate-400 block mt-0.5">Format: JPG, PNG maks 3MB . Khusus aduan orisinal.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-650 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Pengaduan & Tindak Lanjut Pemda
                </button>
              </form>
            </div>
          </div>

          {/* Complaints list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase text-left">DAFTAR TRACKING TIKET PENGADUAN AKTIF WARGA</h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {complaints.map(c => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left">
                  <div className="bg-slate-50 border-b border-slate-100 p-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-200 border border-slate-300 text-slate-700 text-[9px] font-mono rounded">
                        {c.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{c.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[8.5px] uppercase font-bold tracking-wider rounded border ${
                      c.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                        : c.status === "Tindak Lanjut"
                        ? "bg-blue-50 text-blue-700 border-blue-250 animate-pulse"
                        : c.status === "Verifikasi"
                        ? "bg-amber-50 text-amber-700 border-amber-250"
                        : "bg-purple-50 text-purple-700 border-purple-250"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold font-mono text-slate-300 block uppercase">NAMA: {c.name} &bull; LOKASI: {c.location}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">{c.title}</h4>
                      <p className="text-xs text-slate-550 leading-relaxed mt-1">{c.content}</p>
                    </div>

                    {c.image && (
                      <div className="mt-2.5 max-w-[200px] rounded-lg overflow-hidden border border-slate-200">
                        <img src={c.image} alt="Bukti aduan" className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    {/* Admin Response Box */}
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-xs">
                      <div className="flex items-center gap-1 text-slate-450 font-bold mb-1">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tanggapan Birokrasi & Pamong Desa:</span>
                      </div>
                      <p className="text-slate-600 italic font-medium leading-relaxed font-sans">{c.reply}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================= TAB 3: POPULATION REPORT ======================================= */}
      {activeServiceTab === "lapor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lapor Selection & Form */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3 text-left">PILIH JEBARAN SENSUS KEPENDUDUKAN</h3>
              
              <div className="grid grid-cols-3 gap-1.5 mb-4">
                <button
                  onClick={() => setLaporType("birth")}
                  className={`py-2 text-[10px] font-bold rounded border uppercase ${laporType === "birth" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-550 border-slate-203 hover:bg-slate-50"}`}
                >
                  Kelahiran Balita
                </button>
                <button
                  onClick={() => setLaporType("death")}
                  className={`py-2 text-[10px] font-bold rounded border uppercase ${laporType === "death" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-550 border-slate-203 hover:bg-slate-50"}`}
                >
                  Kematian Warga
                </button>
                <button
                  onClick={() => setLaporType("mutasi")}
                  className={`py-2 text-[10px] font-bold rounded border uppercase ${laporType === "mutasi" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-550 border-slate-203 hover:bg-slate-50"}`}
                >
                  Mutasi Domisili
                </button>
              </div>

              <form onSubmit={handleLaporSubmit} className="space-y-3">
                {laporType === "birth" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap Bayi</label>
                      <input
                        type="text"
                        value={birthForm.namaBayi}
                        onChange={(e) => setBirthForm(prev => ({ ...prev, namaBayi: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border border-slate-205 p-2 rounded text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Nama Ayah Kandung</label>
                        <input
                          type="text"
                          value={birthForm.namaAyah}
                          onChange={(e) => setBirthForm(prev => ({ ...prev, namaAyah: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Nama Ibu Kandung</label>
                        <input
                          type="text"
                          value={birthForm.namaIbu}
                          onChange={(e) => setBirthForm(prev => ({ ...prev, namaIbu: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-850 font-semibold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Tanggal Kelahiran</label>
                        <input
                          type="date"
                          value={birthForm.tanggalLahir}
                          onChange={(e) => setBirthForm(prev => ({ ...prev, tanggalLahir: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Lingkungan Dusun</label>
                        <select
                          value={birthForm.dusun}
                          onChange={(e) => setBirthForm(prev => ({ ...prev, dusun: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded"
                        >
                          <option value="Dusun I">Dusun I (Pertanian)</option>
                          <option value="Dusun II">Dusun II (Sawit Tengah)</option>
                          <option value="Dusun III">Dusun III (Pesisir Parit)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Tempat Persalinan</label>
                      <input
                        type="text"
                        value={birthForm.tempatLahir}
                        onChange={(e) => setBirthForm(prev => ({ ...prev, tempatLahir: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-700"
                      />
                    </div>
                  </>
                )}

                {laporType === "death" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap Almarhum/ah</label>
                      <input
                        type="text"
                        value={deathForm.namaAlmarhum}
                        onChange={(e) => setDeathForm(prev => ({ ...prev, namaAlmarhum: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">NIK Pencocokan Sensus</label>
                      <input
                        type="text"
                        value={deathForm.nik}
                        onChange={(e) => setDeathForm(prev => ({ ...prev, nik: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-mono"
                        maxLength={16}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Tanggal Wafat</label>
                        <input
                          type="date"
                          value={deathForm.tanggalWafat}
                          onChange={(e) => setDeathForm(prev => ({ ...prev, tanggalWafat: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Penyebab Wafat</label>
                        <input
                          type="text"
                          value={deathForm.penyebab}
                          onChange={(e) => setDeathForm(prev => ({ ...prev, penyebab: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Tempat Kejadian Wafat</label>
                      <input
                        type="text"
                        value={deathForm.tempatWafat}
                        onChange={(e) => setDeathForm(prev => ({ ...prev, tempatWafat: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-750"
                      />
                    </div>
                  </>
                )}

                {laporType === "mutasi" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Kepala Rumah Tangga</label>
                      <input
                        type="text"
                        value={mutasiForm.namaKepala}
                        onChange={(e) => setMutasiForm(prev => ({ ...prev, namaKepala: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Arah Mutasi</label>
                        <select
                          value={mutasiForm.arahMutasi}
                          onChange={(e) => setMutasiForm(prev => ({ ...prev, arahMutasi: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded"
                        >
                          <option value="masuk">Mutasi Masuk Desa</option>
                          <option value="keluar">Mutasi Keluar Desa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Negara / Provinsi Asal</label>
                        <input
                          type="text"
                          value={mutasiForm.asalProvinsi}
                          onChange={(e) => setMutasiForm(prev => ({ ...prev, asalProvinsi: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">NIK (16 Digit)</label>
                        <input
                          type="text"
                          value={mutasiForm.nik}
                          onChange={(e) => setMutasiForm(prev => ({ ...prev, nik: e.target.value }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Jumlah Anggota KK</label>
                        <input
                          type="number"
                          value={mutasiForm.jumlahKeluarga}
                          onChange={(e) => setMutasiForm(prev => ({ ...prev, jumlahKeluarga: Number(e.target.value) }))}
                          className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1">Alamat Baru Kedudukan di Desa</label>
                      <input
                        type="text"
                        value={mutasiForm.alamatBaru}
                        onChange={(e) => setMutasiForm(prev => ({ ...prev, alamatBaru: e.target.value }))}
                        className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-700"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded-lg hover:shadow cursor-pointer transition active:scale-98"
                >
                  Sampaikan Laporan Sensus & Mufakat Data
                </button>
              </form>
            </div>
          </div>

          {/* Verification Slip Receipt Column */}
          <div className="lg:col-span-7">
            {lastSubmissionSlip ? (
              <div className="bg-white border border-slate-205 rounded-xl shadow-xs text-left overflow-hidden">
                <div className="bg-slate-900 text-white p-4 font-mono text-[10.5px] flex justify-between items-center">
                  <span>RESIP / SLIP VERIFIKASI SENSUS DESA</span>
                  <span className="text-emerald-400 font-bold">STATUS: DRAF DISIARKAN</span>
                </div>

                <div className="p-6 space-y-4 font-serif">
                  <div className="text-center pb-3 border-b-2 border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800">BUKTI LAPORAN PETUGAS KEPENDUDUKAN</h4>
                    <span className="text-[9px] font-mono text-slate-400">ID Kode Berkas: {lastSubmissionSlip.code}</span>
                  </div>

                  <table className="w-full text-xs border-collapse space-y-1">
                    <tbody>
                      <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500 w-36">Jenis Kejadian Sensus</td><td className="font-sans font-extrabold text-blue-700">{lastSubmissionSlip.type}</td></tr>
                      <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Metrik Perekaman</td><td className="font-mono text-slate-600">{lastSubmissionSlip.time}</td></tr>
                      {laporType === "birth" && (
                        <>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Nama Bayi Lahir</td><td className="font-bold text-slate-800">{lastSubmissionSlip.data.namaBayi}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Ayah / Ibu Kandung</td><td>{lastSubmissionSlip.data.namaAyah} / {lastSubmissionSlip.data.namaIbu}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Dusun Kedudukan</td><td>{lastSubmissionSlip.data.dusun}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Lokal bersalin</td><td>{lastSubmissionSlip.data.tempatLahir}</td></tr>
                        </>
                      )}
                      {laporType === "death" && (
                        <>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Nama Lengkap Jenazah</td><td className="font-bold text-slate-800">{lastSubmissionSlip.data.namaAlmarhum}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Sensus NIK Wafat</td><td className="font-mono text-slate-700">{lastSubmissionSlip.data.nik}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500 font-sans">Sakit/Penyebab</td><td>{lastSubmissionSlip.data.penyebab}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Kejadian Wafat</td><td>{lastSubmissionSlip.data.tempatWafat}</td></tr>
                        </>
                      )}
                      {laporType === "mutasi" && (
                        <>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Kepala Keluarga Mutan</td><td className="font-bold text-slate-800">{lastSubmissionSlip.data.namaKepala}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Hukum Mutasi</td><td className="text-amber-700 font-bold">Mutasi {lastSubmissionSlip.data.arahMutasi === "masuk" ? "MASUK WILAYAH" : "KELUAR WILAYAH"}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Daerah Asal / Mutasi</td><td>{lastSubmissionSlip.data.asalProvinsi}</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Daftar Anggota KK</td><td>{lastSubmissionSlip.data.jumlahKeluarga} Jiwa Baru</td></tr>
                          <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500 font-sans">Alamat Kediaman</td><td className="font-sans font-bold text-slate-700">{lastSubmissionSlip.data.alamatBaru}</td></tr>
                        </>
                      )}
                      <tr className="border-b border-dashed"><td className="py-1.5 font-bold text-slate-500">Petugas Pemvalidasi</td><td className="font-sans text-slate-600 font-semibold">{lastSubmissionSlip.officer}</td></tr>
                    </tbody>
                  </table>

                  <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-150 text-[10.5px] leading-relaxed text-blue-800 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Data Terdistribusi:</strong> Slip sensor digital ini menerangkan berkas kependudukan Anda sudah disimpan sementara dalam SQLite Cache data-store. Sensus fisik tuntas sesudah Anda melakukan penyerahan fotokopi berkas ke sekretariat desa Pondok Panjang.
                    </p>
                  </div>
                  
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="text-xs bg-slate-100 border hover:bg-slate-200 text-slate-700 cursor-pointer font-sans font-bold px-3 py-1.5 rounded-lg"
                    >
                      Cetak Slip Salinan (.pdf/printer)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-50 border border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-slate-405">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <span className="text-xs font-semibold">Hasil submit slip pelaporan data sensor warga (Kelahiran, Kematian, Perpindahan) akan dirender secara rapi disini.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
