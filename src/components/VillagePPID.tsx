import React, { useState } from "react";
import { FileText, Search, PlusCircle, Check, Send, AlertCircle, Calendar, User, Eye, Download, Star } from "lucide-react";

interface VillagePPIDProps {
  villageData: any;
  setVillageData: React.Dispatch<React.SetStateAction<any>>;
  addToast: (message: string, type: "success" | "error" | "info", title?: string) => void;
}

interface PublicDoc {
  id: string;
  title: string;
  category: "Pembangunan" | "Keuangan" | "Aset" | "Pemerintahan";
  year: string;
  fileSize: string;
  downloads: number;
}

interface JdihLaw {
  id: string;
  number: string;
  year: string;
  title: string;
  type: "Perdes" | "Perkades";
  dateApproved: string;
  status: "Berlaku" | "Direvisi";
}

interface InfoRequest {
  id: string;
  name: string;
  nik: string;
  organization: string;
  infoNeeded: string;
  purpose: string;
  date: string;
  status: "Verifikasi" | "Disetujui" | "Ditolak";
  documentGranted?: string;
}

export default function VillagePPID({ villageData, setVillageData, addToast }: VillagePPIDProps) {
  const [activeTab, setActiveTab] = useState<"ppid" | "jdih" | "berita">("ppid");

  // ================= PPID STATES =================
  const [ppidDocs] = useState<PublicDoc[]>([
    { id: "PPID-01", title: "Rencana Kerja Pemerintah Desa (RKPDes) Pondok Panjang Tahun Anggaran 2026", category: "Pembangunan", year: "2026", fileSize: "4.8 MB", downloads: 142 },
    { id: "PPID-02", title: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) Periode 2021 - 2027", category: "Pembangunan", year: "2021", fileSize: "12.4 MB", downloads: 285 },
    { id: "PPID-03", title: "Laporan Realisasi APBDes Akhir Tahun Semester II Tahun Anggaran 2025", category: "Keuangan", year: "2025", fileSize: "3.2 MB", downloads: 98 },
    { id: "PPID-04", title: "Daftar Inventaris Aset Kekayaan Tetap Milik Desa Pondok Panjang", category: "Aset", year: "2026", fileSize: "1.5 MB", downloads: 54 },
    { id: "PPID-05", title: "Laporan Kinerja Penyelenggaraan Pemerintahan Desa (LPPD) Akhir Tahun Kakankemenag", category: "Pemerintahan", year: "2025", fileSize: "5.1 MB", downloads: 82 }
  ]);

  const [ppidSearch, setPpidSearch] = useState("");
  const [infoRequests, setInfoRequests] = useState<InfoRequest[]>([
    {
      id: "REQ-2026-004",
      name: "Prabowo Raharjo, M.Si",
      nik: "1706041208940003",
      organization: "Fakultas FISIP Universitas Bengkulu",
      infoNeeded: "Rincian pengeluaran dana desa khusus program kebun sawit ketahanan pangan 2024-2025",
      purpose: "Riset kajian tesis akademis terkait efektivitas realokasi dana desa sektor agribisnis",
      date: "09 Juni 2026",
      status: "Disetujui",
      documentGranted: "REKAP_BLT_SAWIT_2025.pdf"
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    name: "",
    nik: "",
    organization: "",
    infoNeeded: "",
    purpose: ""
  });

  // ================= JDIH STATES =================
  const [jdihLaws] = useState<JdihLaw[]>([
    { id: "JDIH-01", number: "01", year: "2026", type: "Perdes", title: "Penertiban Retribusi Kebersihan Lingkungan Serta Larangan Membuang Sampah Liar", dateApproved: "15 Januari 2026", status: "Berlaku" },
    { id: "JDIH-02", number: "03", year: "2025", type: "Perdes", title: "Penetapan Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran 2026", dateApproved: "22 Desember 2025", status: "Berlaku" },
    { id: "JDIH-03", number: "02", year: "2026", type: "Perkades", title: "Penerima Manfaat Bantuan Langsung Tunai (BLT) Dana Desa (DD) Alokasi Kemiskinan Ekstrem", dateApproved: "10 Februari 2026", status: "Berlaku" },
    { id: "JDIH-04", number: "05", year: "2024", type: "Perdes", title: "Pelestarian Hutan Kemasyarakatan, Perlindungan Sumber Air Teramang & Batasan Tailing Kebun Sawit", dateApproved: "18 Agustus 2024", status: "Berlaku" },
    { id: "JDIH-05", number: "02", year: "2524", type: "Perkades", title: "Besaran Tarif Restitusi Sewa Mobil Ambulans Milik Desa Khusus Rawat Rujukan Luar Kabupaten", dateApproved: "04 Maret 2024", status: "Berlaku" }
  ]);

  const [jdihSearch, setJdihSearch] = useState("");
  const [jdihFilterType, setJdihFilterType] = useState<"Semua" | "Perdes" | "Perkades">("Semua");

  // ================= BUAT BERITA STATES =================
  const [newsForm, setNewsForm] = useState({
    title: "Panen Raya Kebun Jagung Ketahanan Pangan Dusun III",
    author: "Kaur Umum Desa",
    time: "09:00 s.d 11:30 WIB",
    location: "Sawah Sentra Tani Blok B Dusun III",
    content: "Pemerintah Desa Pondok Panjang bersama seluruh jajaran pengurus Kelompok Tani dan TP-PKK resmi menyelenggarakan kegiatan syukuran Panen Raya Kebun Tanaman Pangan Jagung. Hasil panen diperkirakan mencapai 3.2 ton serta akan dibagikan langsung secara merata per kepala keluarga sebagai penunjang stimulus kebutuhan karbohidrat dan ketahanan pangan nabati desa di wilayah Teramang Jaya."
  });

  // ================= PPID LOGIC =================
  const handlePpidRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.name || !newRequest.infoNeeded || !newRequest.purpose) {
      addToast("Mohon isi nama lengkap Anda, deskripsi dokumen, serta tujuan pemakaian informasi.", "error", "Form Belum Lengkap");
      return;
    }

    const reqId = `REQ-2026-` + String(infoRequests.length + 5).padStart(3, "0");
    const submittedObj: InfoRequest = {
      id: reqId,
      name: newRequest.name,
      nik: newRequest.nik || "1706***********",
      organization: newRequest.organization || "Pribadi / Perseorangan Warga",
      infoNeeded: newRequest.infoNeeded,
      purpose: newRequest.purpose,
      date: "10 Juni 2026 (Baru saja)",
      status: "Verifikasi"
    };

    setInfoRequests(prev => [submittedObj, ...prev]);
    setNewRequest({
      name: "",
      nik: "",
      organization: "",
      infoNeeded: "",
      purpose: ""
    });

    addToast(
      `Permohonan Keterbukaan Informasi berhasil tersimpan dengan Kode Pelacakan: ${reqId}. Tim PPID akan meninjau.`,
      "success",
      "Permohonan PPID Terikirim"
    );
  };

  const filteredPpid = ppidDocs.filter(doc =>
    doc.title.toLowerCase().includes(ppidSearch.toLowerCase()) ||
    doc.category.toLowerCase().includes(ppidSearch.toLowerCase())
  );

  // ================= JDIH LOGIC =================
  const filteredJdih = jdihLaws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(jdihSearch.toLowerCase()) ||
                          law.number.includes(jdihSearch) ||
                          law.year.includes(jdihSearch);
    const matchesFilter = jdihFilterType === "Semua" ? true : law.type === jdihFilterType;
    return matchesSearch && matchesFilter;
  });

  // ================= BUAT BERITA LOGIC =================
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      addToast("Isi judul berita serta konten berita pokok.", "error", "Gagal Mengunggah");
      return;
    }

    // Append to announcements in villageData!
    const newAnnId = `ANN-` + String(Math.floor(100 + Math.random() * 900));
    
    // Indonesia Date Formatter
    const todayStr = "10 Juni 2026";

    const newlyCreatedAnn = {
      id: newAnnId,
      title: newsForm.title,
      date: todayStr,
      time: newsForm.time || "Sesuai rincian",
      location: newsForm.location || "Balai Pertemuan",
      content: newsForm.content,
      author: newsForm.author || "Kepala Urusan Tata Usaha"
    };

    if (villageData && setVillageData) {
      // Push new news to the announcements array
      setVillageData((prev: any) => {
        const updatedAnnouncements = [newlyCreatedAnn, ...prev.announcements];
        return {
          ...prev,
          announcements: updatedAnnouncements
        };
      });

      addToast(
        `Siaran Berita Adat & Pengumuman Desa berhasil diunggah secara publik! Cek tab "Satu Pandang Desa" untuk melihat tampilan live artikel Anda!`,
        "success",
        "Berita Desa Disiarkan"
      );

      // Reset Form with default values for next use
      setNewsForm({
        title: "",
        author: "Pemerintah Desa",
        time: "",
        location: "",
        content: ""
      });
    } else {
      addToast("Sistem root state desa sedang dibaca ulang. Coba kembali.", "error", "State Error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Category header choices */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-205">
        <button
          onClick={() => setActiveTab("ppid")}
          className={`flex-1 py-1.5 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "ppid"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          Keterbukaan Informasi (PPID)
        </button>
        <button
          onClick={() => setActiveTab("jdih")}
          className={`flex-1 py-1.5 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "jdih"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-850"
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Dokumentasi Hukum (JDIH)
        </button>
        <button
          onClick={() => setActiveTab("berita")}
          className={`flex-1 py-1.5 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "berita"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-505 hover:text-slate-800"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Buat Siaran Berita & Acara
        </button>
      </div>

      {/* ======================================= TAB 1: PPID BOARD ======================================= */}
      {activeTab === "ppid" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query PPID Docs List */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="bg-white border rounded-xl p-4 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">DAFTAR ARSIP DOKUMEN PUBLIK TRANSPARAN (PPID)</h3>
                <div className="flex items-center bg-slate-50 border rounded px-2.5 py-1 w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    placeholder="Cari RKP, LPPD..."
                    value={ppidSearch}
                    onChange={(e) => setPpidSearch(e.target.value)}
                    className="bg-transparent border-none text-[10.5px] font-medium text-slate-700 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredPpid.length > 0 ? (
                  filteredPpid.map(doc => (
                    <div key={doc.id} className="p-3 border rounded-lg hover:border-blue-400 hover:bg-blue-50/10 flex justify-between items-center gap-4 transition">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-slate-100 rounded text-slate-600 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase font-bold text-blue-600 tracking-wider font-mono">
                            Kategori: {doc.category} &bull; TA {doc.year}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 leading-snug">{doc.title}</h4>
                          <p className="text-[9.5px] text-slate-450 mt-0.5">Ukuran: {doc.fileSize} | Jumlah Unduh: {doc.downloads} kali</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          addToast(`Unduhan file draf ${doc.id} (.pdf) disimulasi sukses ke komputer Anda!`, "success", "Unduhan PPID Berhasil");
                        }}
                        className="p-1 px-2.5 bg-slate-900 border text-white hover:bg-slate-950 font-bold text-[9px] rounded uppercase cursor-pointer select-none transition shrink-0"
                      >
                        Unduh
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-400 py-6">Korepondensi berkas PPID tidak ditemukan.</p>
                )}
              </div>
            </div>
          </div>

          {/* Request Information Form */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="bg-white border rounded-xl p-4 shadow-xs">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">FORM PERMOHONAN INFORMASI HUKUM PUBLIK</h3>
              <form onSubmit={handlePpidRequestSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pemohon</label>
                    <input
                      type="text"
                      value={newRequest.name}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Dr. Handoko"
                      className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NIK (Verifikasi Sipil)</label>
                    <input
                      type="text"
                      value={newRequest.nik}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, nik: e.target.value }))}
                      placeholder="1706..."
                      className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-805 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Organisasi / Lembaga (Jika Ada)</label>
                  <input
                    type="text"
                    value={newRequest.organization}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g. Media Bengkulu Post / Universitas UNIB"
                    className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rincian Informasi / Data yang Dibutuhkan</label>
                  <textarea
                    value={newRequest.infoNeeded}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, infoNeeded: e.target.value }))}
                    placeholder="Contoh: Rincian SPJ Pos Belanja Karang Taruna dan Dana Stunting RKPDes 2025..."
                    rows={2.5}
                    className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tujuan Penggunaan Informasi</label>
                  <textarea
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g. Kebutuhan transparansi publik pers harian atau data penelitian skripsi..."
                    rows={2.5}
                    className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Pengajuan PPID Resmi
                </button>
              </form>
            </div>

            {/* Request Tracking results */}
            <div className="space-y-2 mt-4">
              <h4 className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase text-left">PROSES PERMOHONAN MAHASISWA & WARTAWAN JDIH</h4>
              {infoRequests.map(req => (
                <div key={req.id} className="bg-slate-50 border border-slate-203 rounded-lg p-3 text-[11px] text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-700 font-mono text-[9.5px]">{req.id} ({req.name})</span>
                    <span className={`px-2 py-0.5 text-[8.5px] font-extrabold uppercase rounded ${req.status === "Disetujui" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-550 leading-relaxed font-sans italic">"Tujuan: {req.purpose.substring(0, 75)}..."</p>
                  {req.documentGranted && (
                    <div className="mt-2 text-[10px] bg-emerald-50 p-2 rounded-md border border-emerald-150 text-emerald-800 flex items-center justify-between">
                      <span className="font-mono">Lampir: {req.documentGranted}</span>
                      <button
                        onClick={() => addToast(`Tesis/File ${req.documentGranted} Berhasil disalin!`, "info")}
                        className="text-[9px] underline font-bold"
                      >
                        Buka Dokumen
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================= TAB 2: JDIH REGULATION ARCHIVE ======================================= */}
      {activeTab === "jdih" && (
        <div className="bg-white border text-left p-6 rounded-xl shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-805 flex items-center gap-1">
                ⚖️ PORTAL JARINGAN DOKUMENTASI HUKUM (JDIH) DESA
              </h3>
              <p className="text-xs text-slate-500">Legalitas resmi, Perda, Perdes, dan Keputusan Kades Pondok Panjang yang terindeks kementerian.</p>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center bg-slate-50 border rounded px-2.5 py-1.5 w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Cari kata kunci undang..."
                  value={jdihSearch}
                  onChange={(e) => setJdihSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-705 focus:outline-none w-full"
                />
              </div>

              <select
                value={jdihFilterType}
                onChange={(e) => setJdihFilterType(e.target.value as any)}
                className="text-xs border rounded bg-slate-50 p-1 px-2 focus:outline-none"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="Perdes">Peraturan Desa (Perdes)</option>
                <option value="Perkades">Peraturan Kepala Desa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJdih.map(law => (
              <div key={law.id} className="p-4 border rounded-xl bg-slate-50/50 hover:border-slate-350 transition relative overflow-hidden group">
                <div className="absolute right-2 top-2 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">
                  {law.type}
                </div>

                <span className="text-[9.5px] font-bold text-slate-400 font-mono">No. {law.number} Tahun {law.year}</span>
                <span className="mx-1.5 text-slate-300">|</span>
                <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{law.status}</span>
                
                <h4 className="text-xs font-bold text-slate-805 mt-1.5 leading-snug group-hover:text-blue-700 transition">
                  {law.title}
                </h4>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Mufakat: {law.dateApproved}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToast(`Memuat isi lengkap pasal draf ${law.id}...`, "info")}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Baca Detil
                    </button>
                    <span className="text-slate-300">/</span>
                    <button
                      onClick={() => addToast(`Download salinan hukum JDIH kementerian No. ${law.number} disimulasi!`, "success")}
                      className="text-slate-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-201 text-[10.5px] leading-relaxed text-amber-800 flex items-start gap-2 max-w-2xl">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Status Penyelarasan JDIH:</strong> Seluruh regulasi hukum desa di atas telah diselaraskan dengan Lembaran Daerah Bagian Hukum Sekretariat Daerah (Setda) Kabupaten Mukomuko guna penataan harmonisasi asas hukum perundangan.
            </p>
          </div>
        </div>
      )}

      {/* ======================================= TAB 3: CREATE NEWS / ARTICLES ======================================= */}
      {activeTab === "berita" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Form to submit new news */}
          <div className="lg:col-span-6 bg-white border rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-4">REDAKSI KILAT BERITA & INFORMASI DESA</h3>
            
            <form onSubmit={handleNewsSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Judul Utama Berita / Kegiatan</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Pembelian Alat Hand-Tractor Poktan Tani Makmur"
                  className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-850 font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Nama Jurnalis / Penulis</label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Lokal Koordinat / Lokasi</label>
                  <input
                    type="text"
                    value={newsForm.location}
                    onChange={(e) => setNewsForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Kantor Balai Adat Desa"
                    className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Rincian Waktu Pelaksanaan</label>
                <input
                  type="text"
                  value={newsForm.time}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g. Kamis, 11 Juni 2026 - 13:00 WIB"
                  className="w-full text-xs bg-slate-50 border p-2 rounded text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-555 uppercase mb-1">Pokok Artikel / Naskah Berita Terbuka</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Silahkan deskripsikan berita kegiatan, transparansi APBD, atau peristiwa penting desa..."
                  rows={4}
                  className="w-full text-xs bg-slate-50 border border-slate-205 p-2 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1 active:scale-98"
              >
                <Check className="w-4 h-4 text-emerald-400" /> PUBLIKASIKAN KE HALAMAN UTAMA DESA
              </button>
            </form>
          </div>

          {/* Right Column: News live card viewer inside system */}
          <div className="lg:col-span-6 bg-slate-100 border border-slate-203 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase block mb-3">
                PRATINJAU KARTU DESA YANG DISIARKAN
              </span>

              {newsForm.title ? (
                <div className="bg-white border border-slate-250 rounded-xl overflow-hidden shadow-sm p-5 space-y-3 font-sans">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-b pb-1.5 font-mono">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-600" /> 10 Juni 2026 (Kini)</span>
                    <span className="flex items-center gap-0.5"><User className="w-3.5 h-3.5 text-blue-600" /> {newsForm.author}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-805 leading-snug">
                    {newsForm.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {newsForm.content}
                  </p>

                  <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border space-y-0.5">
                    <p className="text-slate-500 font-bold">Koordinat Pelaksanaan:</p>
                    <p className="text-slate-800 font-medium">📍 {newsForm.location || "Semua Lingkungan Desa"}</p>
                    <p className="text-slate-800 font-mono text-[10px]">⏰ {newsForm.time || "Sepanjang Hari Mufakat"}</p>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed h-48 rounded-xl bg-white flex flex-col items-center justify-center text-slate-400 p-4">
                  <Eye className="w-8 h-8 text-slate-300 mb-1" />
                  <span className="text-xs font-semibold">Tulis judul di kolom kiri untuk melihat simulasi visual penyiaran</span>
                </div>
              )}
            </div>

            <div className="mt-4 bg-blue-50 text-blue-800 text-[10px] leading-relaxed p-3 rounded-lg border border-blue-150">
              💡 <strong>Info Integrasi Pamong:</strong> Begitu tombol siar di klik, berita dan agenda Anda akan masuk ke array utama aplikasi secara instan. Anda dapat melihat dan membacanya di kolom "BERITA & PENGUMUMAN TERBARU" pada tab utama Satu Pandang Desa tanpa harus me-refresh browser!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
