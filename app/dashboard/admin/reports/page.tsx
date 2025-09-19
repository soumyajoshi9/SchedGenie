"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, BarChart3, Download, Users, Building2, TrendingUp, FileText, Calendar } from "lucide-react"
import { generateClassroomUtilization, generateFacultyWorkload, downloadCSV } from "@/lib/export-utils"
import type { Timetable } from "@/lib/types"

export default function ReportsPage() {
  const [selectedTimetable, setSelectedTimetable] = useState<string>("")
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [classroomUtilization, setClassroomUtilization] = useState<any>({})
  const [facultyWorkload, setFacultyWorkload] = useState<any>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  // Mock data
  const mockTimetables: Timetable[] = [
    {
      id: "1",
      name: "Timetable 2024-25 - Semester 5",
      academicYear: "2024-25",
      semester: 5,
      status: "published",
      entries: [],
      constraints: {} as any,
      createdBy: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockClassrooms = [
    { id: "1", name: "Room 101", code: "R101", capacity: 60, type: "lecture_hall" },
    { id: "2", name: "Lab 201", code: "L201", capacity: 30, type: "lab" },
    { id: "3", name: "Room 102", code: "R102", capacity: 50, type: "lecture_hall" },
  ]

  const mockFaculty = [
    { id: "1", name: "Dr. Alice Johnson", employeeId: "FAC001" },
    { id: "2", name: "Dr. Bob Smith", employeeId: "FAC002" },
    { id: "3", name: "Dr. Carol Davis", employeeId: "FAC003" },
  ]

  useEffect(() => {
    setTimetables(mockTimetables)
  }, [])

  const handleTimetableSelect = (timetableId: string) => {
    setSelectedTimetable(timetableId)
    const timetable = timetables.find((t) => t.id === timetableId)
    if (timetable) {
      generateReports(timetable)
    }
  }

  const generateReports = (timetable: Timetable) => {
    setIsGenerating(true)

    // Mock report generation
    setTimeout(() => {
      // Generate classroom utilization
      const utilization = generateClassroomUtilization(timetable, { classrooms: mockClassrooms })
      setClassroomUtilization(utilization)

      // Generate faculty workload
      const workload = generateFacultyWorkload(timetable, { faculty: mockFaculty })
      setFacultyWorkload(workload)

      setIsGenerating(false)
    }, 1000)
  }

  const handleExportCSV = () => {
    const timetable = timetables.find((t) => t.id === selectedTimetable)
    if (timetable) {
      downloadCSV(timetable, {
        subjects: [],
        faculty: mockFaculty,
        classrooms: mockClassrooms,
        batches: [],
      })
    }
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-green-600"
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
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Reports & Analytics</h1>
            </div>
            {selectedTimetable && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timetable Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Timetable</CardTitle>
            <CardDescription>Choose a timetable to generate reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTimetable} onValueChange={handleTimetableSelect}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a timetable" />
              </SelectTrigger>
              <SelectContent>
                {timetables.map((timetable) => (
                  <SelectItem key={timetable.id} value={timetable.id}>
                    {timetable.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedTimetable && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Per week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faculty Utilization</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">Average workload</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72%</div>
                  <p className="text-xs text-muted-foreground">Average usage</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92</div>
                  <p className="text-xs text-muted-foreground">Out of 100</p>
                </CardContent>
              </Card>
            </div>

            {/* Classroom Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Classroom Utilization</span>
                </CardTitle>
                <CardDescription>Usage statistics for all classrooms</CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Generating reports...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Hours Used</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockClassrooms.map((classroom) => {
                        const util = classroomUtilization[classroom.id] || { used: 0, total: 30, percentage: 0 }
                        return (
                          <TableRow key={classroom.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{classroom.name}</div>
                                <div className="text-sm text-gray-500">{classroom.code}</div>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{classroom.type.replace("_", " ")}</TableCell>
                            <TableCell>{classroom.capacity} seats</TableCell>
                            <TableCell>
                              {util.used}/{util.total}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={util.percentage} className="w-16" />
                                <span className={`text-sm font-medium ${getUtilizationColor(util.percentage)}`}>
                                  {util.percentage}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  util.percentage >= 80
                                    ? "destructive"
                                    : util.percentage >= 60
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {util.percentage >= 80 ? "High" : util.percentage >= 60 ? "Medium" : "Low"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Faculty Workload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Faculty Workload</span>
                </CardTitle>
                <CardDescription>Teaching hours and class distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Classes/Week</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Workload</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFaculty.map((faculty) => {
                      const workload = facultyWorkload[faculty.id] || { hours: 0, classes: 0, subjects: new Set() }
                      const workloadPercentage = Math.min((workload.hours / 20) * 100, 100)
                      return (
                        <TableRow key={faculty.id}>
                          <TableCell className="font-medium">{faculty.name}</TableCell>
                          <TableCell>{faculty.employeeId}</TableCell>
                          <TableCell>{workload.classes}</TableCell>
                          <TableCell>{workload.subjects.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={workloadPercentage} className="w-16" />
                              <span className="text-sm">{workload.hours}h</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                workloadPercentage >= 90
                                  ? "destructive"
                                  : workloadPercentage >= 70
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {workloadPercentage >= 90 ? "Overloaded" : workloadPercentage >= 70 ? "Optimal" : "Light"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download timetable data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={handleExportCSV} className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Export to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
