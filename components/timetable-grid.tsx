"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateTimetableGrid } from "@/lib/export-utils"
import type { Timetable } from "@/lib/types"

interface TimetableGridProps {
  timetable: Timetable
  additionalData?: any
  compact?: boolean
}

export function TimetableGrid({ timetable, additionalData = {}, compact = false }: TimetableGridProps) {
  const { grid, days, timeSlots, getSubjectName, getFacultyName, getClassroomName, getBatchName } =
    generateTimetableGrid(timetable, additionalData)

  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable Grid</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 text-left font-medium">Time</th>
                {days.map((day) => (
                  <th key={day} className="border p-2 bg-gray-50 text-center font-medium min-w-[200px]">
                    {dayLabels[day as keyof typeof dayLabels]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border p-2 bg-gray-50 font-medium text-sm">{timeSlot}</td>
                  {days.map((day) => (
                    <td key={`${day}-${timeSlot}`} className="border p-1 align-top">
                      <div className="space-y-1">
                        {grid[day][timeSlot]?.map((entry) => (
                          <div
                            key={entry.id}
                            className={`p-2 rounded text-xs ${
                              entry.type === "practical"
                                ? "bg-blue-100 border-l-4 border-blue-500"
                                : entry.type === "tutorial"
                                  ? "bg-green-100 border-l-4 border-green-500"
                                  : "bg-purple-100 border-l-4 border-purple-500"
                            }`}
                          >
                            <div className="font-medium text-gray-900">{getSubjectName(entry.subjectId)}</div>
                            {!compact && (
                              <>
                                <div className="text-gray-600">{getFacultyName(entry.facultyId)}</div>
                                <div className="text-gray-600">{getClassroomName(entry.classroomId)}</div>
                                <div className="text-gray-600">{getBatchName(entry.batchId)}</div>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {entry.type}
                                </Badge>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
