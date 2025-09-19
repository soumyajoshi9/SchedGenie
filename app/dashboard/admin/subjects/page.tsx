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
import { Plus, Edit, Trash2, ArrowLeft, BookOpen } from "lucide-react"
import type { Subject, Department } from "@/lib/types"

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "3",
    type: "",
    departmentId: "",
    semester: "1",
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

    setSubjects([
      {
        id: "1",
        name: "Data Structures",
        code: "CS201",
        credits: 4,
        type: "theory",
        departmentId: "1",
        semester: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Database Management Systems",
        code: "CS301",
        credits: 4,
        type: "theory",
        departmentId: "1",
        semester: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSubject) {
      // Update existing subject
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === editingSubject.id
            ? {
                ...subject,
                ...formData,
                credits: Number.parseInt(formData.credits),
                semester: Number.parseInt(formData.semester),
                type: formData.type as any,
                updatedAt: new Date(),
              }
            : subject,
        ),
      )
    } else {
      // Add new subject
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        credits: Number.parseInt(formData.credits),
        type: formData.type as any,
        departmentId: formData.departmentId,
        semester: Number.parseInt(formData.semester),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setSubjects((prev) => [...prev, newSubject])
    }

    setFormData({
      name: "",
      code: "",
      credits: "3",
      type: "",
      departmentId: "",
      semester: "1",
    })
    setEditingSubject(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits.toString(),
      type: subject.type,
      departmentId: subject.departmentId,
      semester: subject.semester.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id))
  }

  const getDepartmentName = (departmentId: string) => {
    return departments.find((d) => d.id === departmentId)?.name || "Unknown"
  }

  const getTypeLabel = (type: string) => {
    const types = {
      theory: "Theory",
      practical: "Practical",
      tutorial: "Tutorial",
    }
    return types[type as keyof typeof types] || type
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
              <BookOpen className="h-6 w-6 text-orange-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Subjects</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingSubject(null)
                    setFormData({
                      name: "",
                      code: "",
                      credits: "3",
                      type: "",
                      departmentId: "",
                      semester: "1",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                  <DialogDescription>
                    {editingSubject
                      ? "Update the subject information below."
                      : "Enter the details for the new subject."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Subject Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Data Structures"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Subject Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., CS201"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="credits">Credits</Label>
                      <Input
                        id="credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData((prev) => ({ ...prev, credits: e.target.value }))}
                        min="1"
                        max="10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Subject Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theory">Theory</SelectItem>
                          <SelectItem value="practical">Practical</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingSubject ? "Update" : "Add"} Subject</Button>
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
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Manage all subjects and course curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-gray-500">{subject.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getDepartmentName(subject.departmentId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(subject.type)}</Badge>
                    </TableCell>
                    <TableCell>{subject.credits}</TableCell>
                    <TableCell>Semester {subject.semester}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(subject.id)}>
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
