"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Download, Shield, Zap, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"
import { getProxyFiles, type ProxyFile } from "@/lib/proxy-store"

export default function FreeProxyPage() {
  const [proxyFiles, setProxyFiles] = useState<ProxyFile[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all")

  useEffect(() => {
    setProxyFiles(getProxyFiles())
  }, [])

  const refreshData = () => {
    setProxyFiles(getProxyFiles())
  }

  const filteredFiles = proxyFiles.filter((file) => {
    if (filter === "all") return true
    if (filter === "active") return file.status === "active" || file.status === "updating"
    return file.status === "expired"
  })

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
            <Clock className="h-3 w-3 animate-spin" />
            Updating
          </Badge>
        )
    }
  }

  const handleDownload = (file: ProxyFile) => {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, "_blank")
    }
  }

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
                <h1 className="text-xl font-bold text-foreground">Free Proxy List</h1>
                <p className="text-sm text-muted-foreground">Daily updated proxy files</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Free Proxy Lists Updated Daily</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Download fresh proxy lists every day. All proxies are tested and verified for speed and anonymity.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Verified Proxies</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-accent" />
                <span>Fast Speed</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
                <span>Daily Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Files</p>
                    <p className="text-2xl font-bold text-foreground">{proxyFiles.length}</p>
                  </div>
                  <Download className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Lists</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {proxyFiles.filter((f) => f.status === "active" || f.status === "updating").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expired Lists</p>
                    <p className="text-2xl font-bold text-red-400">
                      {proxyFiles.filter((f) => f.status === "expired").length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Proxy File List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Proxy File Downloads</CardTitle>
                  <CardDescription>Download proxy lists by date</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "expired" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("expired")}
                  >
                    Expired
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Proxy Table */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">File Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          No proxy files available
                        </td>
                      </tr>
                    ) : (
                      filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-foreground">{file.date}</td>
                          <td className="px-4 py-3 font-mono text-sm text-foreground">{file.fileName}</td>
                          <td className="px-4 py-3">{getStatusBadge(file.status)}</td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(file)}
                              disabled={file.status === "updating"}
                              className="hover:bg-primary/20 gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Free Proxy List - Updated Daily</p>
          <p className="mt-2">All proxies are provided for educational purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
