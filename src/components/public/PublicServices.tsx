import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Search, QrCode, Camera, AlertCircle, RefreshCw, 
  Sparkles, Upload, Send, Clock, ArrowRight, CheckCircle2, Check
} from "lucide-react";
import { generateQRCodeSVG } from "../../lib/qrHelper";

interface LetterRequest {
  id: string;
  type: "sku" | "sktm" | "skp";
  nama: string;
  nik: string;
  gender: string;
  birthPlaceDate: string;
  pekerjaan: string;
  alamat: string;
  keperluan: string;
  penghasilan?: string;
  additionalInfo?: string;
  dateSubmitted: string;
  status: "Pending" | "Disetujui" | "Ditolak";
  noSurat?: string;
}

interface PublicServicesProps {
  villageData: any;
  addToast: (message: string, type: "success" | "error" | "info" | "warning", title?: string) => void;
  onNavigateToAdminDocs?: () => void;
}

export default function PublicServices({ villageData, addToast, onNavigateToAdminDocs }: PublicServicesProps) {
  const [activeSegment, setActiveSegment] = useState<"verify" | "request">("verify");
  
  // Verification states
  const [searchDocNumber, setSearchDocNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTick, setScannerTick] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Form submission states
  const [requestType, setRequestType] = useState<"sku" | "sktm" | "skp">("sku");
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    gender: "Laki-laki",
    birthPlaceDate: "",
    pekerjaan: "",
    alamat: "",
    keperluan: "",
    additionalInfo: "", // e.g. nama usaha or penghasilan
  });
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state loaded from localStorage
  const [storedRequests, setStoredRequests] = useState<LetterRequest[]>([]);
  const [generatedLetters, setGeneratedLetters] = useState<any[]>([]);

  // Load from localStorage on mount (synced to admin actions)
  useEffect(() => {
    // 1. Citizen Requests
    const reqs = localStorage.getItem("pondokpanjang_public_requests");
    if (reqs) {
      setStoredRequests(JSON.parse(reqs));
    } else {
      // Seed initial requests
      const initialReqs: LetterRequest[] = [
        {
          id: "req-1",
          type: "sku",
          nama: "Budi Santoso",
          nik: "1706041203920005",
          gender: "Laki-laki",
          birthPlaceDate: "Mukomuko, 12 Maret 1992",
          pekerjaan: "Wiraswasta / Petani Sawit",
          alamat: "Dusun II RT 04, Desa Pondok Panjang",
          keperluan: "Pengajuan Kredit Usaha Rakyat (KUR) BRI",
          additionalInfo: "Sinar Jaya Sawit Pratama",
          dateSubmitted: "2026-06-08 14:22",
          status: "Disetujui",
          noSurat: "140/097/DS-PP/VI/2026"
        },
        {
          id: "req-2",
          type: "sktm",
          nama: "Rina Kartika",
          nik: "1706045402940003",
          gender: "Perempuan",
          birthPlaceDate: "Sp-1 Penarik, 04 Februari 1994",
          pekerjaan: "Ibu Rumah Tangga",
          alamat: "Dusun I RT 01, Desa Pondok Panjang",
          keperluan: "Mengurus Beasiswa Prestasi Sekolah Dasar Anak",
          additionalInfo: "Rp 1.100.000 / bulan",
          dateSubmitted: "2026-06-09 10:45",
          status: "Pending"
        }
      ];
      localStorage.setItem("pondokpanjang_public_requests", JSON.stringify(initialReqs));
      setStoredRequests(initialReqs);
    }

    // 2. Electronic signed letters
    const gens = localStorage.getItem("pondokpanjang_signed_letters");
    if (gens) {
      setGeneratedLetters(JSON.parse(gens));
    } else {
      const initialGens = [
        {
          noSurat: "140/097/DS-PP/VI/2026",
          type: "Surat Keterangan Usaha (SKU)",
          nama: "Budi Santoso",
          nik: "1706041203920005",
          kategori: "Kependudukan / Dagang",
          tanggalSelesai: "10 Juni 2026",
          penandatangan: "Heru Purnomo, ST (Kepala Desa)",
          keperluan: "Persyaratan Pengajuan Kredit Usaha Rakyat (KUR) Bank BRI",
          detailExtra: "Usaha: Sinar Jaya Sawit Pratama (Pengulakan Kelapa Sawit)"
        },
        {
          noSurat: "140/032/DS-PP/V/2026",
          type: "Surat Keterangan " + "Tidak Mampu (SKTM)",
          nama: "Siti Fatimah",
          nik: "1706044708720001",
          kategori: "Kesejahteraan Sosial",
          tanggalSelesai: "14 Mei 2026",
          penandatangan: "Heru Purnomo, ST (Kepala Desa)",
          keperluan: "Pendaftaran KIP-Kuliah Jalur Mandiri UNIB",
          detailExtra: "Penghasilan: Rp 950.000 / bulan"
        },
        {
          noSurat: "140/040/DS-PP/V/2026",
          type: "Surat Pengantar Mutasi Kependudukan",
          nama: "Ahmad Dahlan",
          nik: "1706040811900002",
          kategori: "Registrasi Penduduk",
          tanggalSelesai: "25 Mei 2026",
          penandatangan: "Heru Purnomo, ST (Kepala Desa)",
          keperluan: "Pindah Domisili Mengikuti Pekerjaan Baru",
          detailExtra: "Tujuan: RT 03 RW 01 Kec. Gading Cempaka, Bengkulu"
        }
      ];
      localStorage.setItem("pondokpanjang_signed_letters", JSON.stringify(initialGens));
      setGeneratedLetters(initialGens);
    }
  }, []);

  // Poll simulated scanner camera
  useEffect(() => {
    let interval: any;
    if (showScanner) {
      interval = setInterval(() => {
        setScannerTick(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowScanner(false);
            
            // Auto find first letter in DB to check
            const targetDoc = "140/097/DS-PP/VI/2026";
            setSearchDocNumber(targetDoc);
            handleVerify(targetDoc);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [showScanner]);

  const handleVerify = (targetNum?: string) => {
    const codeToSearch = targetNum || searchDocNumber.trim();
    if (!codeToSearch) {
      addToast("Harap masukkan nomor agenda/kode surat untuk mencari.", "warning", "Input Kosong");
      return;
    }

    setIsSearching(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const updatedGens = JSON.parse(localStorage.getItem("pondokpanjang_signed_letters") || "[]");
      const match = updatedGens.find(
        (doc: any) => doc.noSurat.toLowerCase() === codeToSearch.toLowerCase()
      );

      if (match) {
        setVerificationResult({
          valid: true,
          ...match
        });
        addToast("Dokumen BERHASIL divalidasi sebagai dokumen resmi asli!", "success", "Verifikasi Berhasil");
      } else {
        setVerificationResult({
          valid: false,
          noSurat: codeToSearch
        });
        addToast("Sistem tidak dapat menemukan berkas dengan nomor tersebut.", "error", "Dokumen Tidak Ditemukan");
      }
    }, 850);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
      addToast(`Berkas pendukung ${e.target.files[0].name} berhasil diletakkan sebagai lampiran.`, "success", "Lampiran Diunggah");
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachmentName(e.dataTransfer.files[0].name);
      addToast(`Berkas pendukung ${e.dataTransfer.files[0].name} sukses di-drop sebagai lampiran!`, "success", "Lampiran Diunggah");
    }
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik || !formData.keperluan) {
      addToast("Mohon lengkapi seluruh isian bertanda bintang wajib.", "warning", "Isian Tidak Lengkap");
      return;
    }

    if (formData.nik.length !== 16) {
      addToast("Nomor Induk Kependudukan (NIK) wajib 16 digit angka.", "warning", "NIK Salah");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReq: LetterRequest = {
        id: `req-${Date.now()}`,
        type: requestType,
        nama: formData.nama,
        nik: formData.nik,
        gender: formData.gender,
        birthPlaceDate: formData.birthPlaceDate || "Mukomuko, " + new Date().toLocaleDateString("id-ID"),
        pekerjaan: formData.pekerjaan || "Petani Sawit / Pekebun",
        alamat: formData.alamat || "Desa Pondok Panjang, Kec. Teramang Jaya",
        keperluan: formData.keperluan,
        additionalInfo: formData.additionalInfo || (requestType === "sku" ? "Usaha Mandiri Sawit" : "Rp 1.000.000"),
        dateSubmitted: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "Pending"
      };

      const updated = [newReq, ...storedRequests];
      localStorage.setItem("pondokpanjang_public_requests", JSON.stringify(updated));
      setStoredRequests(updated);

      setIsSubmitting(false);
      setFormData({
        nama: "",
        nik: "",
        gender: "Laki-laki",
        birthPlaceDate: "",
        pekerjaan: "",
        alamat: "",
        keperluan: "",
        additionalInfo: ""
      });
      setAttachmentName(null);
      addToast(
        "Pengajuan mandiri dokumen desa terkirim! Silakan pantau status di tabel riwayat di samping.",
        "success",
        "Pengajuan Sukses"
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans">
      
      {/* 1. LAYANAN MANDIRI SUB-NAVBAR */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-2xs gap-2">
        <button
          onClick={() => setActiveSegment("verify")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSegment === "verify"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <QrCode className="w-4 h-4" />
          Validasi Keabsahan TTE & Dokumen Cetak
        </button>
        <button
          onClick={() => setActiveSegment("request")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSegment === "request"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Send className="w-4 h-4" />
          Isi Pengajuan Surat Mandiri Warga
        </button>
      </div>

      {/* ================= TAB 1: VALIDASI TTE ================= */}
      {activeSegment === "verify" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
          
          {/* Query section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-750 font-mono uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                <Search className="w-4 h-4 text-emerald-650" />
                Masukan Nomor Kode Agenda Dokumen
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Verifikasi kecocokan tanda tangan digital (TTE) kades pada lembar fisik draf dengan database resmi kependudukan desa.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: 140/097/DS-PP/VI/2026"
                    value={searchDocNumber}
                    onChange={(e) => setSearchDocNumber(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-3 pr-14 py-2.5 font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                  <button
                    onClick={() => handleVerify()}
                    disabled={isSearching}
                    className="absolute right-1 top-1 text-[10.5px] bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-md font-bold transition cursor-pointer shrink-0"
                  >
                    {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verifikasi"}
                  </button>
                </div>

                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3.5 text-[9.5px] text-slate-400 font-bold uppercase font-mono">Atau Deteksi</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition select-none shadow-sm"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  Pindai QR Kode Surat (Simulasi Kamera)
                </button>
              </div>
            </div>

            {/* Seed letters index */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
              <h5 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono mb-2">
                Draf Berkas Contoh (Ber-TTE):
              </h5>
              <div className="space-y-2">
                {generatedLetters.slice(0, 3).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchDocNumber(item.noSurat);
                      handleVerify(item.noSurat);
                    }}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-md p-2 text-left transition flex items-center justify-between text-[11px] font-medium text-slate-705"
                  >
                    <div>
                      <p className="font-extrabold text-slate-800 truncate leading-tight">{item.type}</p>
                      <p className="text-[10px] font-mono text-slate-450 mt-0.5">{item.noSurat}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold tracking-wide uppercase text-[9.5px] font-mono shrink-0">
                      <span>Uji</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Verification response board */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[300px]">
            {showScanner ? (
              <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-100 min-h-[320px] relative overflow-hidden">
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

                <div 
                  className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10 transition-all duration-100"
                  style={{ top: `${scannerTick}%` }}
                />

                <div className="bg-slate-800 p-4 rounded-xl animate-pulse flex items-center justify-center my-3 border border-slate-700">
                  <QrCode className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-emerald-300 font-mono tracking-wider">MENGAKTIFKAN SIMULATOR SCANNER KAMERA...</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                  Kamera memindai draf kertas digital Pondok Panjang untuk mendeteksi token kearsipan.
                </p>
                <div className="w-44 bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
                  <div className="bg-emerald-400 h-full transition-all duration-100" style={{ width: `${scannerTick}%` }} />
                </div>
                
                <button 
                  onClick={() => setShowScanner(false)} 
                  className="mt-6 text-[10px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : verificationResult ? (
              verificationResult.valid ? (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 sm:p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          VALID & ASLI
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded border border-emerald-200/50">
                          ✓ Terkunci Digital Kades
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1.5">Spesifikasi Metadata Sertifikat Hukum TTE</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">{verificationResult.noSurat}</p>
                    </div>
                  </div>

                  <div className="border-t border-emerald-200/60 my-2 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Format Dokumen</span>
                        <strong className="text-slate-800">{verificationResult.type}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Nama Warga Penerima</span>
                        <strong className="text-slate-800">{verificationResult.nama} ({verificationResult.nik})</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Pejabat Tersertifikasi</span>
                        <strong className="text-slate-800">{verificationResult.penandatangan}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Kategori Urusan</span>
                        <span className="text-slate-800 font-medium">{verificationResult.kategori}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Sifat Keperluan</span>
                        <p className="text-slate-650 italic border-l-2 border-emerald-400/50 pl-2 mt-0.5">{verificationResult.keperluan}</p>
                      </div>
                      {verificationResult.detailExtra && (
                        <div className="sm:col-span-2">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold font-mono">Keterangan Khusus Pendukung</span>
                          <p className="text-slate-700 font-extrabold">{verificationResult.detailExtra}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-150 rounded-lg p-3 flex flex-col md:flex-row items-center gap-4">
                    <div 
                      className="shrink-0 bg-slate-50 p-1 rounded-md border border-slate-100"
                      dangerouslySetInnerHTML={{ 
                        __html: generateQRCodeSVG(`https://pondokpanjang.id/verify/${verificationResult.noSurat.replace(/\//g, "-")}`, 72, "check") 
                      }}
                    />
                    <div>
                      <p className="text-[11px] font-bold text-slate-805 leading-snug">Metode Deteksi Segel Kriptografi SHS-256</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                        QR mengikat dokumen dari manipulasi data pasca-unduh secara hukum berlandaskan UU ITE No. 11 Tahun 2008 Pasal 11.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-900 uppercase">Verifikasi Gagal / Tidak Ditemukan</h4>
                    <p className="text-xs text-red-700 mt-1 max-w-sm mx-auto leading-relaxed">
                      Sistem tidak mendeteksi entri bertanda tangan digital kades dengan nomor registrasi <b>"{verificationResult.noSurat}"</b>. Periksa kembali penulisan garis miring.
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 max-w-xs mx-auto">
                    Hubungi sekretariat kantor desa Pondok Panjang apabila merasa mendapatkan draf fisik non-resmi dari aparatur yang tidak berwenang.
                  </div>
                </div>
              )
            ) : (
              <div className="border border-dashed border-slate-350 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 min-h-[320px] bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">Menunggu Pemindaian</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-normal">
                  Ketik kode nomor agenda surat keluar di kolom sebelah kiri, atau pilih salah satu tombol uji cepat draf surat siap saji untuk memverifikasi.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 2: PENGAJUAN MANDIRI ================= */}
      {activeSegment === "request" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form input sections */}
          <form onSubmit={submitRequest} className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-805 font-mono tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Sertifikasi Pengisian Data Mandiri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">PILIH FORMAT SURAT *</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="sku">Surat Keterangan Usaha (SKU)</option>
                  <option value="sktm">Surat Keterangan Tidak Mampu (SKTM)</option>
                  <option value="skp">Surat Pengantar Mutasi / KTP</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">NOMOR NIK PEMOHON (16 DIGIT) *</label>
                <input
                  type="text"
                  name="nik"
                  required
                  placeholder="e.g. 1706041203920005"
                  maxLength={16}
                  value={formData.nik}
                  onChange={handleFormChange}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-slate-750 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">NAMA LENGKAP SECARA KTP *</label>
                <input
                  type="text"
                  name="nama"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">JENIS KELAMIN *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-805 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">TEMPAT, TANGGAL LAHIR PEMOHON *</label>
                <input
                  type="text"
                  name="birthPlaceDate"
                  required
                  placeholder="e.g. Mukomuko, 12 Maret 1992"
                  value={formData.birthPlaceDate}
                  onChange={handleFormChange}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">PEKERJAAN UTAMA *</label>
                <input
                  type="text"
                  name="pekerjaan"
                  required
                  placeholder="e.g. Wiraswasta / Pekebun Sawit"
                  value={formData.pekerjaan}
                  onChange={handleFormChange}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">ALAMAT DOMISILI (RT/RW/DUSUN) *</label>
              <input
                type="text"
                name="alamat"
                required
                placeholder="e.g. Dusun II RT 04, Desa Pondok Panjang"
                value={formData.alamat}
                onChange={handleFormChange}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* SKU sub-form parameters */}
            {requestType === "sku" && (
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2 text-[10px] font-bold text-emerald-800 uppercase tracking-widest font-mono">Spesifikasi Merek Kelompok Usaha</div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Usaha / Merek Dagang *</label>
                  <input
                    type="text"
                    name="additionalInfo"
                    placeholder="e.g. Sinar Jaya Sawit Pratama"
                    value={formData.additionalInfo}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Bank Tujuan / Alasan (e.g. BRI)*</label>
                  <input
                    type="text"
                    name="keperluan"
                    placeholder="e.g. Syarat Pengajuan Kredit Modal KUR Bank BRI"
                    value={formData.keperluan}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg p-2"
                  />
                </div>
              </div>
            )}

            {/* SKTM sub-form parameters */}
            {requestType === "sktm" && (
              <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2 text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono">Data Penghasilan Warga Kurang Mampu</div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Beban Estimasi Gaji Pokok Bulanan *</label>
                  <input
                    type="text"
                    name="additionalInfo"
                    placeholder="e.g. Rp 1.100.000 / bulan"
                    value={formData.additionalInfo}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-amber-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Pengurusan Keperluan Layanan (e.g. Beasiswa) *</label>
                  <input
                    type="text"
                    name="keperluan"
                    placeholder="e.g. Syarat Pendaftaran Beasiswa Berprestasi Sekolah Dasar"
                    value={formData.keperluan}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-amber-200 rounded-lg p-2"
                  />
                </div>
              </div>
            )}

            {/* SKP sub-form parameters */}
            {requestType === "skp" && (
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Tujuan Wilayah Mutasi Penduduk</div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Alamat Lengkap Domisili Pindahan *</label>
                  <input
                    type="text"
                    name="additionalInfo"
                    placeholder="e.g. Kelurahan Pintu Batu, Teluk Segara, Bengkulu"
                    value={formData.additionalInfo}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Alasan Pindah Paling Tepat *</label>
                  <input
                    type="text"
                    name="keperluan"
                    placeholder="e.g. Pindah Mengikuti Rujukan Pekerjaan Kepala Keluarga"
                    value={formData.keperluan}
                    onChange={handleFormChange}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            )}

            {/* File dragger uploader */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 rounded-xl p-4 text-center cursor-pointer transition relative hover:bg-white"
            >
              <input
                type="file"
                id="attachment-file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center p-2">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700 leading-snug">
                  {attachmentName ? `✓ Scan Lampiran Siap: ${attachmentName}` : "Unggah Kartu Keluarga / KTP (Scan Kependudukan)"}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Format yang didukung: JPG, PNG, PDF berkelompok. Ukuran maks: 8MB.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 select-none"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Lembar Pengajuan ke Sekretariat (Admin Persuratan)
                </>
              )}
            </button>
          </form>

          {/* Right tracking column of localRequests */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold font-mono tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Pelacakan Berkas Pengajuan Mandiri Anda
                </h4>
                <span className="bg-slate-800 text-emerald-300 text-[8.5px] font-mono px-2 py-0.5 rounded uppercase">Tersinkron</span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {storedRequests.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-10 font-medium">Anda belum mengirimkan lembar formulir pengajuan.</p>
                ) : (
                  storedRequests.map((req) => (
                    <div key={req.id} className="bg-slate-850 border border-slate-750 hover:border-slate-700 p-3.5 rounded-xl transition text-left space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9.5px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase">
                          {req.type.toUpperCase()} Form
                        </span>
                        <span className={`text-[9.5px] font-extrabold font-mono px-2 py-0.5 rounded ${
                          req.status === "Disetujui" 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20" 
                            : req.status === "Ditolak"
                            ? "bg-red-500/20 text-red-300 border border-red-500/20"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/20 animate-pulse"
                        }`}>
                          ● {req.status}
                        </span>
                      </div>

                      <div className="leading-tight">
                        <strong className="text-slate-100 text-xs block">{req.nama}</strong>
                        <span className="text-[10px] text-slate-450 font-mono">NIK: {req.nik}</span>
                      </div>

                      <p className="text-[10px] text-slate-350 leading-normal">
                        <strong>Keperluan:</strong> {req.keperluan}
                      </p>

                      {req.status === "Disetujui" && req.noSurat && (
                        <div className="mt-2.5 bg-slate-900 border border-emerald-400/20 p-2 rounded-lg flex items-center justify-between text-[10px]">
                          <div className="leading-none">
                            <span className="text-emerald-400 font-extrabold block">✓ Dokumen Kearsipan Terbit</span>
                            <span className="font-mono text-[9px] text-slate-450 mt-0.5 inline-block">{req.noSurat}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSegment("verify");
                              setSearchDocNumber(req.noSurat || "");
                              handleVerify(req.noSurat);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded text-[9.5px] transition cursor-pointer shrink-0"
                          >
                            Detail TTE
                          </button>
                        </div>
                      )}

                      <div className="text-[9px] text-slate-500 flex justify-between pt-1.5 border-t border-slate-800 font-mono">
                        <span>Database Terdistribusi</span>
                        <span>{req.dateSubmitted}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                <p className="flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Berkas pengajuan berstatus <b>Mandiri</b> tersambung ke panel administrator emulator WinForms. Anda dapat bertindak sebagai admin persuratan desa, menyepakati permohonan tersebut secara elektronik, lalu menguji kearsipan TTE-nya di sirkuler verifikasi di menu atas.
                  </span>
                </p>
              </div>
            </div>

            {onNavigateToAdminDocs && (
              <button
                type="button"
                onClick={onNavigateToAdminDocs}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer select-none"
              >
                Alihkan ke Panel Simulasi Admin Desa ➜
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
