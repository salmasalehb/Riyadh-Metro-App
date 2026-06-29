export interface Station {
  id: string;
  name: string;
  nameAr: string;
  lineId: string;
  lineNumber: number;
  lineName: string;
  lineColor: string;
  isInterchange: boolean;
  interchangeLines: string[];
  order: number;
}

export interface MetroLine {
  id: string;
  number: number;
  name: string;
  nameAr: string;
  color: string;
  stations: Station[];
  totalStations: number;
}

const LINES_META = [
  { id: "line1", number: 1, name: "Blue Line", nameAr: "الخط الأزرق", color: "#0066CC" },
  { id: "line2", number: 2, name: "Red Line", nameAr: "الخط الأحمر", color: "#CC0000" },
  { id: "line3", number: 3, name: "Orange Line", nameAr: "الخط البرتقالي", color: "#FF6600" },
  { id: "line4", number: 4, name: "Yellow Line", nameAr: "الخط الأصفر", color: "#CCAA00" },
  { id: "line5", number: 5, name: "Green Line", nameAr: "الخط الأخضر", color: "#009900" },
  { id: "line6", number: 6, name: "Purple Line", nameAr: "الخط البنفسجي", color: "#660099" },
];

const STATION_DATA: Omit<Station, "lineName" | "lineColor">[] = [
  // Line 1 - Blue Line (22 stations) - King Abdulaziz Road corridor
  { id: "l1-s1", lineId: "line1", lineNumber: 1, name: "Al-Olaya/King Abdullah Road", nameAr: "العليا / طريق الملك عبدالله", isInterchange: true, interchangeLines: ["line2"], order: 1 },
  { id: "l1-s2", lineId: "line1", lineNumber: 1, name: "King Fahd Road", nameAr: "طريق الملك فهد", isInterchange: false, interchangeLines: [], order: 2 },
  { id: "l1-s3", lineId: "line1", lineNumber: 1, name: "Al-Maather", nameAr: "المعذر", isInterchange: false, interchangeLines: [], order: 3 },
  { id: "l1-s4", lineId: "line1", lineNumber: 1, name: "Al-Uruba", nameAr: "العروبة", isInterchange: false, interchangeLines: [], order: 4 },
  { id: "l1-s5", lineId: "line1", lineNumber: 1, name: "Al-Nasriya", nameAr: "النصرية", isInterchange: false, interchangeLines: [], order: 5 },
  { id: "l1-s6", lineId: "line1", lineNumber: 1, name: "King Salman Road", nameAr: "طريق الملك سلمان", isInterchange: false, interchangeLines: [], order: 6 },
  { id: "l1-s7", lineId: "line1", lineNumber: 1, name: "Al-Malqa", nameAr: "الملقا", isInterchange: false, interchangeLines: [], order: 7 },
  { id: "l1-s8", lineId: "line1", lineNumber: 1, name: "Tuwaiq", nameAr: "طويق", isInterchange: false, interchangeLines: [], order: 8 },
  { id: "l1-s9", lineId: "line1", lineNumber: 1, name: "KAFD (King Abdullah Financial District)", nameAr: "مركز الملك عبدالله المالي", isInterchange: true, interchangeLines: ["line4"], order: 9 },
  { id: "l1-s10", lineId: "line1", lineNumber: 1, name: "Prince Turki", nameAr: "الأمير تركي", isInterchange: false, interchangeLines: [], order: 10 },
  { id: "l1-s11", lineId: "line1", lineNumber: 1, name: "Al-Aqiq", nameAr: "العقيق", isInterchange: false, interchangeLines: [], order: 11 },
  { id: "l1-s12", lineId: "line1", lineNumber: 1, name: "Al-Oqayr", nameAr: "العقير", isInterchange: false, interchangeLines: [], order: 12 },
  { id: "l1-s13", lineId: "line1", lineNumber: 1, name: "Al-Shura Council", nameAr: "مجلس الشورى", isInterchange: false, interchangeLines: [], order: 13 },
  { id: "l1-s14", lineId: "line1", lineNumber: 1, name: "Prince Bandar", nameAr: "الأمير بندر", isInterchange: false, interchangeLines: [], order: 14 },
  { id: "l1-s15", lineId: "line1", lineNumber: 1, name: "Al-Rawdah", nameAr: "الروضة", isInterchange: false, interchangeLines: [], order: 15 },
  { id: "l1-s16", lineId: "line1", lineNumber: 1, name: "Wa'am", nameAr: "وعم", isInterchange: false, interchangeLines: [], order: 16 },
  { id: "l1-s17", lineId: "line1", lineNumber: 1, name: "Al-Batha", nameAr: "البطحاء", isInterchange: true, interchangeLines: ["line2", "line5"], order: 17 },
  { id: "l1-s18", lineId: "line1", lineNumber: 1, name: "Al-Manakh", nameAr: "المناخ", isInterchange: false, interchangeLines: [], order: 18 },
  { id: "l1-s19", lineId: "line1", lineNumber: 1, name: "Al-Wazarat", nameAr: "الوزارات", isInterchange: false, interchangeLines: [], order: 19 },
  { id: "l1-s20", lineId: "line1", lineNumber: 1, name: "King Abdullah Road", nameAr: "طريق الملك عبدالله", isInterchange: false, interchangeLines: [], order: 20 },
  { id: "l1-s21", lineId: "line1", lineNumber: 1, name: "Jarir Station", nameAr: "محطة جرير", isInterchange: false, interchangeLines: [], order: 21 },
  { id: "l1-s22", lineId: "line1", lineNumber: 1, name: "Al-Dabbab", nameAr: "الضباب", isInterchange: false, interchangeLines: [], order: 22 },

  // Line 2 - Red Line (13 stations) - King Abdullah Road
  { id: "l2-s1", lineId: "line2", lineNumber: 2, name: "Al-Olaya/King Abdullah Road", nameAr: "العليا / طريق الملك عبدالله", isInterchange: true, interchangeLines: ["line1"], order: 1 },
  { id: "l2-s2", lineId: "line2", lineNumber: 2, name: "Prince Mohammed bin Salman", nameAr: "الأمير محمد بن سلمان", isInterchange: false, interchangeLines: [], order: 2 },
  { id: "l2-s3", lineId: "line2", lineNumber: 2, name: "Al-Imam University", nameAr: "جامعة الإمام", isInterchange: false, interchangeLines: [], order: 3 },
  { id: "l2-s4", lineId: "line2", lineNumber: 2, name: "King Saud University", nameAr: "جامعة الملك سعود", isInterchange: false, interchangeLines: [], order: 4 },
  { id: "l2-s5", lineId: "line2", lineNumber: 2, name: "Sulai", nameAr: "السلي", isInterchange: false, interchangeLines: [], order: 5 },
  { id: "l2-s6", lineId: "line2", lineNumber: 2, name: "Al-Hamra", nameAr: "الحمراء", isInterchange: false, interchangeLines: [], order: 6 },
  { id: "l2-s7", lineId: "line2", lineNumber: 2, name: "Al-Faisaliyah", nameAr: "الفيصلية", isInterchange: false, interchangeLines: [], order: 7 },
  { id: "l2-s8", lineId: "line2", lineNumber: 2, name: "Al-Batha", nameAr: "البطحاء", isInterchange: true, interchangeLines: ["line1", "line5"], order: 8 },
  { id: "l2-s9", lineId: "line2", lineNumber: 2, name: "Riyadh Old Airport", nameAr: "المطار القديم", isInterchange: false, interchangeLines: [], order: 9 },
  { id: "l2-s10", lineId: "line2", lineNumber: 2, name: "Al-Dawadmi", nameAr: "الدوادمي", isInterchange: false, interchangeLines: [], order: 10 },
  { id: "l2-s11", lineId: "line2", lineNumber: 2, name: "Al-Shifa", nameAr: "الشفا", isInterchange: false, interchangeLines: [], order: 11 },
  { id: "l2-s12", lineId: "line2", lineNumber: 2, name: "Al-Oud", nameAr: "العود", isInterchange: false, interchangeLines: [], order: 12 },
  { id: "l2-s13", lineId: "line2", lineNumber: 2, name: "Al-Naseem", nameAr: "النسيم", isInterchange: false, interchangeLines: [], order: 13 },

  // Line 3 - Orange Line (11 stations) - Northern Ring Road
  { id: "l3-s1", lineId: "line3", lineNumber: 3, name: "Al-Olaya North", nameAr: "العليا الشمال", isInterchange: false, interchangeLines: [], order: 1 },
  { id: "l3-s2", lineId: "line3", lineNumber: 3, name: "Al-Murabba", nameAr: "المربع", isInterchange: false, interchangeLines: [], order: 2 },
  { id: "l3-s3", lineId: "line3", lineNumber: 3, name: "Al-Dira", nameAr: "الديرة", isInterchange: false, interchangeLines: [], order: 3 },
  { id: "l3-s4", lineId: "line3", lineNumber: 3, name: "Al-Hilal", nameAr: "الهلال", isInterchange: false, interchangeLines: [], order: 4 },
  { id: "l3-s5", lineId: "line3", lineNumber: 3, name: "Al-Zahira", nameAr: "الزاهرة", isInterchange: false, interchangeLines: [], order: 5 },
  { id: "l3-s6", lineId: "line3", lineNumber: 3, name: "Al-Rawdhah", nameAr: "الروضة الشمال", isInterchange: false, interchangeLines: [], order: 6 },
  { id: "l3-s7", lineId: "line3", lineNumber: 3, name: "Ishbiliyah", nameAr: "إشبيلية", isInterchange: false, interchangeLines: [], order: 7 },
  { id: "l3-s8", lineId: "line3", lineNumber: 3, name: "Al-Andalus", nameAr: "الأندلس", isInterchange: false, interchangeLines: [], order: 8 },
  { id: "l3-s9", lineId: "line3", lineNumber: 3, name: "Al-Nuzha", nameAr: "النزهة", isInterchange: false, interchangeLines: [], order: 9 },
  { id: "l3-s10", lineId: "line3", lineNumber: 3, name: "Al-Munsiyah", nameAr: "المنسية", isInterchange: false, interchangeLines: [], order: 10 },
  { id: "l3-s11", lineId: "line3", lineNumber: 3, name: "Al-Sahafah", nameAr: "الصحافة", isInterchange: false, interchangeLines: [], order: 11 },

  // Line 4 - Yellow Line (4 stations) - Airport connector
  { id: "l4-s1", lineId: "line4", lineNumber: 4, name: "KAFD (King Abdullah Financial District)", nameAr: "مركز الملك عبدالله المالي", isInterchange: true, interchangeLines: ["line1"], order: 1 },
  { id: "l4-s2", lineId: "line4", lineNumber: 4, name: "Airport Terminal 1 & 2", nameAr: "صالة 1 و 2 المطار", isInterchange: false, interchangeLines: [], order: 2 },
  { id: "l4-s3", lineId: "line4", lineNumber: 4, name: "Airport Terminal 3 & 4", nameAr: "صالة 3 و 4 المطار", isInterchange: false, interchangeLines: [], order: 3 },
  { id: "l4-s4", lineId: "line4", lineNumber: 4, name: "Airport Terminal 5", nameAr: "صالة 5 المطار", isInterchange: false, interchangeLines: [], order: 4 },

  // Line 5 - Green Line (11 stations) - Western corridor
  { id: "l5-s1", lineId: "line5", lineNumber: 5, name: "Al-Batha", nameAr: "البطحاء", isInterchange: true, interchangeLines: ["line1", "line2"], order: 1 },
  { id: "l5-s2", lineId: "line5", lineNumber: 5, name: "Al-Mazloum", nameAr: "المظلوم", isInterchange: false, interchangeLines: [], order: 2 },
  { id: "l5-s3", lineId: "line5", lineNumber: 5, name: "Al-Qadisiyah", nameAr: "القادسية", isInterchange: false, interchangeLines: [], order: 3 },
  { id: "l5-s4", lineId: "line5", lineNumber: 5, name: "Al-Futah", nameAr: "الفطة", isInterchange: false, interchangeLines: [], order: 4 },
  { id: "l5-s5", lineId: "line5", lineNumber: 5, name: "Al-Mansour", nameAr: "المنصور", isInterchange: false, interchangeLines: [], order: 5 },
  { id: "l5-s6", lineId: "line5", lineNumber: 5, name: "Al-Wurud", nameAr: "الورود", isInterchange: false, interchangeLines: [], order: 6 },
  { id: "l5-s7", lineId: "line5", lineNumber: 5, name: "Prince Abdulaziz bin Musaed", nameAr: "الأمير عبدالعزيز بن مساعد", isInterchange: false, interchangeLines: [], order: 7 },
  { id: "l5-s8", lineId: "line5", lineNumber: 5, name: "Al-Khalidiyah", nameAr: "الخالدية", isInterchange: false, interchangeLines: [], order: 8 },
  { id: "l5-s9", lineId: "line5", lineNumber: 5, name: "Al-Aziziyah", nameAr: "العزيزية", isInterchange: false, interchangeLines: [], order: 9 },
  { id: "l5-s10", lineId: "line5", lineNumber: 5, name: "Dirab", nameAr: "ضرما", isInterchange: false, interchangeLines: [], order: 10 },
  { id: "l5-s11", lineId: "line5", lineNumber: 5, name: "Al-Ghirnatah", nameAr: "غرناطة", isInterchange: false, interchangeLines: [], order: 11 },

  // Line 6 - Purple Line (2 stations) - Eastern corridor
  { id: "l6-s1", lineId: "line6", lineNumber: 6, name: "Al-Batha East", nameAr: "البطحاء الشرق", isInterchange: false, interchangeLines: [], order: 1 },
  { id: "l6-s2", lineId: "line6", lineNumber: 6, name: "Al-Janadriyah", nameAr: "الجنادرية", isInterchange: false, interchangeLines: [], order: 2 },
];

// Build full station objects with lineName and lineColor
export const ALL_STATIONS: Station[] = STATION_DATA.map((s) => {
  const meta = LINES_META.find((l) => l.id === s.lineId)!;
  return { ...s, lineName: meta.name, lineColor: meta.color };
});

export const ALL_LINES: MetroLine[] = LINES_META.map((meta) => {
  const stations = ALL_STATIONS.filter((s) => s.lineId === meta.id);
  return { ...meta, stations, totalStations: stations.length };
});

export function getStationById(id: string): Station | undefined {
  return ALL_STATIONS.find((s) => s.id === id);
}
