"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, ArrowLeft, GraduationCap } from "lucide-react"
import type { Batch, Course, Department } from "@/lib/types"

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    year: "1",
    semester: "1",
    strength: "30",
  })
  const router = useRouter()

  useEffect(() => {
    // Mock data - in production, fetch from API
    setDepartments([
      {
        id: "1",
        name: "Computer Science",
        code: "CS",
        headOfDepartment: "Dr. John Smith",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Electrical Engineering",
        code: "EE",
        headOfDepartment: "Dr. Jane Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    setCourses([
      {
        id: "1",
        name: "Bachelor of Technology",
        code: "BTECH",
        departmentId: "1",
        duration: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Master of Technology",
        code: "MTECH",
        departmentId: "1",
        duration: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    setBatches([
      {
        id: "1",
        name: "CS 3rd Year A",
        courseId: "1",
        year: 3,
        semester: 5,
        strength: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "CS 3rd Year B",
        courseId: "1",
        year: 3,
        semester: 5,
        strength: 42,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBatch) {
      // Update existing batch
      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === editingBatch.id
            ? {
                ...batch,
                ...formData,
                year: Number.parseInt(formData.year),
                semester: Number.parseInt(formData.semester),
                strength: Number.parseInt(formData.strength),
                updatedAt: new Date(),
              }
            : batch,
        ),
      )
    } else {
      // Add new batch
      const newBatch: Batch = {
        id: Date.now().toString(),
        name: formData.name,
        courseId: formData.courseId,
        year: Number.parseInt(formData.year),
        semester: Number.parseInt(formData.semester),
        strength: Number.parseInt(formData.strength),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setBatches((prev) => [...prev, newBatch])
    }

    setFormData({
      name: "",
      courseId: "",
      year: "1",
      semester: "1",
      strength: "30",
    })
    setEditingBatch(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch)
    setFormData({
      name: batch.name,
      courseId: batch.courseId,
      year: batch.year.toString(),
      semester: batch.semester.toString(),
      strength: batch.strength.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBatches((prev) => prev.filter((batch) => batch.id !== id))
  }

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.name || "Unknown"
  }

  const getDepartmentName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return "Unknown"
    return departments.find((d) => d.id === course.departmentId)?.name || "Unknown"
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
              <GraduationCap className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Batches</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingBatch(null)
                    setFormData({
                      name: "",
                      courseId: "",
                      year: "1",
                      semester: "1",
                      strength: "30",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
                  <DialogDescription>
                    {editingBatch ? "Update the batch information below." : "Enter the details for the new batch."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Batch Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., CS 3rd Year A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, courseId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              Year {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="strength">Batch Strength</Label>
                      <Input
                        id="strength"
                        type="number"
                        value={formData.strength}
                        onChange={(e) => setFormData((prev) => ({ ...prev, strength: e.target.value }))}
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingBatch ? "Update" : "Add"} Batch</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Batches</CardTitle>
            <CardDescription>Manage all student batches and sections</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year/Semester</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{getCourseName(batch.courseId)}</TableCell>
                    <TableCell>{getDepartmentName(batch.courseId)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Badge variant="outline">Year {batch.year}</Badge>
                        <Badge variant="outline">Sem {batch.semester}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{batch.strength} students</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(batch)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(batch.id)}>
                          <Trash2 className="h-4 w-4" />
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
