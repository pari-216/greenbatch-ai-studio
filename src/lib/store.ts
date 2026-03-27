// Session & data store for GreenBatch AI

export interface Medicine {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  idealConditions: {
    tempRange: string;
    pressureRange: string;
    moisture: string;
    processTime: string;
  };
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  scale: string;
  medicines: Medicine[];
}

export interface Session {
  companyId: string;
  companyName: string;
  role: 'Manager' | 'Operator' | 'Production';
}

const defaultMedicines: Medicine[] = [
  {
    id: 'm1', name: 'Aspirin', status: 'active',
    idealConditions: { tempRange: '25–32°C', pressureRange: '1.1–1.6 bar', moisture: '53.5%', processTime: '84 min' },
  },
  {
    id: 'm2', name: 'Ibuprofen', status: 'active',
    idealConditions: { tempRange: '20–28°C', pressureRange: '1.0–1.4 bar', moisture: '48.0%', processTime: '72 min' },
  },
  {
    id: 'm3', name: 'Paracetamol', status: 'active',
    idealConditions: { tempRange: '22–30°C', pressureRange: '1.2–1.8 bar', moisture: '50.0%', processTime: '90 min' },
  },
];

const presetCompanies: Company[] = [
  { id: 'PH123', name: 'PharmaCorp', industry: 'Pharma', scale: 'Large', medicines: [...defaultMedicines] },
  { id: 'ML456', name: 'MedLife Labs', industry: 'Pharma', scale: 'Medium', medicines: [...defaultMedicines] },
  { id: 'BG789', name: 'BioGen Industries', industry: 'Chemicals', scale: 'Large', medicines: [...defaultMedicines] },
];

// Helpers for random variation
export function randomVariation(base: number, range: number): number {
  return +(base + (Math.random() * 2 - 1) * range).toFixed(1);
}

export function getSuccessRate(medicineId: string): number {
  const bases: Record<string, number> = { m1: 83, m2: 80, m3: 87 };
  return randomVariation(bases[medicineId] ?? 82, 3);
}

export function getQualityScore(medicineId: string): number {
  const bases: Record<string, number> = { m1: 92, m2: 85, m3: 86 };
  return Math.round(randomVariation(bases[medicineId] ?? 85, 5));
}

export function getRiskLevel(successRate: number): 'Low' | 'Medium' | 'High' {
  if (successRate >= 85) return 'Low';
  if (successRate >= 75) return 'Medium';
  return 'High';
}

export function getRealtimeData() {
  return {
    temperature: randomVariation(27, 3),
    pressure: randomVariation(1.3, 0.2),
    moisture: randomVariation(54, 4),
    elapsed: Math.round(randomVariation(60, 15)),
  };
}

const optimizationSuggestions = [
  ['Reduce temperature by 2°C', 'Increase drying time by 5 min', 'Optimize batch size by 5%'],
  ['Increase pressure by 0.1 bar', 'Reduce moisture input by 3%', 'Extend mixing phase by 2 min'],
  ['Lower cooling rate by 1°C/min', 'Adjust pH to 6.8', 'Pre-heat raw materials to 25°C'],
];

export function getOptimizationSuggestions(): string[] {
  return optimizationSuggestions[Math.floor(Math.random() * optimizationSuggestions.length)];
}

export function getSustainabilityMetrics() {
  return {
    wasteReduction: randomVariation(17, 4),
    energySaved: randomVariation(15, 3),
    efficiencyGain: randomVariation(12, 3),
  };
}

// Company CRUD
function loadCompanies(): Company[] {
  const stored = localStorage.getItem('gb_companies');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('gb_companies', JSON.stringify(presetCompanies));
  return [...presetCompanies];
}

function saveCompanies(companies: Company[]) {
  localStorage.setItem('gb_companies', JSON.stringify(companies));
}

export function getCompanies(): Company[] { return loadCompanies(); }

export function findCompany(id: string): Company | undefined {
  return loadCompanies().find(c => c.id === id);
}

export function createCompany(name: string, industry: string, scale: string, medicineNames: string[]): Company {
  const companies = loadCompanies();
  const prefix = name.substring(0, 2).toUpperCase();
  const num = Math.floor(100 + Math.random() * 900);
  const id = `${prefix}${num}`;
  const medicines: Medicine[] = medicineNames.map((n, i) => ({
    id: `m_${Date.now()}_${i}`,
    name: n,
    status: 'active',
    idealConditions: {
      tempRange: `${20 + Math.floor(Math.random() * 5)}–${28 + Math.floor(Math.random() * 5)}°C`,
      pressureRange: `${(1.0 + Math.random() * 0.3).toFixed(1)}–${(1.4 + Math.random() * 0.4).toFixed(1)} bar`,
      moisture: `${(45 + Math.random() * 10).toFixed(1)}%`,
      processTime: `${60 + Math.floor(Math.random() * 40)} min`,
    },
  }));
  const company: Company = { id, name, industry, scale, medicines };
  companies.push(company);
  saveCompanies(companies);
  return company;
}

export function addMedicineToCompany(companyId: string, medicineName: string): Medicine | null {
  const companies = loadCompanies();
  const company = companies.find(c => c.id === companyId);
  if (!company) return null;
  const med: Medicine = {
    id: `m_${Date.now()}`,
    name: medicineName,
    status: 'active',
    idealConditions: {
      tempRange: `${20 + Math.floor(Math.random() * 5)}–${28 + Math.floor(Math.random() * 5)}°C`,
      pressureRange: `${(1.0 + Math.random() * 0.3).toFixed(1)}–${(1.4 + Math.random() * 0.4).toFixed(1)} bar`,
      moisture: `${(45 + Math.random() * 10).toFixed(1)}%`,
      processTime: `${60 + Math.floor(Math.random() * 40)} min`,
    },
  };
  company.medicines.push(med);
  saveCompanies(companies);
  return med;
}

// Session
export function getSession(): Session | null {
  const s = sessionStorage.getItem('gb_session');
  return s ? JSON.parse(s) : null;
}

export function setSession(session: Session) {
  sessionStorage.setItem('gb_session', JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem('gb_session');
}

// Alerts
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  medicine: string;
  acknowledged: boolean;
}

export function getAlerts(): Alert[] {
  return [
    { id: 'a1', title: 'Temperature variance detected', description: 'Reduce temperature by 2°C', severity: 'Medium', medicine: 'Aspirin', acknowledged: false },
    { id: 'a2', title: 'Pressure threshold approaching', description: 'Monitor pressure levels', severity: 'Low', medicine: 'Ibuprofen', acknowledged: false },
  ];
}
