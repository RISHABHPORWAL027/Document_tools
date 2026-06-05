export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  taxId?: string; // PAN/VAT or other tax identifier
  bankAccount?: string;
  salary?: string;
}

const STORAGE_KEY = 'savedPersons';

export function getAllPersons(): Person[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAllPersons(list: Person[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function addPerson(p: Person) {
  const list = getAllPersons();
  list.push(p);
  saveAllPersons(list);
}

export function updatePerson(updated: Person) {
  const list = getAllPersons().map((p) => (p.id === updated.id ? updated : p));
  saveAllPersons(list);
}

export function deletePerson(id: string) {
  const list = getAllPersons().filter((p) => p.id !== id);
  saveAllPersons(list);
}
