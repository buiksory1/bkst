// Proxy file data store using localStorage

export interface ProxyFile {
  id: string
  date: string
  fileName: string
  downloadUrl: string
  status: "active" | "expired" | "updating"
}

const STORAGE_KEY = "proxy_files"

// Default sample data
const defaultProxyFiles: ProxyFile[] = [
  {
    id: "1",
    date: "2025-12-04",
    fileName: "Proxy US 04-12-2025.xlsx",
    downloadUrl: "https://dl.surf/file/ebcf7e3e",
    status: "active",
  },
]

export function getProxyFiles(): ProxyFile[] {
  if (typeof window === "undefined") return defaultProxyFiles

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProxyFiles))
    return defaultProxyFiles
  }
  return JSON.parse(stored)
}

export function saveProxyFiles(files: ProxyFile[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
}

export function addProxyFile(file: Omit<ProxyFile, "id">): ProxyFile {
  const files = getProxyFiles()
  const newFile: ProxyFile = {
    ...file,
    id: Date.now().toString(),
  }
  files.unshift(newFile)
  saveProxyFiles(files)
  return newFile
}

export function updateProxyFile(id: string, updates: Partial<ProxyFile>): void {
  const files = getProxyFiles()
  const index = files.findIndex((f) => f.id === id)
  if (index !== -1) {
    files[index] = { ...files[index], ...updates }
    saveProxyFiles(files)
  }
}

export function deleteProxyFile(id: string): void {
  const files = getProxyFiles()
  const filtered = files.filter((f) => f.id !== id)
  saveProxyFiles(filtered)
}
