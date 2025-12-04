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
    date: "2024-12-04",
    fileName: "proxy_list_2024-12-04.txt",
    downloadUrl: "https://example.com/proxy_list_2024-12-04.txt",
    status: "active",
  },
  {
    id: "2",
    date: "2024-12-03",
    fileName: "proxy_list_2024-12-03.txt",
    downloadUrl: "https://example.com/proxy_list_2024-12-03.txt",
    status: "active",
  },
  {
    id: "3",
    date: "2024-12-02",
    fileName: "proxy_list_2024-12-02.txt",
    downloadUrl: "https://example.com/proxy_list_2024-12-02.txt",
    status: "expired",
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
