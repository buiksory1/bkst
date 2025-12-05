export interface ProxyFile {
  id: string
  date: string
  fileName: string
  downloadUrl: string
  status: "active" | "expired" | "updating"
}

// Fallback default data
const defaultProxyFiles: ProxyFile[] = [
  {
    id: "1",
    date: "2025-12-04",
    fileName: "Proxy US 04-12-2025.xlsx",
    downloadUrl: "https://dl.surf/file/ebcf7e3e",
    status: "active",
  },
]

export async function getProxyFiles(): Promise<ProxyFile[]> {
  try {
    const response = await fetch("/api/proxy-files")
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching proxy files:", error)
    return defaultProxyFiles
  }
}

export async function addProxyFile(file: Omit<ProxyFile, "id">): Promise<ProxyFile> {
  try {
    const response = await fetch("/api/proxy-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(file),
    })
    if (!response.ok) throw new Error("Failed to add file")
    return await response.json()
  } catch (error) {
    console.error("[v0] Error adding proxy file:", error)
    throw error
  }
}

export async function updateProxyFile(id: string, updates: Partial<ProxyFile>): Promise<void> {
  try {
    const response = await fetch("/api/proxy-files", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    })
    if (!response.ok) throw new Error("Failed to update file")
  } catch (error) {
    console.error("[v0] Error updating proxy file:", error)
    throw error
  }
}

export async function deleteProxyFile(id: string): Promise<void> {
  try {
    const response = await fetch("/api/proxy-files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error("Failed to delete file")
  } catch (error) {
    console.error("[v0] Error deleting proxy file:", error)
    throw error
  }
}
