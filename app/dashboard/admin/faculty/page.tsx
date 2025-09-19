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
import { Plus, Edit, Trash2, ArrowLeft, Users } from "lucide-react"
import type { Faculty, Department } from "@/lib/types"

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    departmentId: "",
    designation: "",
    specialization: "",
    maxHoursPerWeek: "20",
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

    setFaculty([
      {
        id: "1",
        name: "Dr. Alice Johnson",
        email: "alice@college.edu",
        employeeId: "FAC001",
        departmentId: "1",
        designation: "Professor",
        specialization: ["Data Structures", "Algorithms"],
        maxHoursPerWeek: 20,
        preferredTimeSlots: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const specializationArray = formData.specialization
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)

    if (editingFaculty) {
      // Update existing faculty
      setFaculty((prev) =>
        prev.map((f) =>
          f.id === editingFaculty.id
            ? {
                ...f,
                ...formData,
                specialization: specializationArray,
                maxHoursPerWeek: Number.parseInt(formData.maxHoursPerWeek),
                updatedAt: new Date(),
              }
            : f,
        ),
      )
    } else {
      // Add new faculty
      const newFaculty: Faculty = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        departmentId: formData.departmentId,
        designation: formData.designation,
        specialization: specializationArray,
        maxHoursPerWeek: Number.parseInt(formData.maxHoursPerWeek),
        preferredTimeSlots: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setFaculty((prev) => [...prev, newFaculty])
    }

    setFormData({
      name: "",
      email: "",
      employeeId: "",
      departmentId: "",
      designation: "",
      specialization: "",
      maxHoursPerWeek: "20",
    })
    setEditingFaculty(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember)
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      employeeId: facultyMember.employeeId,
      departmentId: facultyMember.departmentId,
      designation: facultyMember.designation,
      specialization: facultyMember.specialization.join(", "),
      maxHoursPerWeek: facultyMember.maxHoursPerWeek.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id))
  }

  const getDepartmentName = (departmentId: string) => {
    return departments.find((d) => d.id === departmentId)?.name || "Unknown"
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
              <Users className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Faculty</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingFaculty(null)
                    setFormData({
                      name: "",
                      email: "",
                      employeeId: "",
                      departmentId: "",
                      designation: "",
                      specialization: "",
                      maxHoursPerWeek: "20",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}</DialogTitle>
                  <DialogDescription>
                    {editingFaculty
                      ? "Update the faculty member information below."
                      : "Enter the details for the new faculty member."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Dr. Alice Johnson"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="alice@college.edu"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                        placeholder="FAC001"
                        required
                      />
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Select
                        value={formData.designation}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, designation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxHours">Max Hours Per Week</Label>
                      <Input
                        id="maxHours"
                        type="number"
                        value={formData.maxHoursPerWeek}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maxHoursPerWeek: e.target.value }))}
                        min="1"
                        max="40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g., Data Structures, Algorithms, Machine Learning"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingFaculty ? "Update" : "Add"} Faculty</Button>
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
            <CardTitle>Faculty Members</CardTitle>
            <CardDescription>Manage all faculty members and their information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Max Hours/Week</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((facultyMember) => (
                  <TableRow key={facultyMember.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{facultyMember.name}</div>
                        <div className="text-sm text-gray-500">{facultyMember.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{facultyMember.employeeId}</Badge>
                    </TableCell>
                    <TableCell>{getDepartmentName(facultyMember.departmentId)}</TableCell>
                    <TableCell>{facultyMember.designation}</TableCell>
                    <TableCell>{facultyMember.maxHoursPerWeek}h</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(facultyMember)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(facultyMember.id)}>
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
