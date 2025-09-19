// Export utilities for timetable data in various formats

import type { Timetable, TimetableEntry } from "./types"

// CSV Export functionality
export function exportToCSV(timetable: Timetable, additionalData: any = {}): string {
  const { subjects = [], faculty = [], classrooms = [], batches = [] } = additionalData

  const getSubjectName = (id: string) => subjects.find((s: any) => s.id === id)?.name || "Unknown"
  const getFacultyName = (id: string) => faculty.find((f: any) => f.id === id)?.name || "Unknown"
  const getClassroomName = (id: string) => classrooms.find((c: any) => c.id === id)?.name || "Unknown"
  const getBatchName = (id: string) => batches.find((b: any) => b.id === id)?.name || "Unknown"

  // CSV Headers
  const headers = ["Day", "Time", "Subject", "Subject Code", "Faculty", "Classroom", "Batch", "Type", "Duration (mins)"]

  // Convert entries to CSV rows
  const rows = timetable.entries.map((entry) => [
    entry.timeSlot.day.charAt(0).toUpperCase() + entry.timeSlot.day.slice(1),
    `${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}`,
    getSubjectName(entry.subjectId),
    subjects.find((s: any) => s.id === entry.subjectId)?.code || "",
    getFacultyName(entry.facultyId),
    getClassroomName(entry.classroomId),
    getBatchName(entry.batchId),
    entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
    entry.timeSlot.duration.toString(),
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  return csvContent
}

// Generate downloadable CSV file
export function downloadCSV(timetable: Timetable, additionalData: any = {}) {
  const csvContent = exportToCSV(timetable, additionalData)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${timetable.name.replace(/\s+/g, "_")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Generate timetable grid for display/export
export function generateTimetableGrid(timetable: Timetable, additionalData: any = {}) {
  const { subjects = [], faculty = [], classrooms = [], batches = [] } = additionalData

  const getSubjectName = (id: string) => subjects.find((s: any) => s.id === id)?.name || "Unknown"
  const getFacultyName = (id: string) => faculty.find((f: any) => f.id === id)?.name || "Unknown"
  const getClassroomName = (id: string) => classrooms.find((c: any) => c.id === id)?.name || "Unknown"
  const getBatchName = (id: string) => batches.find((b: any) => b.id === id)?.name || "Unknown"

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:15-12:15", "12:15-13:15", "14:15-15:15", "15:15-16:15"]

  const grid: { [key: string]: { [key: string]: TimetableEntry[] } } = {}

  // Initialize grid
  days.forEach((day) => {
    grid[day] = {}
    timeSlots.forEach((slot) => {
      grid[day][slot] = []
    })
  })

  // Populate grid with entries
  timetable.entries.forEach((entry) => {
    const timeKey = `${entry.timeSlot.startTime}-${entry.timeSlot.endTime}`
    if (grid[entry.timeSlot.day] && grid[entry.timeSlot.day][timeKey]) {
      grid[entry.timeSlot.day][timeKey].push(entry)
    }
  })

  return {
    grid,
    days,
    timeSlots,
    getSubjectName,
    getFacultyName,
    getClassroomName,
    getBatchName,
  }
}

// Generate faculty-wise timetable
export function generateFacultyTimetable(timetable: Timetable, facultyId: string, additionalData: any = {}) {
  const facultyEntries = timetable.entries.filter((entry) => entry.facultyId === facultyId)
  return {
    ...timetable,
    entries: facultyEntries,
  }
}

// Generate batch-wise timetable
export function generateBatchTimetable(timetable: Timetable, batchId: string, additionalData: any = {}) {
  const batchEntries = timetable.entries.filter((entry) => entry.batchId === batchId)
  return {
    ...timetable,
    entries: batchEntries,
  }
}

// Generate classroom utilization report
export function generateClassroomUtilization(timetable: Timetable, additionalData: any = {}) {
  const { classrooms = [] } = additionalData
  const utilization: { [key: string]: { total: number; used: number; percentage: number } } = {}

  const totalSlots = 5 * 6 // 5 days * 6 periods

  classrooms.forEach((classroom: any) => {
    const usedSlots = timetable.entries.filter((entry) => entry.classroomId === classroom.id).length
    utilization[classroom.id] = {
      total: totalSlots,
      used: usedSlots,
      percentage: Math.round((usedSlots / totalSlots) * 100),
    }
  })

  return utilization
}

// Generate faculty workload report
export function generateFacultyWorkload(timetable: Timetable, additionalData: any = {}) {
  const { faculty = [] } = additionalData
  const workload: { [key: string]: { hours: number; classes: number; subjects: Set<string> } } = {}

  faculty.forEach((facultyMember: any) => {
    const facultyEntries = timetable.entries.filter((entry) => entry.facultyId === facultyMember.id)
    workload[facultyMember.id] = {
      hours: facultyEntries.length,
      classes: facultyEntries.length,
      subjects: new Set(facultyEntries.map((entry) => entry.subjectId)),
    }
  })

  return workload
}
