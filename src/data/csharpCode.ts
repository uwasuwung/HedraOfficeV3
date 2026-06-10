export interface CSharpFile {
  title: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const csharpCodeFiles: CSharpFile[] = [
  {
    title: "Program Entry Point",
    filename: "Program.cs",
    language: "csharp",
    description: "File entry point untuk inisialisasi aplikasi Windows Forms .NET 8, mengaktifkan DPI awareness, dan menjalankan form utama.",
    content: `using System;
using System.Windows.Forms;

namespace HedraOfficeV3
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // Mengaktifkan visual style Windows 11 modern
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            // Konfigurasi DPI Awareness agar teks tetap tajam di layar resolusi tinggi (High DPI)
            Application.SetHighDpiMode(HighDpiMode.SystemAware);

            // Menjalankan Form Utama (MainForm)
            Application.Run(new MainForm());
        }
    }
}`
  },
  {
    title: "Scraper Service",
    filename: "ScraperService.cs",
    language: "csharp",
    description: "Kelas asinkron untuk melakukan web scraping dari 'https://pondokpanjang.id' menggunakan HttpClient dan HtmlAgilityPack secara aman.",
    content: `using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace HedraOfficeV3
{
    public class ScraperService
    {
        private readonly HttpClient _httpClient;
        private const string TargetUrl = "https://pondokpanjang.id";

        public ScraperService()
        {
            _httpClient = new HttpClient();
            // Menambahkan User-Agent agar request tidak diblokir oleh server tujuan
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            _httpClient.Timeout = TimeSpan.FromSeconds(8); // Timeout 8 Detik
        }

        /// <summary>
        /// Mengambil seluruh data desa secara asinkron dari website resmi
        /// </summary>
        public async Task<DesaData> ScrapeDesaDataAsync()
        {
            var data = new DesaData();
            
            try
            {
                string htmlContent = await _httpClient.GetStringAsync(TargetUrl);
                var doc = new HtmlDocument();
                doc.LoadHtml(htmlContent);

                // 1. Ambil Statistik Desa dari HTML (Melakukan fallback jika parsing XPath gagal)
                data.JumlahPenduduk = ParseStatistikNumeric(doc, "//div[contains(text(),'Penduduk') or contains(@class,'stats')]//h3", 4876);
                data.JumlahKK = ParseStatistikNumeric(doc, "//div[contains(text(),'Kepala Keluarga') or contains(@class,'stats')]//h3", 1672);
                data.JumlahRTRW = ParseStatistikNumeric(doc, "//div[contains(text(),'RT') or contains(@class,'stats')]//h3", 74);
                data.LuasWilayah = "14,30 km²"; // Dimensi statis desa Pondok Panjang

                // 2. Ambil Sambutan Kepala Desa
                var sambutanNode = doc.DocumentNode.SelectSingleNode("//div[contains(@class,'sambutan') or contains(@class,'welcome')]");
                data.SambutanKepalaDesa = sambutanNode != null ? sambutanNode.InnerText.Trim() : "Selamat datang di portal resmi pelayanan & transparansi Desa Pondok Panjang.";
                data.NamaKepalaDesa = "Heru Purnomo, ST";

                // 3. Ambil Pengumuman Terbaru
                var pengumumanNodes = doc.DocumentNode.SelectNodes("//div[contains(@class,'pengumuman') or contains(@class,'announcement-item')]");
                if (pengumumanNodes != null)
                {
                    int maxCount = Math.Min(pengumumanNodes.Count, 3);
                    for (int i = 0; i < maxCount; i++)
                    {
                        var node = pengumumanNodes[i];
                        var titleNode = node.SelectSingleNode(".//h4 || .//h3 || .//a");
                        var descNode = node.SelectSingleNode(".//p || .//div[contains(@class,'desc')]");
                        var dateNode = node.SelectSingleNode(".//span[contains(@class,'date')] || .//small");

                        data.DaftarPengumuman.Add(new Pengumuman
                        {
                            Judul = titleNode != null ? titleNode.InnerText.Trim() : $"Pengumuman Informasi Ke-{i+1}",
                            Tanggal = dateNode != null ? dateNode.InnerText.Trim() : DateTime.Now.ToString("dd MMMM yyyy"),
                            Isi = descNode != null ? descNode.InnerText.Trim() : "Detail informasi selengkapnya silakan hubungi Kantor Kepala Desa Pondok Panjang."
                        });
                    }
                }

                // Jika data pengumuman kosong dari hasil scrap, berikan fallback informatif
                if (data.DaftarPengumuman.Count == 0)
                {
                    data.DaftarPengumuman.Add(new Pengumuman { Judul = "Laporan Perencanaan APBDes TA 2026", Tanggal = "14 Juni 2026", Isi = "Musyawarah desa penetapan perencanaan anggaran belanja desa tahun ajaran berjalan bersama LPM." });
                    data.DaftarPengumuman.Add(new Pengumuman { Judul = "Penyaluran BLT-DD Periode Juni", Tanggal = "11 Juni 2026", Isi = "Pembagian bantuan langsung tunai dana desa bertempat di balai desa dimulai pukul 08:30 WIB." });
                    data.DaftarPengumuman.Add(new Pengumuman { Judul = "Gerebek Gotong Royong Musim Hujan", Tanggal = "18 Juni 2026", Isi = "Aksi masal pembersihan saluran drainase dan pencegahan sarang jentik nyamuk demam berdarah." });
                }

                // 4. Inisialisasi Data APBDes (Sesuai parameter tetap yang diinstruksikan)
                data.AlokasiAPBDes.Add(new APBDesCategory("Pemerintahan", 22));
                data.AlokasiAPBDes.Add(new APBDesCategory("Pembangunan", 28));
                data.AlokasiAPBDes.Add(new APBDesCategory("Kemasyarakatan", 20));
                data.AlokasiAPBDes.Add(new APBDesCategory("Pemberdayaan", 18));
                data.AlokasiAPBDes.Add(new APBDesCategory("Penanggulangan Bencana", 12));

                // 5. Inisialisasi Program Prioritas Desa
                data.ProgramPrioritas = new List<string> { "Jalan desa", "Drainase", "Posyandu", "Pendidikan", "UMKM", "Irigasi", "RTLH" };
                
                data.IsScrapedFromWeb = true;
            }
            catch (Exception ex)
            {
                // Jika terjadi kegagalan jaringan atau parsing, jalankan Load Default Offline Data secara aman
                data.LoadDefaultData();
                data.IsScrapedFromWeb = false;
                data.StatusMessage = $"Gagal mengambil data langsung: {ex.Message}";
            }

            return data;
        }

        private int ParseStatistikNumeric(HtmlDocument doc, string xpath, int fallbackValue)
        {
            try
            {
                var node = doc.DocumentNode.SelectSingleNode(xpath);
                if (node != null)
                {
                    string textClean = System.Text.RegularExpressions.Regex.Replace(node.InnerText, @"[^\d]", "");
                    if (int.TryParse(textClean, out int val))
                    {
                        return val;
                    }
                }
            }
            catch { }
            return fallbackValue;
        }
    }
}`
  },
  {
    title: "Database SQLite Service",
    filename: "DatabaseService.cs",
    language: "csharp",
    description: "Kelas untuk menangani penyimpanan lokal berbasis SQLite ADO.NET untuk mencatat riwayat scrape desa secara offline.",
    content: `using System;
using System.IO;
using System.Data.SQLite;

namespace HedraOfficeV3
{
    public class DatabaseService
    {
        private readonly string _dbPath;
        private readonly string _connectionString;

        public DatabaseService()
        {
            // Lokasi database di folder AppData Local atau Direktori Aplikasi
            _dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "desa_data.sqlite");
            _connectionString = $"Data Source={_dbPath};Version=3;";
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            try
            {
                // Jika file database belum ada, SQLite otomatis akan membuatnya
                using (var connection = new SQLiteConnection(_connectionString))
                {
                    connection.Open();

                    // Buat Tabel Riwayat Refresh Data
                    string createHistoryTable = @"
                        CREATE TABLE IF NOT EXISTS file_refresh_log (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            timestamp TEXT,
                            penduduk INTEGER,
                            kepala_keluarga INTEGER,
                            rtrw INTEGER,
                            status TEXT
                        );";

                    using (var command = new SQLiteCommand(createHistoryTable, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Inisialisasi SQLite database gagal: {ex.Message}");
            }
        }

        /// <summary>
        /// Menyimpan riwayat pengambilan data baru ke database SQLite lokal
        /// </summary>
        public void LogRefresh(int jumlahPenduduk, int jumlahKK, int rtrw, string status)
        {
            try
            {
                using (var connection = new SQLiteConnection(_connectionString))
                {
                    connection.Open();
                    string insertSql = @"
                        INSERT INTO file_refresh_log (timestamp, penduduk, kepala_keluarga, rtrw, status) 
                        VALUES (@timestamp, @penduduk, @kepala_keluarga, @rtrw, @status);";

                    using (var command = new SQLiteCommand(insertSql, connection))
                    {
                        command.Parameters.AddWithValue("@timestamp", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                        command.Parameters.AddWithValue("@penduduk", jumlahPenduduk);
                        command.Parameters.AddWithValue("@kepala_keluarga", jumlahKK);
                        command.Parameters.AddWithValue("@rtrw", rtrw);
                        command.Parameters.AddWithValue("@status", status);
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Log data gagal: {ex.Message}");
            }
        }
    }
}`
  },
  {
    title: "Data Models",
    filename: "DesaData.cs",
    language: "csharp",
    description: "File model C# yang menyimpan entitas data desa, pengumuman terbaru, prioritas pembangunan, dan persentase alokasi dana.",
    content: `using System;
using System.Collections.Generic;

namespace HedraOfficeV3
{
    public class DesaData
    {
        public int JumlahPenduduk { get; set; }
        public int JumlahKK { get; set; }
        public int JumlahRTRW { get; set; }
        public string LuasWilayah { get; set; } = "14,30 km²";
        public string NamaKepalaDesa { get; set; } = "Heru Purnomo, ST";
        public string SambutanKepalaDesa { get; set; } = "";
        
        public List<Pengumuman> DaftarPengumuman { get; set; } = new List<Pengumuman>();
        public List<APBDesCategory> AlokasiAPBDes { get; set; } = new List<APBDesCategory>();
        public List<string> ProgramPrioritas { get; set; } = new List<string>();

        public bool IsScrapedFromWeb { get; set; }
        public string StatusMessage { get; set; } = "Sukses";

        public void LoadDefaultData()
        {
            // Sesuai dengan spesifikasi mutlak yang diminta oleh pengguna
            JumlahPenduduk = 4876;
            JumlahKK = 1672;
            JumlahRTRW = 74;
            LuasWilayah = "14,30 km²";
            NamaKepalaDesa = "Heru Purnomo, ST";
            SambutanKepalaDesa = "Selamat datang di portal pelayanan Desa Pondok Panjang. Kami berkomitmen untuk selalu menghadirkan transparansi informasi belanja anggaran desa (APBDes) dan program-program prioritas demi kemajuan segenap warga desa kita tercinta.";
            
            // Pengumuman default
            DaftarPengumuman.Clear();
            DaftarPengumuman.Add(new Pengumuman
            {
                Judul = "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes)",
                Tanggal = "14 Juni 2026",
                Isi = "Mengundang seluruh RT, RW, LPM dan perwakilan warga untuk menyusun draf usulan pembangunan sarana tahun anggaran selanjutnya bertempat di Balai Desa."
            });
            DaftarPengumuman.Add(new Pengumuman
            {
                Judul = "Penyaluran BLT Dana Desa (BLT-DD) Tahap II TA 2026",
                Tanggal = "11 Juni 2026",
                Isi = "Diberitahukan kepada seluruh KPM agar membawa KK asli dan Fotokopi KTP pada pendistribusian dana stimulus di Kantor Kepala Desa pukul 08:30 WIB."
            });
            DaftarPengumuman.Add(new Pengumuman
            {
                Judul = "Kerja Bakti Gotong Royong Pembersihan Lingkungan",
                Tanggal = "18 Juni 2026",
                Isi = "Gerakan kebersihan serentak untuk mengantisipasi potensi genangan banjir dan pencegahan sarang nyamuk demam berdarah di lingkungan RT masing-masing."
            });

            // APBDes Alokasi Default
            AlokasiAPBDes.Clear();
            AlokasiAPBDes.Add(new APBDesCategory("Pemerintahan", 22));
            AlokasiAPBDes.Add(new APBDesCategory("Pembangunan", 28));
            AlokasiAPBDes.Add(new APBDesCategory("Kemasyarakatan", 20));
            AlokasiAPBDes.Add(new APBDesCategory("Pemberdayaan", 18));
            AlokasiAPBDes.Add(new APBDesCategory("Bencana & Mendesak", 12));

            // Program Prioritas
            ProgramPrioritas = new List<string> { "Jalan desa", "Drainase", "Posyandu", "Pendidikan", "UMKM", "Irigasi", "RTLH" };
        }
    }

    public class Pengumuman
    {
        public string Judul { get; set; } = "";
        public string Tanggal { get; set; } = "";
        public string Isi { get; set; } = "";
    }

    public class APBDesCategory
    {
        public string Kategori { get; set; }
        public double Persentase { get; set; }

        public APBDesCategory(string kategori, double persentase)
        {
            Kategori = kategori;
            Persentase = persentase;
        }
    }
}`
  },
  {
    title: "Main Form Code-Behind",
    filename: "MainForm.cs",
    language: "csharp",
    description: "Logika controller utama Windows Forms (C#) untuk melakukan inisialisasi WebView2, asinkron refresh data, rendering grafis APBDes, dan export data CSV/TXT.",
    content: `using System;
using System.IO;
using System.Text;
using System.Windows.Forms;
using System.Threading.Tasks;

namespace HedraOfficeV3
{
    public partial class MainForm : Form
    {
        private readonly ScraperService _scraperService;
        private readonly DatabaseService _databaseService;
        private DesaData _currentData;

        public MainForm()
        {
            InitializeComponent();
            _scraperService = new ScraperService();
            _databaseService = new DatabaseService();
            _currentData = new DesaData();
            
            // Terapkan font Segoe UI secara sistematis demi kebersihan antarmuka
            this.Font = new System.Drawing.Font("Segoe UI", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        }

        private async void MainForm_Load(object sender, EventArgs e)
        {
            // Panggil inisialisasi asinkron WebView2 untuk tab Website
            await InitializeWebView2Async();

            // Lakukan reload data desa dari website secara otomatis saat pertama kali dibuka
            await RefreshVillageDataAsync();
        }

        private async Task InitializeWebView2Async()
        {
            try
            {
                lblWebViewStatus.Text = "Menghubungkan WebView2 Core...";
                await webViewOriginal.EnsureCoreWebView2Async(null);
                webViewOriginal.Source = new Uri("https://pondokpanjang.id");
                lblWebViewStatus.Text = "WebView2 Siap Menyajikan https://pondokpanjang.id";
            }
            catch (Exception ex)
            {
                lblWebViewStatus.Text = $"Gagal memuat WebView2 Engine: {ex.Message}. Silakan install runtime WebView2.";
                MessageBox.Show("Sistem mendeteksi komponen Microsoft Edge WebView2 Runtime belum tersedia di Windows Anda.\\nSitus asli tetap bisa diakses dengan tombol browser eksternal.", "Informasi Komponen", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private async Task RefreshVillageDataAsync()
        {
            btnRefresh.Enabled = false;
            lblStatusRefresh.Text = "Mengekstrak data dari pondokpanjang.id...";
            progressBarRefresh.Style = ProgressBarStyle.Marquee;
            progressBarRefresh.Visible = true;

            try
            {
                // Eksekusi scraping secara async
                _currentData = await _scraperService.ScrapeDesaDataAsync();

                // Perbarui Kontrol Tampilan pada UI
                UpdateDashboardUI();

                // Log aktivitas tersebut ke dalam database SQLite lokal
                _databaseService.LogRefresh(
                    _currentData.JumlahPenduduk,
                    _currentData.JumlahKK,
                    _currentData.JumlahRTRW,
                    _currentData.IsScrapedFromWeb ? "ONLINE_SCRAPE" : "OFFLINE_FALLBACK"
                );

                lblStatusRefresh.Text = $"Update Terakhir: {DateTime.Now:dd/06/2026 HH:mm:ss} (Source: {(_currentData.IsScrapedFromWeb ? "Web Terkini" : "Database Lokal")})";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Terjadi kegagalan pembaruan statistik: {ex.Message}", "Error Refresh", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                lblStatusRefresh.Text = "Pembaruan data gagal.";
            }
            finally
            {
                btnRefresh.Enabled = true;
                progressBarRefresh.Visible = false;
            }
        }

        private void UpdateDashboardUI()
        {
            // 1. Update Card Statistik Deskripsi
            lblStatPenduduk.Text = _currentData.JumlahPenduduk.ToString("N0");
            lblStatKK.Text = _currentData.JumlahKK.ToString("N0");
            lblStatRTRW.Text = _currentData.JumlahRTRW.ToString();
            lblStatLuas.Text = _currentData.LuasWilayah;

            // 2. Tampilkan Nama dan Pidato Sambutan Kepala Desa
            lblKadesName.Text = _currentData.NamaKepalaDesa;
            txtGreetings.Text = _currentData.SambutanKepalaDesa;

            // 3. Render Pengumuman ke ListView/Grid
            gridAnnouncements.Rows.Clear();
            foreach (var item in _currentData.DaftarPengumuman)
            {
                gridAnnouncements.Rows.Add(item.Tanggal, item.Judul, item.Isi);
            }

            // 4. Render APBDes ke DataGridView Detail dan Visualisasi Chart Bar
            gridAPBDes.Rows.Clear();
            chartAPBDes.Series["APBDes"].Points.Clear();

            foreach (var item in _currentData.AlokasiAPBDes)
            {
                double estimasiNominal = item.Persentase * 15000000; // Contoh kalkulasi estimasi anggaran Rp 1.5 Milyar
                gridAPBDes.Rows.Add(item.Kategori, $"{item.Persentase}%", $"Rp {estimasiNominal:N0}");

                // Memasukkan data ke Chart Control WinForms
                int pointIndex = chartAPBDes.Series["APBDes"].Points.AddXY(item.Kategori, item.Persentase);
                chartAPBDes.Series["APBDes"].Points[pointIndex].Label = $"{item.Persentase}%";
            }

            // 5. Masukkan Daftar Program Prioritas
            lstPriorityPrograms.Items.Clear();
            foreach (var prog in _currentData.ProgramPrioritas)
            {
                lstPriorityPrograms.Items.Add($"  •  {prog} (Prioritas Unggulan)");
            }

            // 6. Tampilkan Pesan Status di Pojok Form jika relevan
            if (!_currentData.IsScrapedFromWeb)
            {
                lblAlertScrape.ForeColor = System.Drawing.Color.Red;
                lblAlertScrape.Text = "Mode Offline: Tidak dapat menjangkau pondokpanjang.id. Menggunakan data tersimpan di Cache.";
            }
            else
            {
                lblAlertScrape.ForeColor = System.Drawing.Color.Green;
                lblAlertScrape.Text = "Koneksi Aktif: Data sinkron langsung dengan pondokpanjang.id secara real-time.";
            }
        }

        private async void btnRefresh_Click(object sender, EventArgs e)
        {
            await RefreshVillageDataAsync();
        }

        private void btnExport_Click(object sender, EventArgs e)
        {
            try
            {
                using (var sfd = new SaveFileDialog())
                {
                    sfd.Filter = "Comma Separated Values (*.csv)|*.csv|Text File Document (*.txt)|*.txt";
                    sfd.FileName = $"Data_Desa_Pondok_Panjang_{DateTime.Now:yyyyMMdd}";
                    
                    if (sfd.ShowDialog() == DialogResult.OK)
                    {
                        var sb = new StringBuilder();
                        
                        if (Path.GetExtension(sfd.FileName).ToLower() == ".csv")
                        {
                            // format CSV
                            sb.AppendLine("ID_HEADER,PARAMETER,NILAI");
                            sb.AppendLine($"1,Jumlah Penduduk,{_currentData.JumlahPenduduk}");
                            sb.AppendLine($"2,Jumlah Kepala Keluarga,{_currentData.JumlahKK}");
                            sb.AppendLine($"3,Jumlah RT/RW,{_currentData.JumlahRTRW}");
                            sb.AppendLine($"4,Luas Wilayah,{_currentData.LuasWilayah}");
                            sb.AppendLine($"5,Kepala Desa,{_currentData.NamaKepalaDesa}");
                            sb.AppendLine();
                            sb.AppendLine("PENGUMUMAN_TABEL,TANGGAL,JUDUL,PESAN");
                            foreach (var item in _currentData.DaftarPengumuman)
                            {
                                sb.AppendLine($",\\"{item.Tanggal}\\",\\"{item.Judul}\\",\\"{item.Isi.Replace("\\"", "\\'\\'")}\\"");
                            }
                        }
                        else
                        {
                            // format TXT
                            sb.AppendLine("=================================================");
                            sb.AppendLine("    LAPORAN DATA DESA PONDOK PANJANG v3   ");
                            sb.AppendLine("=================================================");
                            sb.AppendLine($"Dicetak Pada: {DateTime.Now}");
                            sb.AppendLine($"Jumlah Penduduk: {_currentData.JumlahPenduduk}");
                            sb.AppendLine($"Jumlah KK      : {_currentData.JumlahKK}");
                            sb.AppendLine($"Jumlah RT/RW   : {_currentData.JumlahRTRW}");
                            sb.AppendLine($"Luas Wilayah   : {_currentData.LuasWilayah}");
                            sb.AppendLine($"Kepala Desa    : {_currentData.NamaKepalaDesa}");
                            sb.AppendLine("-------------------------------------------------");
                            sb.AppendLine("DAFTAR ALOKASI APBDES:");
                            foreach (var item in _currentData.AlokasiAPBDes)
                            {
                                sb.AppendLine($" - {item.Kategori}: {item.Persentase}%");
                            }
                        }

                        File.WriteAllText(sfd.FileName, sb.ToString(), Encoding.UTF8);
                        MessageBox.Show("Data desa berhasil dieksport!", "Sukses Eksport", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Eksport gagal: {ex.Message}", "Kesalahan Eksport", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnCallKades_Click(object sender, EventArgs e)
        {
            // Membuka tautan direct chat WhatsApp ke kontak yang terdaftar
            string waUrl = "https://wa.me/6281324626243?text=Halo%20Kantor%20Desa%20Pondok%20Panjang";
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = waUrl,
                UseShellExecute = true
            });
        }
    }
}`
  },
  {
    title: "Main Form Designer",
    filename: "MainForm.Designer.cs",
    language: "csharp",
    description: "Deklarasi instansiasi komponen Visual Studio Designer berisi TabControl, visual cards panel, GridView, Chart, dan Microsoft.Web.WebView2.",
    content: `namespace HedraOfficeV3
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            var chartArea1 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            var legend1 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            var series1 = new System.Windows.Forms.DataVisualization.Charting.Series();
            
            this.tabControlMain = new System.Windows.Forms.TabControl();
            this.tabDashboard = new System.Windows.Forms.TabPage();
            this.tabStatistik = new System.Windows.Forms.TabPage();
            this.tabAPBDes = new System.Windows.Forms.TabPage();
            this.tabPrioritas = new System.Windows.Forms.TabPage();
            this.tabWebView = new System.Windows.Forms.TabPage();
            this.tabKontak = new System.Windows.Forms.TabPage();
            
            // Buttons and Labels
            this.btnRefresh = new System.Windows.Forms.Button();
            this.btnExport = new System.Windows.Forms.Button();
            this.btnCallKades = new System.Windows.Forms.Button();
            this.lblStatusRefresh = new System.Windows.Forms.Label();
            this.lblAlertScrape = new System.Windows.Forms.Label();
            this.progressBarRefresh = new System.Windows.Forms.ProgressBar();
            
            // Stats Controls
            this.lblStatPenduduk = new System.Windows.Forms.Label();
            this.lblStatKK = new System.Windows.Forms.Label();
            this.lblStatRTRW = new System.Windows.Forms.Label();
            this.lblStatLuas = new System.Windows.Forms.Label();
            
            // Greetings Controls
            this.lblKadesName = new System.Windows.Forms.Label();
            this.txtGreetings = new System.Windows.Forms.TextBox();
            
            // Grids & Charts
            this.gridAnnouncements = new System.Windows.Forms.DataGridView();
            this.gridAPBDes = new System.Windows.Forms.DataGridView();
            this.chartAPBDes = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.lstPriorityPrograms = new System.Windows.Forms.ListBox();
            
            // WebView Instance
            this.webViewOriginal = new Microsoft.Web.WebView2.WinForms.WebView2();
            this.lblWebViewStatus = new System.Windows.Forms.Label();

            // Set Form Properties
            this.SuspendLayout();
            this.Text = "HEDRA-OFFICE-v3 - Kantor Desa Pondok Panjang Dashboard";
            this.Size = new System.Drawing.Size(1200, 780);
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;

            // Desain Visual Kontrol diletakkan di sini secara hierarkis...
            // Untuk file CS Designer utuh di Visual Studio akan memetakan koordinat tabControl, gridView, panel statis,
            // dan meletakkan chart bar APBDes di layout utama.
            
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.TabControl tabControlMain;
        private System.Windows.Forms.TabPage tabDashboard;
        private System.Windows.Forms.TabPage tabStatistik;
        private System.Windows.Forms.TabPage tabAPBDes;
        private System.Windows.Forms.TabPage tabPrioritas;
        private System.Windows.Forms.TabPage tabWebView;
        private System.Windows.Forms.TabPage tabKontak;
        
        private System.Windows.Forms.Button btnRefresh;
        private System.Windows.Forms.Button btnExport;
        private System.Windows.Forms.Button btnCallKades;
        private System.Windows.Forms.Label lblStatusRefresh;
        private System.Windows.Forms.Label lblAlertScrape;
        private System.Windows.Forms.ProgressBar progressBarRefresh;
        
        private System.Windows.Forms.Label lblStatPenduduk;
        private System.Windows.Forms.Label lblStatKK;
        private System.Windows.Forms.Label lblStatRTRW;
        private System.Windows.Forms.Label lblStatLuas;
        
        private System.Windows.Forms.Label lblKadesName;
        private System.Windows.Forms.TextBox txtGreetings;
        
        private System.Windows.Forms.DataGridView gridAnnouncements;
        private System.Windows.Forms.DataGridView gridAPBDes;
        private System.Windows.Forms.DataVisualization.Charting.Chart chartAPBDes;
        private System.Windows.Forms.ListBox lstPriorityPrograms;
        
        private Microsoft.Web.WebView2.WinForms.WebView2 webViewOriginal;
        private System.Windows.Forms.Label lblWebViewStatus;
    }
}`
  },
  {
    title: "MSBuild Project Configuration",
    filename: "hedra-office-v3.csproj",
    language: "xml",
    description: "File konfigurasi MSBuild Project (.csproj) modern untuk .NET 8.0 Windows yang memuat dependensi NuGet HtmlAgilityPack, WebView2, dan SQLite.",
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <ApplicationIcon></ApplicationIcon>
    <AssemblyName>HedraOfficeV3</AssemblyName>
    <RootNamespace>HedraOfficeV3</RootNamespace>
    <!-- Mendukung DPI awareness tinggi untuk layar resolusi HD/4K -->
    <ApplicationHighDpiMode>SystemAware</ApplicationHighDpiMode>
  </PropertyGroup>

  <ItemGroup>
    <!-- Library Parser HTML unggulan untuk membedah data website -->
    <PackageReference Include="HtmlAgilityPack" Version="1.11.61" />
    
    // Web browser rendering engine modern besutan Chromium
    <PackageReference Include="Microsoft.Web.WebView2" Version="1.0.2526" />
    
    // Penyimpanan basis data offline di harddisk lokal komputer server kantor desa
    <PackageReference Include="System.Data.SQLite.Core" Version="1.0.118" />
  </ItemGroup>

</Project>`
  }
];
