export interface VillageHead {
  name: string;
  title: string;
  greetings: string;
}

export interface VillageMetadata {
  name: string;
  subdistrict: string;
  regency: string;
  province: string;
  head: VillageHead;
}

export interface VillageStats {
  population: number;
  families: number;
  rtrw: number;
  areaSize: string;
  growthRate: string;
  malePopulation: number;
  femalePopulation: number;
}

export interface ApbdesCategory {
  category: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface PriorityProgram {
  code: string;
  name: string;
  desc: string;
  status: string;
  cost: number;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  content: string;
  author: string;
}

export interface GalleryItem {
  title: string;
  date: string;
  url: string;
}

export interface ContactsInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface DesaDataResponse {
  timestamp: string;
  sourceUrl: string;
  status: string;
  villageMetadata: VillageMetadata;
  stats: VillageStats;
  apbdes: ApbdesCategory[];
  priorityPrograms: PriorityProgram[];
  announcements: Announcement[];
  gallery: GalleryItem[];
  contacts: ContactsInfo;
  isScrapedReal?: boolean;
  status_msg?: string;
}

export interface SqlQueryLog {
  timestamp: string;
  query: string;
  status: "success" | "error";
  rowsAffected: number;
}
