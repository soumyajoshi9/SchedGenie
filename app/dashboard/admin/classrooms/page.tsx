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
import { Switch } from "@/components/ui/switch"
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
import type { Classroom } from "@/lib/types"

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    capacity: "30",
    type: "",
    facilities: "",
    location: "",
    isAvailable: true,
  })
  const router = useRouter()

  useEffect(() => {
    // Mock data - in production, fetch from API
    setClassrooms([
      {
        id: "1",
        name: "Room 101",
        code: "R101",
        capacity: 60,
        type: "lecture_hall",
        facilities: ["Projector", "Whiteboard", "AC"],
        location: "Block A, First Floor",
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Lab 201",
        code: "L201",
        capacity: 30,
        type: "lab",
        facilities: ["Computers", "Projector", "AC"],
        location: "Block B, Second Floor",
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const facilitiesArray = formData.facilities
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f)

    if (editingClassroom) {
      // Update existing classroom
      setClassrooms((prev) =>
        prev.map((room) =>
          room.id === editingClassroom.id
            ? {
                ...room,
                ...formData,
                capacity: Number.parseInt(formData.capacity),
                facilities: facilitiesArray,
                updatedAt: new Date(),
              }
            : room,
        ),
      )
    } else {
      // Add new classroom
      const newClassroom: Classroom = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        capacity: Number.parseInt(formData.capacity),
        type: formData.type as any,
        facilities: facilitiesArray,
        location: formData.location,
        isAvailable: formData.isAvailable,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setClassrooms((prev) => [...prev, newClassroom])
    }

    setFormData({
      name: "",
      code: "",
      capacity: "30",
      type: "",
      facilities: "",
      location: "",
      isAvailable: true,
    })
    setEditingClassroom(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom)
    setFormData({
      name: classroom.name,
      code: classroom.code,
      capacity: classroom.capacity.toString(),
      type: classroom.type,
      facilities: classroom.facilities.join(", "),
      location: classroom.location,
      isAvailable: classroom.isAvailable,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setClassrooms((prev) => prev.filter((room) => room.id !== id))
  }

  const getTypeLabel = (type: string) => {
    const types = {
      lecture_hall: "Lecture Hall",
      lab: "Laboratory",
      tutorial_room: "Tutorial Room",
      seminar_hall: "Seminar Hall",
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
              <Building2 className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Classrooms</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingClassroom(null)
                    setFormData({
                      name: "",
                      code: "",
                      capacity: "30",
                      type: "",
                      facilities: "",
                      location: "",
                      isAvailable: true,
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Classroom
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingClassroom ? "Edit Classroom" : "Add New Classroom"}</DialogTitle>
                  <DialogDescription>
                    {editingClassroom
                      ? "Update the classroom information below."
                      : "Enter the details for the new classroom."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Room 101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Room Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., R101"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Room Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture_hall">Lecture Hall</SelectItem>
                          <SelectItem value="lab">Laboratory</SelectItem>
                          <SelectItem value="tutorial_room">Tutorial Room</SelectItem>
                          <SelectItem value="seminar_hall">Seminar Hall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Block A, First Floor"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                    <Input
                      id="facilities"
                      value={formData.facilities}
                      onChange={(e) => setFormData((prev) => ({ ...prev, facilities: e.target.value }))}
                      placeholder="e.g., Projector, Whiteboard, AC, Computers"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAvailable: checked }))}
                    />
                    <Label htmlFor="available">Available for scheduling</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingClassroom ? "Update" : "Add"} Classroom</Button>
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
            <CardTitle>Classrooms</CardTitle>
            <CardDescription>Manage all classrooms and their facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classroom.name}</div>
                        <div className="text-sm text-gray-500">{classroom.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(classroom.type)}</Badge>
                    </TableCell>
                    <TableCell>{classroom.capacity} seats</TableCell>
                    <TableCell>{classroom.location}</TableCell>
                    <TableCell>
                      <Badge variant={classroom.isAvailable ? "default" : "secondary"}>
                        {classroom.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(classroom)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(classroom.id)}>
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
