import React, { useState, useEffect } from "react";
import { 
  FileText, Download, User, FileSpreadsheet, Check, RefreshCw, 
  HelpCircle, Upload, X, Trash2, Inbox, CheckSquare, QrCode, AlertCircle 
} from "lucide-react";
import { generateQRCodeSVG } from "../lib/qrHelper";

interface VillageDocumentsProps {
  villageData: any;
  addToast: (message: string, type: "success" | "error" | "info" | "warning", title?: string) => void;
}

interface CustomTemplate {
  id: string;
  category: "surat" | "hukum";
  name: string;
  description: string;
  body: string;
  variables: string[];
}

interface CitizenRequest {
  id: string;
  type: "sku" | "sktm" | "skp";
  nama: string;
  nik: string;
  gender: string;
  birthPlaceDate: string;
  pekerjaan: string;
  alamat: string;
  keperluan: string;
  additionalInfo: string;
  dateSubmitted: string;
  status: "Pending" | "Disetujui" | "Ditolak";
}

export default function VillageDocuments({ villageData, addToast }: VillageDocumentsProps) {
  const [activeCategory, setActiveCategory] = useState<"surat" | "hukum">("surat");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("sku");

  // Dynamic lists from localStorage
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [citizenRequests, setCitizenRequests] = useState<CitizenRequest[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Uploader wizard states
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: "",
    description: "",
    category: "surat" as "surat" | "hukum",
    body: "",
    variablesRaw: "nama, nik, alamat, keperluan, nomor_rekening"
  });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [parsedFileName, setParsedFileName] = useState("");

  // Input states for form fields
  const [formState, setFormState] = useState<any>({
    // General Person Info
    nama: "Budi Santoso",
    nik: "1706041203920005",
    gender: "Laki-laki",
    birthPlaceDate: "Mukomuko, 12 Maret 1992",
    pekerjaan: "Wiraswasta / Petani Sawit",
    alamat: "Dusun II RT 04, Desa Pondok Panjang",
    
    // SKU Specific
    namaUsaha: "Sinar Jaya Sawit Pratama",
    jenisUsaha: "Pengulakan Kelapa Sawit & Palawija",
    sejakKapan: "Januari 2021",
    keperluanSKU: "Persyaratan Pengajuan Kredit Usaha Rakyat (KUR) Bank BRI",

    // SKTM Specific
    keperluanSKTM: "Pendaftaran Beasiswa KIP Kuliah Anak di Universitas Bengkulu",
    penghasilan: "Rp 1.200.000 / bulan",

    // KTP/KK Specific
    alamatAsal: "RT 04, Desa Pondok Panjang, Kec. Teramang Jaya",
    alamatTujuan: "RT 01, Kelurahan Pintu Batu, Kec. Teluk Segara, Kota Bengkulu",
    alasanPindah: "Ikut Suami / Istri & Mendapatkan Pekerjaan Baru",

    // Hukum Specific (Perdes / Perkades / Berita Acara)
    noDokumen: "04/PP/2026",
    tahun: "2026",
    tentang: "Rencana Kerja Pemerintah Desa (RKPDes) Tahun Anggaran 2027",
    menimbang: "Bahwa untuk melaksanakan ketentuan Pasal 3 Ayat (1) Permendagri No. 114 Tahun 2014 tentang Pedoman Pembangunan Desa, perlu disusun perencanaan matang demi mewujudkan tata kelola desa Pondok Panjang yang maju.",
    mengingat: "Undang-Undang Nomor 6 Tahun 2014 tentang Desa; Peraturan Pemerintah Nomor 43 Tahun 2014 tentang Peraturan Pelaksanaan UU Desa;",
    keputusanSatu: "Menetapakan Anggaran Belanja Kegiatan Prioritas Rabat Beton, Drainase Serbaguna, dan Program Ketahanan Pangan Nabati.",
    keputusanDua: "Keputusan ini mulai berlaku sejak tanggal ditetapkan dengan ketentuan apabila terdapat kekeliruan akan diperbaiki di kemudian hari.",
    
    // Berita Acara Specific
    hariTanggal: "Rabu, 10 Juni 2026",
    waktu: "09:00 WIB s.d Selesai",
    tempat: "Balai Mushola / Aula Pertemuan Desa Pondok Panjang",
    agendaAcara: "Musyawarah Perumusan RKPDes & Transparansi Sisa Anggaran",
    jumlahHadir: "45 orang (Unsur Badan Permusyawaratan Desa, LPM, Tokoh Adat, & PKK)",
    kesepakatanAkhir: "Menyepakati realokasi sisa anggaran tak terduga untuk perbaikan darurat jembatan gantung tani yang rusak akibat luapan sungai Teramang.",

    // Pejabat Penandatangan
    namaKades: villageData?.villageMetadata?.head?.name || "Heru Purnomo, ST",
    jabatanKades: villageData?.villageMetadata?.head?.title || "Kepala Desa",
    noSuratKeluar: "140/097/DS-PP/VI/2026",

    // Dynamic field maps for uploaded template variables
    customFields: {} as Record<string, string>
  });

  // Load storage states on mount
  useEffect(() => {
    // Load custom uploaded templates
    const savedTemplates = localStorage.getItem("pondokpanjang_custom_templates");
    if (savedTemplates) {
      setCustomTemplates(JSON.parse(savedTemplates));
    } else {
      // Seed an initial custom template (e.g., Surat Ahli Waris)
      const seedTemplates: CustomTemplate[] = [
        {
          id: "waris",
          category: "surat",
          name: "Surat Keterangan Ahli Waris kustom",
          description: "Templat draf keturunan sah pewaris tanah, kebun sawit & tabungan bank.",
          variables: ["namaPewaris", "tanggalMeninggal", "daftarAhliWaris", "hubunganHubungan"],
          body: `<div style="line-height:1.6; text-align:justify;">
            <p style="text-indent: 40px;">Menerangkan dengan sesungguhnya bahwa Almarhum/Almurhumah <strong>{{namaPewaris}}</strong> telah berpulang ke Rahmatullah pada tanggal <strong>{{tanggalMeninggal}}</strong> di rukun tetangga kami.</p>
            <p style="text-indent: 40px;">Berdasarkan musyawarah rukun keluarga saksi, didapatkan daftar ahli waris biologis sah dari almarhum sebagai berikut:</p>
            <div style="background-color:#f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px; margin: 10px 20px;">
              <strong>Ahli Waris Utama:</strong> {{daftarAhliWaris}}<br/>
              <strong>Status Kekeluargaan:</strong> {{hubunganHubungan}}
            </div>
            <p style="text-indent: 40px;">Segala bentuk pengurusan peralihan hak milik tanah kapling maupun tabungan bank bengkulu dikoordinasikan secara mufakat oleh daftar nama di atas.</p>
          </div>`
        }
      ];
      localStorage.setItem("pondokpanjang_custom_templates", JSON.stringify(seedTemplates));
      setCustomTemplates(seedTemplates);
    }

    // Load citizen requests
    const savedReqs = localStorage.getItem("pondokpanjang_public_requests");
    if (savedReqs) {
      setCitizenRequests(JSON.parse(savedReqs));
    }
  }, []);

  // Poll changes in localStorage every 3 seconds to feel completely alive
  useEffect(() => {
    const handleStorageSync = () => {
      const savedReqs = localStorage.getItem("pondokpanjang_public_requests");
      if (savedReqs) {
        setCitizenRequests(JSON.parse(savedReqs));
      }
    };
    const interval = setInterval(handleStorageSync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("custom_")) {
      const fieldVar = name.replace("custom_", "");
      setFormState((prev: any) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldVar]: value
        }
      }));
    } else {
      setFormState((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleResetForm = () => {
    setFormState((prev: any) => ({
      ...prev,
      nama: "Budi Santoso",
      nik: "1706041203920005",
      gender: "Laki-laki",
      birthPlaceDate: "Mukomuko, 12 Maret 1992",
      pekerjaan: "Wiraswasta / Petani Sawit",
      alamat: "Dusun II RT 04, Desa Pondok Panjang",
      namaUsaha: "Sinar Jaya Sawit Pratama",
      jenisUsaha: "Pengulakan Kelapa Sawit & Palawija",
      sejakKapan: "Januari 2021",
      keperluanSKU: "Persyaratan Pengajuan Kredit Usaha Rakyat (KUR) Bank BRI",
      keperluanSKTM: "Pendaftaran Beasiswa KIP Kuliah Anak di Universitas Bengkulu",
      penghasilan: "Rp 1.200.000 / bulan",
      alamatAsal: "RT 04, Desa Pondok Panjang, Kec. Teramang Jaya",
      alamatTujuan: "RT 01, Kelurahan Pintu Batu, Kec. Teluk Segara, Kota Bengkulu",
      alasanPindah: "Ikut Suami / Istri & Mendapatkan Pekerjaan Baru",
      noDokumen: "04/PP/2026",
      tentang: "Rencana Kerja Pemerintah Desa (RKPDes) Tahun Anggaran 2027",
      hariTanggal: "Rabu, 10 Juni 2026",
      agendaAcara: "Musyawarah Perumusan RKPDes & Transparansi Sisa Anggaran",
      kesepakatanAkhir: "Menyepakati realokasi sisa anggaran tak terduga untuk perbaikan darurat jembatan gantung tani yang rusak akibat luapan sungai Teramang.",
      customFields: {}
    }));
    addToast("Data formulir berhasil direset ke setelan awal.", "info", "Formulir Direset");
  };

  // HTML templates for output to Word (supports formatting)
  const generateWordDocument = () => {
    const kopSuratHTML = `
      <div style="text-align: center; font-family: 'Times New Roman', Times, serif; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KABUPATEN MUKOMUKO</h3>
        <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">KECAMATAN TERAMANG JAYA</h3>
        <h2 style="margin: 2px 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; color: #000000;">PEMERINTAH DESA PONDOK PANJANG</h2>
        <p style="margin: 0; font-size: 10pt; font-style: italic;">Alamat: ${villageData?.contacts?.address || 'Jl. Lintas Barat Sumatera No.12, Pondok Panjang 38765'}</p>
        <p style="margin: 0; font-size: 10pt;">Surel: ${villageData?.contacts?.email || 'info@pondokpanjang.id'} | Telp/WA: ${villageData?.contacts?.phone || '+6281324626243'}</p>
        <hr style="border: none; border-top: 3px double #000000; margin-top: 10px; margin-bottom: 20px;" />
      </div>
    `;

    const footerTandaTanganHTML = `
      <table style="width: 100%; font-family: 'Times New Roman', Times, serif; margin-top: 30px; font-size: 11pt;">
        <tr>
          <td style="width: 50%; text-align: left; vertical-align: bottom;">
            <table style="width: 100%; border: 1px solid #cbd5e1; padding: 6px; font-size: 8pt; background-color: #f8fafc; font-family: 'Times New Roman', serif;">
              <tr>
                <td style="vertical-align: middle; padding-right: 6px;">
                  ${generateQRCodeSVG(formState.noSuratKeluar, 55, "check")}
                </td>
                <td style="vertical-align: middle; color: #475569; line-height: 1.2;">
                  <strong>SERTIFIKASI DIGITAL DESA</strong><br/>
                  TTE Kepala Desa terdaftar BSrE. Pindai QR untuk uji keabsahan surat keluar.
                </td>
              </tr>
            </table>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top;">
            <p style="margin: 0;">Pondok Panjang, ${formState.hariTanggal.split(",")[1] || "10 Juni 2026"}</p>
            <p style="margin: 0; font-weight: bold; text-transform: uppercase;">${formState.jabatanKades}</p>
            <br /><br /><br />
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${formState.namaKades}</p>
            <p style="margin: 0; font-size: 10pt; color: #555555;">NIP: PAMONG.1706042.2023</p>
          </td>
        </tr>
      </table>
    `;

    let templateContent = "";
    let fileName = "";

    // Check if selectedTemplate is a custom template
    const isCustom = customTemplates.some(t => t.id === selectedTemplate);

    if (isCustom) {
      const customMatch = customTemplates.find(t => t.id === selectedTemplate)!;
      fileName = `DRAFT_SURAT_${customMatch.name.toUpperCase().replace(/\s+/g, "_")}_${formState.nama.replace(/\s+/g, "_")}.doc`;
      
      let compiledBody = customMatch.body;
      customMatch.variables.forEach(v => {
        const value = formState.customFields[v] || `[Isian ${v}]`;
        compiledBody = compiledBody.replace(new RegExp(`{{${v}}}`, "g"), value);
      });
      compiledBody = compiledBody.replace(/{{nama}}/g, formState.nama);
      compiledBody = compiledBody.replace(/{{nik}}/g, formState.nik);
      compiledBody = compiledBody.replace(/{{alamat}}/g, formState.alamat);

      templateContent = `
        ${kopSuratHTML}
        <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${customMatch.name}</h4>
            <p style="margin: 0;">Nomor: ${formState.noSuratKeluar}</p>
          </div>
          ${compiledBody}
        </div>
        ${footerTandaTanganHTML}
      `;
    } else {
      switch (selectedTemplate) {
      case "sku":
        fileName = `Surat_Keterangan_Usaha_${formState.nama.replace(/\s+/g, "_")}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT KETERANGAN USAHA (SKU)</h4>
              <p style="margin: 0;">Nomor: ${formState.noSuratKeluar}</p>
            </div>
            
            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Yang bertanda tangan di bawah ini Kepala Desa Pondok Panjang, Kecamatan Teramang Jaya, Kabupaten Mukomuko, Provinsi Bengkulu, menerangkan dengan sebenarnya bahwa:
            </p>
            
            <table style="width: 90%; margin-left: 20px; margin-bottom: 15px; font-size: 11pt; border-collapse: collapse;">
              <tr>
                <td style="width: 30%; padding: 4px 0; font-weight: bold;">Nama Lengkap</td>
                <td style="width: 3%; padding: 4px 0;">:</td>
                <td style="width: 67%; padding: 4px 0; font-weight: bold;">${formState.nama}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Nomor Induk Kependudukan (NIK)</td>
                <td>:</td>
                <td style="padding: 4px 0; font-family: monospace;">${formState.nik}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Jenis Kelamin</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.gender}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Tempat, Tanggal Lahir</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.birthPlaceDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Alamat Tempat Tinggal</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.alamat}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Jenis Pekerjaan</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.pekerjaan}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Berdasarkan tinjauan lapangan langsung dan verifikasi pamong rukun tetangga setempat, yang bersangkutan memang benar memiliki dan mengelola bidang usaha ekonomi produktif sebagai berikut:
            </p>

            <table style="width: 90%; margin-left: 20px; margin-bottom: 20px; font-size: 11pt; border-collapse: collapse; background-color: #fcfcfc;">
              <tr>
                <td style="width: 30%; padding: 6px 0; font-weight: bold;">Nama Usaha</td>
                <td style="width: 3%; padding: 6px 0;">:</td>
                <td style="width: 67%; padding: 6px 0; font-style: italic; font-weight: bold;">"${formState.namaUsaha}"</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Jenis/Bidang Usaha</td>
                <td>:</td>
                <td style="padding: 6px 0;">${formState.jenisUsaha}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Beroperasi Sejak</td>
                <td>:</td>
                <td style="padding: 6px 0;">${formState.sejakKapan}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Lokasi Tempat Usaha</td>
                <td>:</td>
                <td style="padding: 6px 0;">${formState.alamat}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Surat Keterangan Usaha ini diberikan khusus kepada yang bersangkutan untuk dapat dipergunakan sebagai: <strong>${formState.keperluanSKU}</strong>.
            </p>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Demikian Surat Keterangan Usaha (SKU) ini kami buat dengan penuh tanggung jawab demi membina pengembangan usaha mikro, kecil, dan menengah, untuk dapat dipergunakan sebagaimana meskinya.
            </p>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;

      case "sktm":
        fileName = `Surat_Keterangan_Tidak_Mampu_${formState.nama.replace(/\s+/g, "_")}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT KETERANGAN TIDAK MAMPU (SKTM)</h4>
              <p style="margin: 0;">Nomor: ${formState.noSuratKeluar}/SKTM</p>
            </div>
            
            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Yang bertanda tangan di bawah ini Kepala Desa Pondok Panjang, Kecamatan Teramang Jaya, Kabupaten Mukomuko, Provinsi Bengkulu, berdasarkan berkas pengantar dari Ketua RT dan wawancara kondisi sosial ekonomi, menerangkan bahwa:
            </p>
            
            <table style="width: 90%; margin-left: 20px; margin-bottom: 15px; font-size: 11pt; border-collapse: collapse;">
              <tr>
                <td style="width: 30%; padding: 4px 0; font-weight: bold;">Nama Lengkap</td>
                <td style="width: 3%; padding: 4px 0;">:</td>
                <td style="width: 67%; padding: 4px 0; font-weight: bold;">${formState.nama}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">NIK Penduduk</td>
                <td>:</td>
                <td style="padding: 4px 0; font-family: monospace;">${formState.nik}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Alamat Domisili</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.alamat}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Pekerjaan / Penghasilan</td>
                <td>:</td>
                <td style="padding: 4px 0; font-weight: bold;">${formState.pekerjaan} (${formState.penghasilan})</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Menyatakan bahwa nama yang tersebut di atas adalah benar-benar warga penduduk tetap Desa Pondok Panjang yang tergolong dalam keluarga prasejahtera / ekonomi lemah, dengan pendapatan bulanan tidak memadai untuk membiayai pengeluaran sekunder/tersier.
            </p>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Surat Keterangan Tidak Mampu ini diterbitkan khusus untuk melengkapi syarat pengajuan administrasi keadilan sosial warga berupa: <strong>${formState.keperluanSKTM}</strong>.
            </p>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Demikian Surat Keterangan Tidak Mampu (SKTM) ini dirumuskan sebenar-benarnya untuk digunakan secara jujur dan beriktikad baik oleh yang berkepentingan.
            </p>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;

      case "skp":
        fileName = `Surat_Pengantar_Mutasi_KTP_${formState.nama.replace(/\s+/g, "_")}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT PENGANTAR KETERANGAN MUTASI / KTP</h4>
              <p style="margin: 0;">Nomor: ${formState.noSuratKeluar}/SP-KTP</p>
            </div>
            
            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Kepala Desa Pondok Panjang menerangkan dengan ini bahwa penduduk berikut tengah melakukan administrasi mutasi kependudukan / pencetakan dokumen KTP-Elektronik baru:
            </p>
            
            <table style="width: 90%; margin-left: 20px; margin-bottom: 15px; font-size: 11pt; border-collapse: collapse;">
              <tr>
                <td style="width: 30%; padding: 4px 0; font-weight: bold;">Nama Lengkap</td>
                <td style="width: 3%; padding: 4px 0;">:</td>
                <td style="width: 67%; padding: 4px 0; font-weight: bold;">${formState.nama}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Nomor NIK KTP</td>
                <td>:</td>
                <td style="padding: 4px 0; font-family: monospace;">${formState.nik}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Jenis Kelamin</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.gender}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Alamat Tempat Asal</td>
                <td>:</td>
                <td style="padding: 4px 0; font-weight: bold;">${formState.alamatAsal}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Alamat Tempat Tujuan</td>
                <td>:</td>
                <td style="padding: 4px 0; font-weight: bold; color: #2563EB;">${formState.alamatTujuan}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Alasan Perpindahan</td>
                <td>:</td>
                <td style="padding: 4px 0; font-style: italic;">${formState.alasanPindah}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Yang bersangkutan telah melunasi seluruh kewajiban administrasi kependudukan di tingkat desa Pondok Panjang serta berkelakuan baik tanpa memiliki catatan hukum/tunggakan sosial apa pun selama menetap di rukun tetangga kami.
            </p>

            <p style="text-indent: 40px; margin-bottom: 12px; text-align: justify;">
              Demikian surat pengantar keterangan ini difinalisasikan untuk kelancaran pengurusan dokumen Kartu Tanda Penduduk (KTP) serta Kartu Keluarga (KK) baru di wilayah instansi Dukcapil tujuan.
            </p>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;

      case "perdes":
        fileName = `DRAFT_PERATURAN_DESA_NO_${formState.noDokumen.replace(/\//g, "_")}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000; text-align: justify;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">PERATURAN DESA PONDOK PANJANG</h4>
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">NOMOR ${formState.noDokumen} TAHUN ${formState.tahun}</h4>
              <p style="margin: 4px 0; font-weight: bold; text-transform: uppercase;">TENTANG</p>
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #1E3A8A;">${formState.tentang}</h4>
              <hr style="border: none; border-top: 1px solid #000; width: 60%; margin: 12px auto;" />
              <h4 style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">DENGAN RAHMAT TUHAN YANG MAHA ESA</h4>
              <h4 style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">KEPALA DESA PONDOK PANJANG,</h4>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 11pt; margin-bottom: 15px;">
              <tr>
                <td style="width: 15%; font-weight: bold; vertical-align: top; padding-bottom: 10px;">Menimbang</td>
                <td style="width: 3%; vertical-align: top;">:</td>
                <td style="width: 82%; vertical-align: top; padding-bottom: 10px;">
                  ${formState.menimbang}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">Mengingat</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.mengingat}
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin: 20px 0; font-weight: bold; text-transform: uppercase;">
              MEMUTUSKAN:
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 11pt; margin-bottom: 20px;">
              <tr>
                <td style="width: 15%; font-weight: bold; vertical-align: top; padding-bottom: 10px;">Menetapkan</td>
                <td style="width: 3%; vertical-align: top;">:</td>
                <td style="width: 82%; vertical-align: top; padding-top: 0; padding-bottom: 10px; font-weight: bold;">
                  PERATURAN DESA PONDOK PANJANG TENTANG ${formState.tentang.toUpperCase()}.
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">PASAL 1</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.keputusanSatu}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">PASAL 2</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.keputusanDua}
                </td>
              </tr>
            </table>

            <p style="text-indent: 40px;">
              Peraturan Desa ini disetujui secara mufakat bersama oleh Badan Permusyawaratan Desa (BPD) Pondok Panjang pada tanggal mufakat agar dapat diundangkan dalam Lembaran Wilayah Desa Teramang Jaya demi diketahui khalayak umum.
            </p>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;

      case "perkades":
        fileName = `DRAFT_KEPUTUSAN_KADES_NO_${formState.noDokumen.replace(/\//g, "_")}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000; text-align: justify;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">KEPUTUSAN KEPALA DESA PONDOK PANJANG</h4>
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">NOMOR ${formState.noDokumen}</h4>
              <p style="margin: 4px 0; font-weight: bold; text-transform: uppercase;">TENTANG</p>
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #8F3F15;">${formState.tentang}</h4>
              <hr style="border: none; border-top: 1px solid #000; width: 60%; margin: 12px auto;" />
              <h4 style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">KEPALA DESA PONDOK PANJANG,</h4>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 11pt; margin-bottom: 15px;">
              <tr>
                <td style="width: 15%; font-weight: bold; vertical-align: top; padding-bottom: 10px;">Menimbang</td>
                <td style="width: 3%; vertical-align: top;">:</td>
                <td style="width: 82%; vertical-align: top; padding-bottom: 10px;">
                  ${formState.menimbang}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">Mengingat</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.mengingat}
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin: 20px 0; font-weight: bold; text-transform: uppercase;">
              MEMUTUSKAN:
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 11pt; margin-bottom: 20px;">
              <tr>
                <td style="width: 15%; font-weight: bold; vertical-align: top; padding-bottom: 10px;">PERTAMA</td>
                <td style="width: 3%; vertical-align: top;">:</td>
                <td style="width: 82%; vertical-align: top; padding-bottom: 10px;">
                  Menetapkan Keputusan Kepala Desa Pondok Panjang tentang penetapan <strong>${formState.tentang}</strong> secara definitif untuk kemaslahatan warga.
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">KEDUA</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.keputusanSatu}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; vertical-align: top; padding-bottom: 10px;">KETIGA</td>
                <td style="vertical-align: top;">:</td>
                <td style="vertical-align: top; padding-bottom: 10px;">
                  ${formState.keputusanDua}
                </td>
              </tr>
            </table>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;

      case "berita_acara":
        fileName = `Berita_Acara_Musrenbang_${formState.tahun}.doc`;
        templateContent = `
          ${kopSuratHTML}
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000000; text-align: justify;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0; font-size: 12pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">BERITA ACARA MUSYAWARAH DESA</h4>
              <p style="margin: 0;">Nomor Arsip: ${formState.noSuratKeluar}/BA-MUSDOK</p>
            </div>
            
            <p style="text-indent: 40px; margin-bottom: 12px;">
              Pada hari ini, <strong>${formState.hariTanggal}</strong>, bertempat di <strong>${formState.tempat}</strong>, telah diselenggarakan Musyawarah Desa Pondok Panjang dengan keterangan forum mufakat sebagai berikut:
            </p>
            
            <table style="width: 90%; margin-left: 20px; margin-bottom: 15px; font-size: 11pt; border-collapse: collapse;">
              <tr>
                <td style="width: 30%; padding: 4px 0; font-weight: bold;">Agenda Acara</td>
                <td style="width: 3%; padding: 4px 0;">:</td>
                <td style="width: 67%; padding: 4px 0; font-style: italic;">"${formState.agendaAcara}"</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Waktu Rapat</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.waktu}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: bold;">Kehadiran Forum</td>
                <td>:</td>
                <td style="padding: 4px 0;">${formState.jumlahHadir}</td>
              </tr>
            </table>

            <p style="margin-bottom: 12px;">
              Setelah dilakukan penyampaian draf, tanya jawab, serta diskusi mendalam terkait permasalahan dan perencanaan desa, diperoleh kesepakatan akhir peserta musyawarah mufakat sebagai berikut:
            </p>

            <div style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #2563eb; margin-bottom: 15px; font-style: italic;">
              "${formState.kesepakatanAkhir}"
            </div>

            <p style="text-indent: 40px; margin-bottom: 12px;">
              Demikian Berita Acara ini dibuat dan disahkan sepenuhnya dengan penuh tanggung jawab kesepakatan bulat bersama untuk dasar penyusunan Rencana Kerja Pemerintah Desa (RKPDes) APBDes Pondok Panjang.
            </p>
          </div>
          ${footerTandaTanganHTML}
        `;
        break;
    }
    } // End of else block

    // Save newly generated metadata back to certified letters database for real-time validation in Public Portal!
    try {
      const savedSigned = localStorage.getItem("pondokpanjang_signed_letters");
      const currentList = savedSigned ? JSON.parse(savedSigned) : [];
      const letterNo = formState.noSuratKeluar;

      const isExist = currentList.some((doc: any) => doc.noSurat.toLowerCase() === letterNo.toLowerCase());
      if (!isExist) {
        let typeName = "Dokumen Sipil Resmi";
        let detail = "Kebutuhan Berkas Mandiri.";
        const customMatch = customTemplates.find(t => t.id === selectedTemplate);

        if (selectedTemplate === "sku") {
          typeName = "Surat Keterangan Usaha (SKU)";
          detail = `Usaha: ${formState.namaUsaha} (${formState.jenisUsaha})`;
        } else if (selectedTemplate === "sktm") {
          typeName = "Surat Keterangan Tidak Mampu (SKTM)";
          detail = `Tujuan Beasiswa / Jaminan. Pendapatan: ${formState.penghasilan}`;
        } else if (selectedTemplate === "skp") {
          typeName = "Surat Pengantar Pindah";
          detail = `Mutasi Domisili. Tujuan: ${formState.alamatTujuan}`;
        } else if (customMatch) {
          typeName = customMatch.name;
          detail = customMatch.description;
        } else if (selectedTemplate === "perdes") {
          typeName = "Perges (Peraturan Desa)";
          detail = `Tentang: ${formState.tentang}`;
        } else if (selectedTemplate === "perkades") {
          typeName = "Perkades (Keputusan Kades)";
          detail = `Tentang: ${formState.tentang}`;
        } else if (selectedTemplate === "berita_acara") {
          typeName = "Berita Acara";
          detail = `Agenda: ${formState.agendaAcara}`;
        }

        const newLetterMetadata = {
          noSurat: letterNo,
          type: typeName,
          nama: formState.nama || "Pemerintah Desa",
          nik: formState.nik || "-",
          kategori: activeCategory === "surat" ? "Administrasi Sipil" : "Regulasi & Hukum",
          tanggalSelesai: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          penandatangan: `${formState.namaKades} (${formState.jabatanKades})`,
          keperluan: `Kebutuhan Berkas Mandiri Warga`,
          detailExtra: detail
        };

        const updatedList = [newLetterMetadata, ...currentList];
        localStorage.setItem("pondokpanjang_signed_letters", JSON.stringify(updatedList));

        // Update any citizen request status from "Pending" to "Disetujui" with number
        const publicRequests = localStorage.getItem("pondokpanjang_public_requests");
        if (publicRequests) {
          const reqList = JSON.parse(publicRequests);
          const reqIdx = reqList.findIndex((r: any) => (r.nik === formState.nik || r.nama === formState.nama) && r.status === "Pending");
          if (reqIdx !== -1) {
            reqList[reqIdx].status = "Disetujui";
            reqList[reqIdx].noSurat = letterNo;
            localStorage.setItem("pondokpanjang_public_requests", JSON.stringify(reqList));
            setCitizenRequests(reqList); // Sync state instantly
          }
        }
      }
    } catch (e) {
      console.error("Storage sync failed: ", e);
    }

    // Embed in full Word HTML Document Wrapper for perfect loading in Word
    const htmlWrapper = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${selectedTemplate.toUpperCase()}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21cm 29.7cm; /* A4 */
            margin: 2.5cm 2.5cm 2.5cm 2.5cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        ${templateContent}
      </body>
      </html>
    `;

    // Trigger binary File-Saver like flow
    const blob = new Blob(['\ufeff' + htmlWrapper], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(
      `Berkas draft ${selectedTemplate.toUpperCase()} Word sukses dihasilkan dengan penahan placeholder kustom Anda!`,
      "success",
      "Unduhan Word Sukses"
    );
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
        <button
          onClick={() => {
            setActiveCategory("surat");
            setSelectedTemplate("sku");
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeCategory === "surat"
              ? "bg-white text-slate-905 shadow-sm"
              : "text-slate-500 hover:text-slate-805"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          Administrasi Sensus & Surat Keterangan Warga
        </button>
        <button
          onClick={() => {
            setActiveCategory("hukum");
            setSelectedTemplate("perdes");
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeCategory === "hukum"
              ? "bg-white text-slate-905 shadow-sm"
              : "text-slate-500 hover:text-slate-850"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Draf Regulasi Desa, Hukum & Berita Acara
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selector & Form inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3 text-left">PILIH TEMPLATE DOKUMEN</h3>
            
            {activeCategory === "surat" ? (
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("sku")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "sku"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "sku" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Surat Keterangan Usaha (SKU)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Pengantar izin dagang, KUR Bank, & legalitas usaha mikro desa.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("sktm")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "sktm"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "sktm" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Surat Keterangan Tidak Mampu (SKTM)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Bantuan sosial, beasiswa sekolah, & keringanan biaya medis.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("skp")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "skp"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "skp" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Surat Pengantar Mutasi / KTP</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Dokumen pengantar pindah wilayah rukun tetangga / cetak KTP.</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("perdes")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "perdes"
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "perdes" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Peraturan Desa (Perdes)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Draft hukum mufakat BPD & Kepala Desa untuk ketertiban masyarakat.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("perkades")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "perkades"
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "perkades" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Keputusan Kepala Desa (Perkades / Kepdes)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Kebijakan internal pimpinan desa terkait tugas pokok pamong.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("berita_acara")}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition ${
                    selectedTemplate === "berita_acara"
                      ? "border-emerald-500 bg-emerald-50/40"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${selectedTemplate === "berita_acara" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Berita Acara Rapat / Kegiatan (BA)</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Notulensi, kesepakatan bulat, & notula mufakat musyawarah warga.</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Form Editing Inputs */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">ISIAN DATA PLACEHOLDER</h3>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-[10px] font-semibold text-slate-500 hover:text-red-500 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset Form
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {/* Common fields for citizens */}
              {["sku", "sktm", "skp"].includes(selectedTemplate) && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Lengkap Pemohon</label>
                    <input
                      type="text"
                      name="nama"
                      value={formState.nama}
                      onChange={handleInputChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">NIK (16 Digit)</label>
                      <input
                        type="text"
                        name="nik"
                        value={formState.nik}
                        onChange={handleInputChange}
                        maxLength={16}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Jenis Kelamin</label>
                      <select
                        name="gender"
                        value={formState.gender}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-850 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Tempat, Tanggal Lahir</label>
                      <input
                        type="text"
                        name="birthPlaceDate"
                        value={formState.birthPlaceDate}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      name="pekerjaan"
                      value={formState.pekerjaan}
                      onChange={handleInputChange}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Alamat Warga</label>
                    <textarea
                      name="alamat"
                      value={formState.alamat}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* SKU specific */}
              {selectedTemplate === "sku" && (
                <>
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase font-mono block">Detil Usaha Dagang</span>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Usaha / Toko</label>
                      <input
                        type="text"
                        name="namaUsaha"
                        value={formState.namaUsaha}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jenis / Komoditi Usaha</label>
                      <input
                        type="text"
                        name="jenisUsaha"
                        value={formState.jenisUsaha}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-850"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sejak Kapan</label>
                        <input
                          type="text"
                          name="sejakKapan"
                          value={formState.sejakKapan}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Surat Keluar</label>
                        <input
                          type="text"
                          name="noSuratKeluar"
                          value={formState.noSuratKeluar}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keperluan Draft</label>
                      <textarea
                        name="keperluanSKU"
                        value={formState.keperluanSKU}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SKTM Specific */}
              {selectedTemplate === "sktm" && (
                <>
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase font-mono block">Indikator Prasejahtera</span>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Taksiran Pendapatan Bulanan</label>
                      <input
                        type="text"
                        name="penghasilan"
                        value={formState.penghasilan}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tujuan / Keperluan Penerbitan</label>
                      <textarea
                        name="keperluanSKTM"
                        value={formState.keperluanSKTM}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Mutasi Pengantar Specific */}
              {selectedTemplate === "skp" && (
                <>
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase font-mono block">Logistik Mutasi Penduduk</span>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Domisili Asal</label>
                      <input
                        type="text"
                        name="alamatAsal"
                        value={formState.alamatAsal}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Domisili Tujuan Pindah</label>
                      <input
                        type="text"
                        name="alamatTujuan"
                        value={formState.alamatTujuan}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-850 font-semibold border-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alasan Pindah Wilayah</label>
                      <textarea
                        name="alasanPindah"
                        value={formState.alasanPindah}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Hukum / Regulasi specific */}
              {["perdes", "perkades"].includes(selectedTemplate) && (
                <>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nomor Rancangan</label>
                        <input
                          type="text"
                          name="noDokumen"
                          value={formState.noDokumen}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tahun Pengesahan</label>
                        <input
                          type="text"
                          name="tahun"
                          value={formState.tahun}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul / Hal ('Tentang')</label>
                      <input
                        type="text"
                        name="tentang"
                        value={formState.tentang}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-850 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Menimbang (Konsideran A)</label>
                      <textarea
                        name="menimbang"
                        value={formState.menimbang}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Meningat (Dasar Hukum)</label>
                      <textarea
                        name="mengingat"
                        value={formState.mengingat}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amar Keputusan / Pasal 1</label>
                      <textarea
                        name="keputusanSatu"
                        value={formState.keputusanSatu}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mulai Berlaku / Pasal 2</label>
                      <textarea
                        name="keputusanDua"
                        value={formState.keputusanDua}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Berita Acara Rapat */}
              {selectedTemplate === "berita_acara" && (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pelaksanaan (Hari, Tanggal)</label>
                      <input
                        type="text"
                        name="hariTanggal"
                        value={formState.hariTanggal}
                        onChange={handleInputChange}
                        placeholder="e.g. Rabu, 10 Juni 2026"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Waktu Mulai-Selesai</label>
                        <input
                          type="text"
                          name="waktu"
                          value={formState.waktu}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah Unsur Hadir</label>
                        <input
                          type="text"
                          name="jumlahHadir"
                          value={formState.jumlahHadir}
                          onChange={handleInputChange}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tempat Forum Musyawarah</label>
                      <input
                        type="text"
                        name="tempat"
                        value={formState.tempat}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agenda Utama Pembahasan</label>
                      <input
                        type="text"
                        name="agendaAcara"
                        value={formState.agendaAcara}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kesepakatan Akhir / Hasil Bulat</label>
                      <textarea
                        name="kesepakatanAkhir"
                        value={formState.kesepakatanAkhir}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-805"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Signatures and generic names */}
              <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tanda Tangan Kades</label>
                  <input
                    type="text"
                    name="namaKades"
                    value={formState.namaKades}
                    onChange={handleInputChange}
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jabatan Penanggung</label>
                  <input
                    type="text"
                    name="jabatanKades"
                    value={formState.jabatanKades}
                    onChange={handleInputChange}
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-600 font-mono"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={generateWordDocument}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition"
            >
              <Download className="w-4 h-4" /> Export ke Dokumen Word (.docx Compatible)
            </button>
          </div>
        </div>

        {/* Right Column: Live Visual Print-Ready Layout Preview (A4 Sim) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-slate-800 text-slate-200 px-4 py-2 rounded-t-xl border border-slate-700 border-b-0 flex justify-between items-center text-xs">
            <span className="font-mono font-bold flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE PRINT PREVIEW - PINTU MASUK APARATUR DESA
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-705 px-2 py-0.5 rounded font-mono uppercase">
              {selectedTemplate.toUpperCase()} Template - Word Renders CSS
            </span>
          </div>
          
          <div className="bg-slate-100 border border-slate-250 p-6 rounded-b-xl overflow-y-auto max-h-[610px] shadow-inner text-left">
            <div className="bg-white p-8 shadow-md border border-slate-300 mx-auto max-w-[550px] min-h-[700px] text-black font-serif relative" style={{ fontSize: "11px", lineHeight: "1.4" }}>
              
              {/* Formal KOP SURAT */}
              <div className="text-center font-serif border-b-[3px] border-double border-black pb-3.5 mb-5 relative">
                {/* Official Crest Shield Placeholder */}
                <div className="absolute -left-1 -top-1 w-12 h-12 border border-slate-300 flex flex-col items-center justify-center text-[7px] text-slate-400 font-mono bg-slate-50 leading-none py-1">
                  <span>KOP</span>
                  <span className="text-[5px]">LAMBANG</span>
                  <span className="text-[5px]">DAERAH</span>
                </div>
                
                <h4 className="text-xs font-bold leading-none tracking-tight uppercase">PEMERINTAH KABUPATEN MUKOMUKO</h4>
                <h4 className="text-xs font-bold leading-snug tracking-tight uppercase">KECAMATAN TERAMANG JAYA</h4>
                <h2 className="text-sm font-bold leading-snug tracking-tight uppercase text-black mt-0.5">PEMERINTAH DESA PONDOK PANJANG</h2>
                <div className="text-[8px] font-sans text-slate-500 mt-1 italic leading-none">
                  Alamat: {villageData?.contacts?.address || 'Jl. Lintas Barat Sumatera No.12, Pondok Panjang 38765'}
                </div>
                <div className="text-[8px] font-sans text-slate-500 mt-0.5 leading-none">
                  Email: <span className="underline">{villageData?.contacts?.email || 'info@pondokpanjang.id'}</span> | Telp/WhatsApp: {villageData?.contacts?.phone || '+6281324626243'}
                </div>
              </div>

              {/* SKU Letter Body Preview */}
              {selectedTemplate === "sku" && (
                <div className="space-y-4 font-serif text-justify text-slate-900">
                  <div className="text-center text-black mb-4">
                    <h4 className="text-xs font-bold underline uppercase tracking-tight">SURAT KETERANGAN USAHA (SKU)</h4>
                    <p className="text-[9px] font-mono mt-0.5">Nomor Agenda: {formState.noSuratKeluar}</p>
                  </div>
                  
                  <p className="indent-8 text-[11px] text-justify">
                    Yang bertanda tangan di bawah ini Kepala Desa Pondok Panjang, Kecamatan Teramang Jaya, Kabupaten Mukomuko, Provinsi Bengkulu, menerangkan dengan sesungguhnya bahwa warga tersebut dibawah ini:
                  </p>
                  
                  <div className="pl-6 space-y-1 my-3">
                    <div className="flex"><span className="w-28 text-slate-500">Nama Lengkap</span><span className="mr-2">:</span><strong className="text-black">{formState.nama}</strong></div>
                    <div className="flex"><span className="w-28 text-slate-500">Nomor NIK</span><span className="mr-2">:</span><span className="font-mono text-black">{formState.nik}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Jenis Kelamin</span><span className="mr-2">:</span><span className="text-black">{formState.gender}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Tempat, Tgl Lahir</span><span className="mr-2">:</span><span className="text-black">{formState.birthPlaceDate}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Pekerjaan Utama</span><span className="mr-2">:</span><span className="text-black">{formState.pekerjaan}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Alamat Tempat Tinggal</span><span className="mr-2">:</span><span className="text-black font-semibold bg-blue-50 px-1 border border-blue-100 rounded">{formState.alamat}</span></div>
                  </div>

                  <p className="indent-8 text-[11px] text-justify">
                    Berdasarkan pantauan langsung tim seksi pelayanan desa di lapangan, serta mengacu konfirmasi rukun warga setempat, nama tercantum di atas memang benar memiliki bidang usaha komersial produktif aktif dengan profil:
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-3 space-y-1 mx-4">
                    <div className="flex"><span className="w-24 font-bold text-slate-600">Nama Usaha</span><span className="mr-2">:</span><strong className="text-blue-700 italic">"{formState.namaUsaha}"</strong></div>
                    <div className="flex"><span className="w-24 font-bold text-slate-600">Bidang Usaha</span><span className="mr-2">:</span><span className="text-slate-800 font-semibold">{formState.jenisUsaha}</span></div>
                    <div className="flex"><span className="w-24 font-bold text-slate-600">Tahun Berdiri</span><span className="mr-2">:</span><span className="text-slate-700 font-semibold">{formState.sejakKapan}</span></div>
                    <div className="flex"><span className="w-24 font-bold text-slate-600">Tempat Kedudukan</span><span className="mr-2">:</span><span className="text-slate-700 text-[10px]">{formState.alamat}</span></div>
                  </div>

                  <p className="indent-8 text-[11px] text-justify">
                    Surat keterangan usaha ini kami terbitkan secara resmi agar dapat dipergunakan seperlunya sebagai kelengkapan administratif: <strong className="text-slate-800">{formState.keperluanSKU}</strong>.
                  </p>

                  <p className="indent-8 text-[11px] text-justify">
                    Demikian SKU ini kami rumuskan sebenar-benarnya untuk digunakan secara bertanggung jawab sebagaimana mestinya di instansi perbankan atau lembaga terkait.
                  </p>
                </div>
              )}

              {/* SKTM Letter Body Preview */}
              {selectedTemplate === "sktm" && (
                <div className="space-y-4 font-serif text-justify text-slate-900">
                  <div className="text-center text-black mb-4">
                    <h4 className="text-xs font-bold underline uppercase tracking-tight">SURAT KETERANGAN TIDAK MAMPU (SKTM)</h4>
                    <p className="text-[9px] font-mono mt-0.5">Nomor Agenda: {formState.noSuratKeluar}/SKTM</p>
                  </div>
                  
                  <p className="indent-8 text-[11px]">
                    Yang bertanda tangan di bawah ini Kepala Desa Pondok Panjang, Kecamatan Teramang Jaya, menerangkan dengan seadil-adilnya berdasarkan peninjauan kluster sosial keluarga tidak mampu bahwa:
                  </p>
                  
                  <div className="pl-6 space-y-1 my-3">
                    <div className="flex"><span className="w-28 text-slate-500">Nama Lengkap</span><span className="mr-2">:</span><strong className="text-black">{formState.nama}</strong></div>
                    <div className="flex"><span className="w-28 text-slate-500 font-mono">NIK Kependudukan</span><span className="mr-2">:</span><span className="font-mono text-black">{formState.nik}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Alamat Tempat Tinggal</span><span className="mr-2">:</span><span className="text-slate-800 font-semibold leading-relaxed">{formState.alamat}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Pekerjaan / Hasil</span><span className="mr-2">:</span><span className="text-slate-800 font-bold bg-amber-50 border border-amber-100 rounded px-1">{formState.pekerjaan} ({formState.penghasilan})</span></div>
                  </div>

                  <p className="indent-8 text-[11px]">
                    Menerangkan bahwa keluarga yang diwakili nama tersebut di atas benar merupakan rukun penduduk tetap desa Pondok Panjang yang terpendam dalam kondisi ekonomi pra-sejahtera (kurang beruntung).
                  </p>

                  <p className="indent-8 text-[11px]">
                    Surat keterangan ini difasilitasi oleh aparatur desa secara khusus untuk dipergunakan bagi: <strong className="text-black bg-yellow-50 px-1 border border-yellow-200 rounded">{formState.keperluanSKTM}</strong>.
                  </p>

                  <p className="indent-8 text-[11px]">
                    Demikian surat pengantar keterangan tidak mampu ini kami sampaikan dengan tulus agar dapat berdaya guna dalam memecahkan masalah keadilan pendidikan maupun sosial kemanusiaan.
                  </p>
                </div>
              )}

              {/* MUTASI KTP / KK */}
              {selectedTemplate === "skp" && (
                <div className="space-y-4 font-serif text-justify text-slate-900">
                  <div className="text-center text-black mb-4">
                    <h4 className="text-xs font-bold underline uppercase tracking-tight">SURAT PENGANTAR MUTASI / KTP</h4>
                    <p className="text-[9px] font-mono mt-0.5">Nomor Agenda: {formState.noSuratKeluar}/SP-MUTASI</p>
                  </div>
                  
                  <p className="indent-8 text-[11px]">
                    Dengan ini selaku Kepala Pamong Desa Pondok Panjang menerangkan secara tertib administratif bahwa warga bertransaksi berikut di bawah sedang melakukan relokasi wilayah sensus kependudukan:
                  </p>
                  
                  <div className="pl-6 space-y-1 my-3 bg-slate-50 p-3 rounded-lg border border-slate-205">
                    <div className="flex"><span className="w-28 text-slate-500 font-semibold">Nama Lengkap</span><span className="mr-2">:</span><strong className="text-black">{formState.nama}</strong></div>
                    <div className="flex"><span className="w-28 text-slate-500 font-semibold">NIK Kepala Keluarga</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{formState.nik}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Alamat Tempat Asal</span><span className="mr-2">:</span><span className="text-slate-600 text-[10px]">{formState.alamatAsal}</span></div>
                    <div className="flex"><span className="w-28 text-slate-805 font-bold">MUTASI TUJUAN</span><span className="mr-2">:</span><span className="text-blue-700 font-bold bg-blue-50 border border-blue-100 rounded px-1">{formState.alamatTujuan}</span></div>
                    <div className="flex"><span className="w-28 text-slate-500">Alasan Pindah</span><span className="mr-2">:</span><span className="text-slate-700 italic text-[10px]">{formState.alasanPindah}</span></div>
                  </div>

                  <p className="indent-8 text-[11px]">
                    Warga bersangkutan telah merampungkan sirkulasi iuran rukun tetangga & dinilai baik kelakuannya tanpa rekam jejak kriminalitas apapun di tingkat teritorial kami.
                  </p>

                  <p className="indent-8 text-[11px]">
                    Merupakan draf pengantar mutasi agar instansi Dinas Kependudukan dan Catatan Sipil setempat dapat mentransmisi status kependudukan dan menerbitkan kartu keluarga (KK) baru.
                  </p>
                </div>
              )}

              {/* PERDES PREVIEW */}
              {selectedTemplate === "perdes" && (
                <div className="space-y-4 font-serif text-justify text-slate-900 text-[10.5px]">
                  <div className="text-center text-black mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-tight">PERATURAN DESA PONDOK PANJANG</h4>
                    <h4 className="text-xs font-bold uppercase tracking-tight">NOMOR {formState.noDokumen} TAHUN {formState.tahun}</h4>
                    <p className="text-[10px] font-bold my-1">TENTANG</p>
                    <h4 className="text-xs font-bold uppercase tracking-tight text-blue-800 bg-blue-50/50 p-1 rounded inline-block border border-blue-150">{formState.tentang}</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="w-20 font-bold shrink-0">Menimbang:</span>
                      <p className="flex-1 text-slate-800 text-[10px] leading-relaxed">
                        {formState.menimbang}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="w-20 font-bold shrink-0">Mengingat:</span>
                      <p className="flex-1 text-slate-705 text-[10px] leading-relaxed font-mono">
                        {formState.mengingat}
                      </p>
                    </div>
                  </div>

                  <div className="text-center font-bold tracking-wider my-2.5">
                    MEMUTUSKAN:
                  </div>

                  <div className="border border-slate-205 p-3 rounded bg-slate-50 text-[10px] space-y-2">
                    <div>
                      <strong className="block text-slate-900">PASAL 1 (AMAR PERDANA)</strong>
                      <p className="text-slate-700 leading-relaxed font-sans">{formState.keputusanSatu}</p>
                    </div>
                    <div>
                      <strong className="block text-slate-900">PASAL 2 (TANGGAL BERLAKU)</strong>
                      <p className="text-slate-700 leading-relaxed font-sans">{formState.keputusanDua}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PERKADES PREVIEW */}
              {selectedTemplate === "perkades" && (
                <div className="space-y-4 font-serif text-justify text-slate-900 text-[10.5px]">
                  <div className="text-center text-black mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-tight">KEPUTUSAN KEPALA DESA PONDOK PANJANG</h4>
                    <h4 className="text-xs font-bold uppercase tracking-tight">NOMOR {formState.noDokumen} TAHUN {formState.tahun}</h4>
                    <p className="text-[10px] font-bold my-1">TENTANG</p>
                    <h4 className="text-xs font-bold uppercase tracking-tight text-amber-855 bg-amber-50/50 p-1 border border-amber-150 inline-block rounded">{formState.tentang}</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="w-16 font-bold shrink-0">Menimbang</span>
                      <p className="flex-1 text-slate-800 text-[10px] leading-relaxed">
                        {formState.menimbang}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="w-16 font-bold shrink-0">Mengingat</span>
                      <p className="flex-1 text-slate-705 text-[10px] leading-relaxed">
                        {formState.mengingat}
                      </p>
                    </div>
                  </div>

                  <div className="text-center font-bold tracking-wider my-2.5">
                    MEMUTUSKAN KEPALA DESA:
                  </div>

                  <div className="border border-amber-205 p-3 rounded bg-amber-50/20 text-[10px] space-y-2">
                    <div>
                      <strong className="block text-slate-900">DIKUTUM PERTAMA:</strong>
                      <p className="text-slate-700 leading-relaxed">Menyepakati realisasi dan operasional penuh atas regulasi transparan tentang {formState.tentang}.</p>
                    </div>
                    <div>
                      <strong className="block text-slate-900">DIKUTUM KEDUA (Ketentuan Finansial):</strong>
                      <p className="text-slate-700 leading-relaxed">{formState.keputusanSatu}</p>
                    </div>
                    <div>
                      <strong className="block text-slate-900">DIKUTUM KETIGA (Re-alat Regulasi):</strong>
                      <p className="text-slate-700 leading-relaxed">{formState.keputusanDua}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BERITA ACARA PREVIEW */}
              {selectedTemplate === "berita_acara" && (
                <div className="space-y-3 font-serif text-justify text-slate-900 text-[10.5px]">
                  <div className="text-center text-black mb-3">
                    <h4 className="text-xs font-bold underline uppercase tracking-tight">BERITA ACARA MUSYAWARAH DESA</h4>
                    <p className="text-[9px] font-mono mt-0.5">Kode Registrasi: {formState.noSuratKeluar}/BA-MUSDOK</p>
                  </div>
                  
                  <p className="indent-8 text-[11px]">
                    Hari ini pada tanggal waktu rincian <strong>{formState.hariTanggal}</strong>, bertempat di <strong>{formState.tempat}</strong>, segenap permusyawaratan rukun warga beserta LPM, PKK, dan tokoh pamong desa adat melaksanakan musyawarah desa dengan rumusan rapat:
                  </p>
                  
                  <div className="pl-6 space-y-1 my-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div className="flex"><span className="w-24 text-slate-500 font-bold">Waktu Rapat</span><span className="mr-2">:</span><span className="text-black font-semibold">{formState.waktu}</span></div>
                    <div className="flex"><span className="w-24 text-slate-500 font-bold">Unsur Hadir</span><span className="mr-2">:</span><span className="text-black font-semibold">{formState.jumlahHadir}</span></div>
                    <div className="flex"><span className="w-24 text-slate-500 font-semibold">Tujuan Agenda</span><span className="mr-2">:</span><span className="text-slate-700">{formState.agendaAcara}</span></div>
                  </div>

                  <p className="text-[11px]">
                    Setelah melaksanakan hearing terbuka, mendengarkan paparan kades, tim verifikator lapangan, dan rembukan warga, diperoleh kesepakatan bulat mufakat peserta musyawarah:
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 italic text-blue-900 text-[10px] leading-relaxed font-sans rounded-r">
                    "{formState.kesepakatanAkhir}"
                  </div>

                  <p className="indent-8 text-[11px]">
                    Demikian berita acara perumusan aspirasi desa Pondok Panjang ini disusun secara bersama serta ditandatangani untuk dijadikan dasar hukum RKPD / APBDes Desa resmi berikutnya.
                  </p>
                </div>
              )}

              {/* Signature Block */}
              <div className="mt-8 pt-4 flex justify-between items-start font-serif" style={{ fontSize: "10px" }}>
                <div>
                  <p className="italic text-slate-400">Berkas administrasi digital</p>
                  <p className="italic text-slate-400 leading-none">Hedra-Office-v3 platform</p>
                  <div className="mt-4 border border-dashed border-slate-200 p-1 w-20 h-10 flex items-center justify-center text-[7px] text-slate-300 rounded leading-none">
                    Stempel Basah Desa
                  </div>
                </div>
                <div className="text-center w-48 shrink-0">
                  <p className="text-black">Pondok Panjang, {formState.hariTanggal.split(",")[1] || "10 Juni 2026"}</p>
                  <p className="font-bold uppercase text-black leading-snug">{formState.jabatanKades}</p>
                  <div className="h-10 my-1 relative flex items-center justify-center select-none opacity-85">
                    {/* Animated authentic ink-blue sig representation */}
                    <div className="font-mono text-[9px] font-bold text-blue-700/80 tracking-wide border border-blue-400/30 bg-blue-50/50 px-2 py-0.5 rounded italic whitespace-nowrap">
                      &mdash; {formState.namaKades} &mdash;
                    </div>
                  </div>
                  <p className="font-bold underline text-black">{formState.namaKades}</p>
                  <p className="text-[8px] text-slate-500">Reg: PAMONG.1706042.2023</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
