"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  Send,
  Eye,
} from "lucide-react"
import type { Timetable } from "@/lib/types"

interface Comment {
  id: string
  userId: string
  userName: string
  userRole: string
  content: string
  createdAt: Date
  type: "general" | "conflict" | "suggestion"
}

export default function TimetableReviewPage() {
  const [timetable, setTimetable] = useState<Timetable | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentType, setCommentType] = useState<"general" | "conflict" | "suggestion">("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const router = useRouter()
  const params = useParams()

  // Mock data for demonstration
  const mockSubjects = [
    { id: "1", name: "Data Structures", code: "CS201" },
    { id: "2", name: "Database Management", code: "CS301" },
  ]

  const mockFaculty = [
    { id: "1", name: "Dr. Alice Johnson" },
    { id: "2", name: "Dr. Bob Smith" },
  ]

  const mockClassrooms = [
    { id: "1", name: "Room 101", code: "R101" },
    { id: "2", name: "Lab 201", code: "L201" },
  ]

  const mockBatches = [
    { id: "1", name: "CS 3rd Year A" },
    { id: "2", name: "CS 3rd Year B" },
  ]

  useEffect(() => {
    // Mock timetable data - in production, fetch from API
    const mockTimetable: Timetable = {
      id: params.id as string,
      name: "Timetable 2024-25 - Semester 5",
      academicYear: "2024-25",
      semester: 5,
      status: "under_review",
      entries: [
        {
          id: "1",
          batchId: "1",
          subjectId: "1",
          facultyId: "1",
          classroomId: "1",
          timeSlot: {
            id: "1",
            day: "monday",
            startTime: "09:00",
            endTime: "10:00",
            duration: 60,
            period: 1,
          },
          type: "lecture",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          batchId: "1",
          subjectId: "2",
          facultyId: "2",
          classroomId: "2",
          timeSlot: {
            id: "2",
            day: "monday",
            startTime: "10:00",
            endTime: "11:00",
            duration: 60,
            period: 2,
          },
          type: "practical",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      constraints: {} as any,
      createdBy: "admin",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }

    setTimetable(mockTimetable)

    // Mock comments
    setComments([
      {
        id: "1",
        userId: "coord1",
        userName: "Dr. Sarah Wilson",
        userRole: "coordinator",
        content:
          "The schedule looks good overall, but there might be a conflict with Dr. Johnson's availability on Monday morning.",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: "conflict",
      },
      {
        id: "2",
        userId: "admin",
        userName: "System Administrator",
        userRole: "admin",
        content: "I've reviewed the faculty preferences and this schedule aligns well with most requirements.",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "general",
      },
    ])
  }, [params.id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: "current-user",
        userName: "Current User",
        userRole: "admin",
        content: newComment,
        createdAt: new Date(),
        type: commentType,
      }

      setComments((prev) => [...prev, comment])
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: "approved" | "rejected" | "under_review") => {
    if (!timetable) return

    try {
      const updatedTimetable = {
        ...timetable,
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === "approved" && { approvedBy: "current-user", publishedAt: new Date() }),
      }

      setTimetable(updatedTimetable)

      // Add system comment
      const systemComment: Comment = {
        id: Date.now().toString(),
        userId: "system",
        userName: "System",
        userRole: "system",
        content: `Timetable status changed to ${newStatus}`,
        createdAt: new Date(),
        type: "general",
      }
      setComments((prev) => [...prev, systemComment])
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getSubjectName = (id: string) => mockSubjects.find((s) => s.id === id)?.name || "Unknown"
  const getFacultyName = (id: string) => mockFaculty.find((f) => f.id === id)?.name || "Unknown"
  const getClassroomName = (id: string) => mockClassrooms.find((c) => c.id === id)?.name || "Unknown"
  const getBatchName = (id: string) => mockBatches.find((b) => b.id === id)?.name || "Unknown"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "under_review":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case "conflict":
        return "text-red-600"
      case "suggestion":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case "conflict":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "suggestion":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  if (!timetable) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => router.push("/dashboard/admin/timetables")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Eye className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{timetable.name}</h1>
                <p className="text-sm text-gray-500">Review & Approval</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={getStatusColor(timetable.status) as any}>
                {timetable.status.replace("_", " ").toUpperCase()}
              </Badge>
              {timetable.status === "under_review" && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("rejected")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange("approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timetable Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Timetable Details</CardTitle>
                    <CardDescription>
                      Academic Year {timetable.academicYear} • Semester {timetable.semester}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      Table View
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      Grid View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "table" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timetable.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.timeSlot.startTime} - {entry.timeSlot.endTime}
                          </TableCell>
                          <TableCell className="capitalize">{entry.timeSlot.day}</TableCell>
                          <TableCell>{getSubjectName(entry.subjectId)}</TableCell>
                          <TableCell>{getFacultyName(entry.facultyId)}</TableCell>
                          <TableCell>{getClassroomName(entry.classroomId)}</TableCell>
                          <TableCell>{getBatchName(entry.batchId)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {entry.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="grid grid-cols-5 gap-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div key={day} className="space-y-2">
                        <h4 className="font-medium text-center py-2 bg-gray-100 rounded">{day}</h4>
                        <div className="space-y-1">
                          {timetable.entries
                            .filter((entry) => entry.timeSlot.day === day.toLowerCase())
                            .map((entry) => (
                              <div key={entry.id} className="p-2 bg-blue-50 rounded text-xs">
                                <div className="font-medium">{entry.timeSlot.startTime}</div>
                                <div>{getSubjectName(entry.subjectId)}</div>
                                <div className="text-gray-600">{getFacultyName(entry.facultyId)}</div>
                                <div className="text-gray-600">{getClassroomName(entry.classroomId)}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timetable.entries.length}</div>
                    <div className="text-sm text-gray-500">Total Classes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{new Set(timetable.entries.map((e) => e.facultyId)).size}</div>
                    <div className="text-sm text-gray-500">Faculty Involved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {new Set(timetable.entries.map((e) => e.classroomId)).size}
                    </div>
                    <div className="text-sm text-gray-500">Classrooms Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{new Set(timetable.entries.map((e) => e.batchId)).size}</div>
                    <div className="text-sm text-gray-500">Batches</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Review Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <Badge variant={getStatusColor(timetable.status) as any}>
                    {timetable.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm">{timetable.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm">{timetable.updatedAt.toLocaleDateString()}</span>
                </div>
                {timetable.publishedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Published:</span>
                    <span className="text-sm">{timetable.publishedAt.toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comments ({comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Add Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your feedback or concerns..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <select
                      value={commentType}
                      onChange={(e) => setCommentType(e.target.value as any)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="general">General</option>
                      <option value="conflict">Conflict</option>
                      <option value="suggestion">Suggestion</option>
                    </select>
                    <Button size="sm" onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
                      <Send className="h-4 w-4 mr-1" />
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-1">{getCommentTypeIcon(comment.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{comment.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.userRole}
                            </Badge>
                            <span className="text-xs text-gray-500">{comment.createdAt.toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Export to Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Notify Faculty
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Describe any problems or conflicts you've identified with this timetable.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea placeholder="Describe the issue in detail..." rows={4} />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Submit Report</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
