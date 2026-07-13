import { openDB, type IDBPDatabase } from "idb";

export interface Profile {
  id: string;
  name: string; // label like "Personal"
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  mobile: string;
  workPhone: string;
  fax: string;
  email: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  updatedAt: number;
}

const DB_NAME = "contactqr";
const STORE = "profiles";
const META = "meta";

let dbPromise: Promise<IDBPDatabase> | null = null;
function db() {
  if (typeof indexedDB === "undefined")
    throw new Error("IndexedDB unavailable");
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE))
          d.createObjectStore(STORE, { keyPath: "id" });
        if (!d.objectStoreNames.contains(META)) d.createObjectStore(META);
      },
    });
  }
  return dbPromise;
}

export function emptyProfile(name = "Personal"): Profile {
  return {
    id: crypto.randomUUID(),
    name,
    firstName: "",
    lastName: "",
    company: "",
    title: "",
    mobile: "",
    workPhone: "",
    fax: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    updatedAt: Date.now(),
  };
}

export async function listProfiles(): Promise<Profile[]> {
  const d = await db();
  const all = await d.getAll(STORE);
  return (all as Profile[]).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const d = await db();
  return (await d.get(STORE, id)) as Profile | undefined;
}

export async function saveProfile(p: Profile) {
  const d = await db();
  p.updatedAt = Date.now();
  await d.put(STORE, p);
  return p;
}

export async function deleteProfile(id: string) {
  const d = await db();
  await d.delete(STORE, id);
  const active = await getActiveId();
  if (active === id) await setActiveId(null);
}

export async function duplicateProfile(id: string): Promise<Profile | null> {
  const p = await getProfile(id);
  if (!p) return null;
  const copy: Profile = {
    ...p,
    id: crypto.randomUUID(),
    name: p.name + " Copy",
    updatedAt: Date.now(),
  };
  await saveProfile(copy);
  return copy;
}

export async function getActiveId(): Promise<string | null> {
  const d = await db();
  return ((await d.get(META, "activeId")) as string | null) ?? null;
}

export async function setActiveId(id: string | null) {
  const d = await db();
  if (id === null) await d.delete(META, "activeId");
  else await d.put(META, id, "activeId");
}
