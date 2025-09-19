"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Send, FileText, Clock } from "lucide-react"
import type { Timetable } from "@/lib/types"

interface ReviewDecision {
  decision: "approve" | "reject" | "request_changes"
  comments: string
  issues: string[]
  recommendations: string
}

export default function CoordinatorReviewPage() {
  const [timetable, setTimetable] = useState<Timetable | null>(null)
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>({
    decision: "approve",
    comments: "",
    issues: [],
    recommendations: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()

  const commonIssues = [
    "Faculty availability conflicts",
    "Classroom capacity issues",
    "Consecutive class scheduling",
    "Lunch break violations",
    "Lab equipment conflicts",
    "Faculty workload imbalance",
    "Student travel time between classes",
    "Preferred time slot violations",
  ]

  useEffect(() => {
    // Mock timetable data - in production, fetch from API
    const mockTimetable: Timetable = {
      id: params.id as string,
      name: "CS Department - Semester 5",
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
      ],
      constraints: {} as any,
      createdBy: "admin",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }

    setTimetable(mockTimetable)
  }, [params.id])

  const handleIssueToggle = (issue: string, checked: boolean) => {
    if (checked) {
      setReviewDecision((prev) => ({
        ...prev,
        issues: [...prev.issues, issue],
      }))
    } else {
      setReviewDecision((prev) => ({
        ...prev,
        issues: prev.issues.filter((i) => i !== issue),
      }))
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewDecision.comments.trim()) {
      alert("Please provide comments for your review decision")
      return
    }

    setIsSubmitting(true)
    try {
      // In production, submit to API
      console.log("Submitting review:", reviewDecision)

      // Update timetable status based on decision
      const newStatus =
        reviewDecision.decision === "approve"
          ? "approved"
          : reviewDecision.decision === "reject"
            ? "rejected"
            : "under_review"

      if (timetable) {
        setTimetable({
          ...timetable,
          status: newStatus,
          updatedAt: new Date(),
        })
      }

      // Redirect back to coordinator dashboard
      router.push("/dashboard/coordinator")
    } catch (error) {
      console.error("Failed to submit review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
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
              <Button variant="ghost" onClick={() => router.push("/dashboard/coordinator")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Review Timetable</h1>
                <p className="text-sm text-gray-500">{timetable.name}</p>
              </div>
            </div>
            <Badge variant="secondary">COORDINATOR REVIEW</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Timetable Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Timetable Summary</CardTitle>
              <CardDescription>Review the key details before making your decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Academic Year</div>
                  <div className="font-medium">{timetable.academicYear}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Semester</div>
                  <div className="font-medium">Semester {timetable.semester}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Classes</div>
                  <div className="font-medium">{timetable.entries.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-medium">{timetable.createdAt.toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Decision */}
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>Select your decision and provide detailed feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Decision Selection */}
              <div className="space-y-3">
                <Label>Decision</Label>
                <RadioGroup
                  value={reviewDecision.decision}
                  onValueChange={(value) => setReviewDecision((prev) => ({ ...prev, decision: value as any }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Approve - Ready for publication</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="request_changes" id="request_changes" />
                    <Label htmlFor="request_changes" className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Request Changes - Needs modifications</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Reject - Major issues found</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Issues Checklist */}
              {(reviewDecision.decision === "request_changes" || reviewDecision.decision === "reject") && (
                <div className="space-y-3">
                  <Label>Identified Issues (select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonIssues.map((issue) => (
                      <div key={issue} className="flex items-center space-x-2">
                        <Checkbox
                          id={issue}
                          checked={reviewDecision.issues.includes(issue)}
                          onCheckedChange={(checked) => handleIssueToggle(issue, checked as boolean)}
                        />
                        <Label htmlFor={issue} className="text-sm">
                          {issue}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">
                  Comments <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Provide detailed feedback about the timetable. Include specific concerns, suggestions, or approval reasons..."
                  value={reviewDecision.comments}
                  onChange={(e) => setReviewDecision((prev) => ({ ...prev, comments: e.target.value }))}
                  rows={5}
                  required
                />
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations (optional)</Label>
                <Textarea
                  id="recommendations"
                  placeholder="Suggest improvements or alternative approaches..."
                  value={reviewDecision.recommendations}
                  onChange={(e) => setReviewDecision((prev) => ({ ...prev, recommendations: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Review Guidelines */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Review Guidelines:</strong> Please check for faculty availability conflicts, classroom capacity
              issues, and adherence to institutional policies. Your feedback will be shared with the timetable creator
              for improvements.
            </AlertDescription>
          </Alert>

          {/* Submit Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/coordinator")}>
              Save as Draft
            </Button>
            <Button onClick={handleSubmitReview} disabled={isSubmitting || !reviewDecision.comments.trim()}>
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
