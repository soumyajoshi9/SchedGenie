"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, ArrowLeft, Plus, Eye, Download, CheckCircle, AlertCircle } from "lucide-react"
import type { Timetable } from "@/lib/types"

export default function TimetablesPage() {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const router = useRouter()

  useEffect(() => {
    // Mock data - in production, fetch from API
    setTimetables([
      {
        id: "1",
        name: "Timetable 2024-25 - Semester 5",
        academicYear: "2024-25",
        semester: 5,
        status: "published",
        entries: [],
        constraints: {} as any,
        createdBy: "admin",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        name: "Timetable 2024-25 - Semester 3",
        academicYear: "2024-25",
        semester: 3,
        status: "approved",
        entries: [],
        constraints: {} as any,
        createdBy: "admin",
        approvedBy: "admin",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        name: "Timetable 2024-25 - Semester 1",
        academicYear: "2024-25",
        semester: 1,
        status: "draft",
        entries: [],
        constraints: {} as any,
        createdBy: "admin",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ])
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "under_review":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "approved":
        return "secondary"
      case "under_review":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => router.push("/dashboard/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Clock className="h-6 w-6 text-teal-600" />
              <h1 className="text-xl font-semibold text-gray-900">Timetable Management</h1>
            </div>
            <Button onClick={() => router.push("/dashboard/admin/timetables/generate")}>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Timetable
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Timetables</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.filter((t) => t.status === "published").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.filter((t) => t.status === "under_review").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timetables.filter((t) => t.status === "draft").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Timetables Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Timetables</CardTitle>
            <CardDescription>Manage and review all generated timetables</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timetable</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetables.map((timetable) => (
                  <TableRow key={timetable.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(timetable.status)}
                        <span className="font-medium">{timetable.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{timetable.academicYear}</TableCell>
                    <TableCell>Semester {timetable.semester}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(timetable.status) as any}>
                        {timetable.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{timetable.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admin/timetables/${timetable.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
