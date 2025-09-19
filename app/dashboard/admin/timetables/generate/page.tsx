"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Wand2, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { generateTimetable, DEFAULT_CONSTRAINTS } from "@/lib/timetable-generator"
import type { Batch, TimetableGenerationRequest, OptimizationResult, Timetable } from "@/lib/types"

export default function GenerateTimetablePage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ timetable: Timetable; optimization: OptimizationResult } | null>(null)
  const [formData, setFormData] = useState({
    academicYear: "2024-25",
    semester: "5",
    prioritizeFactorPreferences: true,
    balanceWorkload: true,
    minimizeGaps: true,
    optimizeRoomUtilization: true,
  })
  const router = useRouter()

  useEffect(() => {
    // Mock data - in production, fetch from API
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
      {
        id: "3",
        name: "EE 2nd Year A",
        courseId: "2",
        year: 2,
        semester: 3,
        strength: 38,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }, [])

  const handleBatchSelection = (batchId: string, checked: boolean) => {
    if (checked) {
      setSelectedBatches((prev) => [...prev, batchId])
    } else {
      setSelectedBatches((prev) => prev.filter((id) => id !== batchId))
    }
  }

  const handleGenerate = async () => {
    if (selectedBatches.length === 0) {
      alert("Please select at least one batch")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setResult(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      const request: TimetableGenerationRequest = {
        academicYear: formData.academicYear,
        semester: Number.parseInt(formData.semester),
        batches: selectedBatches,
        constraints: DEFAULT_CONSTRAINTS,
        preferences: {
          prioritizeFactorPreferences: formData.prioritizeFactorPreferences,
          balanceWorkload: formData.balanceWorkload,
          minimizeGaps: formData.minimizeGaps,
          optimizeRoomUtilization: formData.optimizeRoomUtilization,
        },
      }

      const generationResult = await generateTimetable(request)

      clearInterval(progressInterval)
      setProgress(100)
      setResult(generationResult)
    } catch (error) {
      console.error("Generation failed:", error)
      alert("Failed to generate timetable. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
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
              <Wand2 className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Generate Timetable</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set the academic year and semester for the timetable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear}
                      onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
                      placeholder="2024-25"
                    />
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
              </CardContent>
            </Card>

            {/* Batch Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Batches</CardTitle>
                <CardDescription>Choose the batches to include in the timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches
                    .filter((batch) => batch.semester === Number.parseInt(formData.semester))
                    .map((batch) => (
                      <div key={batch.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={batch.id}
                          checked={selectedBatches.includes(batch.id)}
                          onCheckedChange={(checked) => handleBatchSelection(batch.id, checked as boolean)}
                        />
                        <Label htmlFor={batch.id} className="flex-1">
                          <div>
                            <div className="font-medium">{batch.name}</div>
                            <div className="text-sm text-gray-500">
                              Year {batch.year}, Semester {batch.semester} • {batch.strength} students
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimization Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Preferences</CardTitle>
                <CardDescription>Configure how the AI should optimize the timetable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="prioritize">Prioritize Faculty Preferences</Label>
                    <p className="text-sm text-gray-500">Consider faculty preferred time slots</p>
                  </div>
                  <Switch
                    id="prioritize"
                    checked={formData.prioritizeFactorPreferences}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, prioritizeFactorPreferences: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="balance">Balance Faculty Workload</Label>
                    <p className="text-sm text-gray-500">Distribute teaching hours evenly</p>
                  </div>
                  <Switch
                    id="balance"
                    checked={formData.balanceWorkload}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, balanceWorkload: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gaps">Minimize Schedule Gaps</Label>
                    <p className="text-sm text-gray-500">Reduce empty periods between classes</p>
                  </div>
                  <Switch
                    id="gaps"
                    checked={formData.minimizeGaps}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, minimizeGaps: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rooms">Optimize Room Utilization</Label>
                    <p className="text-sm text-gray-500">Maximize classroom usage efficiency</p>
                  </div>
                  <Switch
                    id="rooms"
                    checked={formData.optimizeRoomUtilization}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, optimizeRoomUtilization: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generation Progress */}
            {isGenerating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Timetable...</span>
                  </CardTitle>
                  <CardDescription>
                    AI is optimizing your timetable based on constraints and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={isGenerating || selectedBatches.length === 0} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Timetable
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Optimization Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Timetable Generated Successfully!</span>
                </CardTitle>
                <CardDescription>AI optimization completed with the following results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(result.optimization.score)}`}>
                    {result.optimization.score}/100
                  </div>
                  <div className="text-lg text-gray-600">{getScoreLabel(result.optimization.score)}</div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">{result.optimization.efficiency}%</div>
                    <div className="text-sm text-gray-500">Resource Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold">{result.timetable.entries.length}</div>
                    <div className="text-sm text-gray-500">Classes Scheduled</div>
                  </div>
                </div>

                {/* Conflicts */}
                {result.optimization.conflicts.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{result.optimization.conflicts.length} conflicts detected:</strong>
                      <ul className="mt-2 space-y-1">
                        {result.optimization.conflicts.slice(0, 3).map((conflict, index) => (
                          <li key={index} className="text-sm">
                            • {conflict.description}
                          </li>
                        ))}
                        {result.optimization.conflicts.length > 3 && (
                          <li className="text-sm">• And {result.optimization.conflicts.length - 3} more...</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Suggestions */}
                {result.optimization.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Optimization Suggestions:</h4>
                    <ul className="space-y-1">
                      {result.optimization.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setResult(null)}>
                Generate Another
              </Button>
              <div className="space-x-2">
                <Button variant="outline">Preview Timetable</Button>
                <Button>Save & Continue</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
