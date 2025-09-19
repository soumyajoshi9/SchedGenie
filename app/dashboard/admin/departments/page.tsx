"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, ArrowLeft, Building2 } from "lucide-react"
import type { Department } from "@/lib/types"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    headOfDepartment: "",
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
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDepartment) {
      // Update existing department
      setDepartments((prev) =>
        prev.map((dept) => (dept.id === editingDepartment.id ? { ...dept, ...formData, updatedAt: new Date() } : dept)),
      )
    } else {
      // Add new department
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setDepartments((prev) => [...prev, newDepartment])
    }

    setFormData({ name: "", code: "", headOfDepartment: "" })
    setEditingDepartment(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      headOfDepartment: department.headOfDepartment || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id))
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
              <Building2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Departments</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingDepartment(null)
                    setFormData({ name: "", code: "", headOfDepartment: "" })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
                  <DialogDescription>
                    {editingDepartment
                      ? "Update the department information below."
                      : "Enter the details for the new department."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Department Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., CS"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="head">Head of Department</Label>
                    <Input
                      id="head"
                      value={formData.headOfDepartment}
                      onChange={(e) => setFormData((prev) => ({ ...prev, headOfDepartment: e.target.value }))}
                      placeholder="e.g., Dr. John Smith"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingDepartment ? "Update" : "Add"} Department</Button>
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
            <CardTitle>Departments</CardTitle>
            <CardDescription>Manage all academic departments in your institution</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Head of Department</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{department.code}</Badge>
                    </TableCell>
                    <TableCell>{department.headOfDepartment || "Not assigned"}</TableCell>
                    <TableCell>{department.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(department.id)}>
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
