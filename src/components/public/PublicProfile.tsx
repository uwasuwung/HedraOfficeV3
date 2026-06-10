import React from "react";
import { BookOpen, Award, CheckCircle, Users2, Shield, Heart } from "lucide-react";

export default function PublicProfile() {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* 1. SEJARAH SINGKAT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Sejarah Singkat Desa Pondok Panjang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3 leading-relaxed text-slate-600 text-xs md:text-sm">
            <p>
              Desa Pondok Panjang secara geografis terletak di pesisir Barat Provinsi Bengkulu, tepatnya di Kecamatan Teramang Jaya, Kabupaten Mukomuko. Nama <b>"Pondok Panjang"</b> berasal dari keberadaan rumah singgah darurat beratap rumbia yang memanjang, yang dahulu didirikan oleh para pedagang kelapa dan pelaut tradisional saat berlabuh berlindung di pantai sekitar paruh abad ke-20.
            </p>
            <p>
              Seiring dengan masuknya arus transmigrasi mandiri dan pembukaan lahan perkebunan kelapa sawit pada dekade 1980-an, wilayah ini tumbuh pesat dari sekadar pemukiman nelayan kecil menjadi kluster perkebunan mandiri yang dinamis. 
            </p>
            <p>
              Pada tahun 2005, melalui pemekaran beberapa desa di wilayah induk Teramang Jaya, Pondok Panjang secara administratif resmi dikukuhkan sebagai desa definitif mandiri yang kini memiliki 5 Dusun Sektor dan 74 Rukun Tetangga (RT).
            </p>
          </div>
          <div className="md:col-span-4 bg-emerald-50 rounded-2xl border border-emerald-150 p-5 space-y-3">
            <Shield className="w-8 h-8 text-emerald-600 mb-2" />
            <strong className="text-slate-800 font-bold block text-sm">Status Desa Sekarang</strong>
            <p className="text-xs text-slate-500 leading-normal">
              Berdasarkan Indeks Desa Membangun (IDM) Kementerian Desa PDT Republik Indonesia tahun berjalan, Desa Pondok Panjang meraih status sebagai <b>Desa Mandiri</b> dengan tingkat kepedulian lingkungan sosisal ekonomi tertinggi di Teramang Jaya.
            </p>
          </div>
        </div>
      </div>

      {/* 2. VISI & MISI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <Award className="w-8 h-8 text-emerald-300" />
            <span className="text-[10px] uppercase font-bold text-emerald-250 font-mono tracking-wider">Visi Utama Pembangunan</span>
            <h4 className="text-xl font-extrabold tracking-tight pt-1">
              "Terwujudnya Desa Pondok Panjang yang Hebat, Mandiri, Transparan, Berkeadilan Sosial, & Unggul Secara Digital Tahun 2029"
            </h4>
          </div>
          <div className="text-[10px] text-emerald-200 border-t border-emerald-700/60 pt-3 mt-6 font-mono">
            Rencana Pembangunan Jangka Menengah Desa (RPJMDes)
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Agenda Misi Strategis Pamong
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { title: "Reformasi Digital Birokrasi", desc: "Menghadirkan pelayanan persuratan mandiri yang terintegrasi secara cepat, transparan, dan sah berbadan TTE." },
              { title: "Pemerataan Infrastruktur Fisik", desc: "Pembangunan rabat beton jalan tani, saluran air drainase, toilet sanitasi secara bertahap di seluruh dusun." },
              { title: "Pemberdayaan Ekonomi Makro", desc: "Memberikan pelatihan, sertifikasi Halal, NIB gratis, dan bantuan alat usaha stimulatif bagi kelompok UMKM desa." },
              { title: "Kesejahteraan & Kesehatan Sosial", desc: "Aksi penurunan stunting melalui PMT Posyandu rujukan balita, beasiswa siswa kurang mampu, dan bedah rumah RTLH." }
            ].map((misi, index) => (
              <div key={index} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 hover:border-slate-200 transition">
                <span className="text-emerald-600 font-bold font-mono tracking-wide text-[11px]">0{index + 1}. {misi.title}</span>
                <p className="text-slate-500 leading-normal text-[11px]">{misi.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PAMONG DESA (ORGANIZATION CHART CABINET) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
            <Users2 className="w-4 h-4 text-emerald-600" />
            Kabinet Struktur Organisasi Pemerintahan Desa
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Periode Jabatan Terdaftar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { name: "Heru Purnomo, ST", role: "Kepala Desa (Kades)", alias: "Kades", contact: "0813-2462-xxxx" },
            { name: "Deni Prasetyo, S.AP", role: "Sekretaris Desa (Sekdes)", alias: "Sekdes", contact: "0813-9892-xxxx" },
            { name: "Yulia Citra, SE", role: "Kaur Keuangan (Bendahara)", alias: "Kaur Keu", contact: "0852-1144-xxxx" },
            { name: "Ahmad Hambali, SH", role: "Kaur Pemerintahan & Adminduk", alias: "Kaur Pem", contact: "0821-6677-xxxx" },
            { name: "Roni Syahputra", role: "Kasi Kesejahteraan Masyarakat", alias: "Kasi Kesra", contact: "0812-3211-xxxx" },
            { name: "Siti Rahmaawati, S.Pd", role: "Kasi Pelayanan Umum & Sosial", alias: "Kasi Yanum", contact: "0853-2211-xxxx" },
            { name: "Maryadi Santoso", role: "Eks. Kaur Perencanaan & Monit", alias: "Kaur Rec", contact: "0877-4499-xxxx" },
            { name: "Kader Desa Teratih", role: "Babin Kamtibmas & Pembina RT", alias: "Bhabin", contact: "0811-9988-xxxx" }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-center hover:bg-white hover:shadow-2xs transition hover:border-slate-350 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 mx-auto flex items-center justify-center font-bold text-slate-600">
                  {item.alias}
                </div>
                <div>
                  <strong className="block text-slate-800 text-xs font-extrabold max-w-[150px] mx-auto truncate" title={item.name}>{item.name}</strong>
                  <span className="text-[10.5px] text-emerald-600 font-semibold">{item.role}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                <span>Pamong Siaga 24 Jam</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
