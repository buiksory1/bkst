"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Lock,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import type { ProxyFile } from "@/lib/proxy-store"
import Link from "next/link"

const ADMIN_PASSWORD = "Tuan250596@" // Change this password

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [proxyFiles, setProxyFiles] = useState<ProxyFile[]>([])
  const [editingFile, setEditingFile] = useState<ProxyFile | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newFile, setNewFile] = useState({
    date: "",
    fileName: "",
    downloadUrl: "",
    status: "active" as ProxyFile["status"],
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/proxy-files")
      const data = await response.json()
      setProxyFiles(data)
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [fetchData])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_auth", "true")
      setPasswordError("")
      fetchData()
    } else {
      setPasswordError("Incorrect password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_auth")
    setPassword("")
  }

  const refreshData = () => {
    fetchData()
  }

  const handleAddFile = async () => {
    if (!newFile.date || !newFile.fileName || !newFile.downloadUrl) {
      alert("Please fill in all fields")
      return
    }
    try {
      await fetch("/api/proxy-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFile),
      })
      setNewFile({ date: "", fileName: "", downloadUrl: "", status: "active" })
      setIsAdding(false)
      await refreshData()
    } catch (error) {
      alert("Failed to add file")
    }
  }

  const handleUpdateFile = async () => {
    if (!editingFile) return
    try {
      await fetch(`/api/proxy-files/${editingFile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingFile),
      })
      setEditingFile(null)
      await refreshData()
    } catch (error) {
      alert("Failed to update file")
    }
  }

  const handleDeleteFile = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fetch(`/api/proxy-files/${id}`, {
          method: "DELETE",
        })
        await refreshData()
      } catch (error) {
        alert("Failed to delete file")
      }
    }
  }

  const getStatusBadge = (status: ProxyFile["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        )
      case "updating":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updating
          </Badge>
        )
    }
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-primary/20 w-fit mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-foreground">Admin Login</CardTitle>
            <CardDescription>Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-background border-border"
                />
                {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
              <Link href="/">
                <Button variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage proxy files</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Proxy Files</CardTitle>
                <CardDescription>Add, edit, or delete proxy file entries</CardDescription>
              </div>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add New File Form */}
            {isAdding && (
              <Card className="mb-6 bg-muted/30 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Add New Proxy File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-date">Date</Label>
                      <Input
                        id="new-date"
                        type="date"
                        value={newFile.date}
                        onChange={(e) => setNewFile({ ...newFile, date: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-name">File Name</Label>
                      <Input
                        id="new-name"
                        placeholder="proxy_list_2024-12-04.txt"
                        value={newFile.fileName}
                        onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="new-url">Download URL</Label>
                      <Input
                        id="new-url"
                        placeholder="https://example.com/proxy_list.txt"
                        value={newFile.downloadUrl}
                        onChange={(e) => setNewFile({ ...newFile, downloadUrl: e.target.value })}
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-status">Status</Label>
                      <select
                        id="new-status"
                        value={newFile.status}
                        onChange={(e) => setNewFile({ ...newFile, status: e.target.value as ProxyFile["status"] })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="updating">Updating</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddFile} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)} className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Files Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Download URL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {proxyFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No proxy files. Click "Add New" to create one.
                      </td>
                    </tr>
                  ) : (
                    proxyFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-muted/30 transition-colors">
                        {editingFile?.id === file.id ? (
                          <>
                            <td className="px-4 py-3">
                              <Input
                                type="date"
                                value={editingFile.date}
                                onChange={(e) => setEditingFile({ ...editingFile, date: e.target.value })}
                                className="bg-background border-border w-36"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingFile.fileName}
                                onChange={(e) => setEditingFile({ ...editingFile, fileName: e.target.value })}
                                className="bg-background border-border"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editingFile.downloadUrl}
                                onChange={(e) => setEditingFile({ ...editingFile, downloadUrl: e.target.value })}
                                className="bg-background border-border"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={editingFile.status}
                                onChange={(e) =>
                                  setEditingFile({ ...editingFile, status: e.target.value as ProxyFile["status"] })
                                }
                                className="px-2 py-1 bg-background border border-border rounded text-foreground text-sm"
                              >
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="updating">Updating</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleUpdateFile} className="gap-1">
                                  <Save className="h-3 w-3" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingFile(null)}
                                  className="gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-sm text-foreground">{file.date}</td>
                            <td className="px-4 py-3 font-mono text-sm text-foreground">{file.fileName}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                              {file.downloadUrl}
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(file.status)}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingFile(file)}
                                  className="gap-1 hover:bg-primary/20"
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="gap-1 hover:bg-red-500/20 text-red-400"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
