// Database models and types for the timetable system

export interface User {
  id: string
  email: string
  password: string
  role: "admin" | "faculty" | "coordinator"
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  code: string
  headOfDepartment?: string
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  name: string
  code: string
  departmentId: string
  duration: number // in semesters
  createdAt: Date
  updatedAt: Date
}

export interface Batch {
  id: string
  name: string
  courseId: string
  year: number
  semester: number
  strength: number
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  name: string
  code: string
  credits: number
  type: "theory" | "practical" | "tutorial"
  departmentId: string
  semester: number
  createdAt: Date
  updatedAt: Date
}

export interface Faculty {
  id: string
  name: string
  email: string
  employeeId: string
  departmentId: string
  designation: string
  specialization: string[]
  maxHoursPerWeek: number
  preferredTimeSlots: TimeSlot[]
  createdAt: Date
  updatedAt: Date
}

export interface Classroom {
  id: string
  name: string
  code: string
  capacity: number
  type: "lecture_hall" | "lab" | "tutorial_room" | "seminar_hall"
  facilities: string[]
  location: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  id: string
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  duration: number // in minutes
  period: number
}

export interface TimetableEntry {
  id: string
  batchId: string
  subjectId: string
  facultyId: string
  classroomId: string
  timeSlot: TimeSlot
  type: "lecture" | "practical" | "tutorial"
  createdAt: Date
  updatedAt: Date
}

export interface Timetable {
  id: string
  name: string
  academicYear: string
  semester: number
  status: "draft" | "under_review" | "approved" | "published"
  entries: TimetableEntry[]
  constraints: TimetableConstraints
  createdBy: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface TimetableConstraints {
  maxHoursPerDay: number
  maxConsecutiveHours: number
  lunchBreakDuration: number
  lunchBreakStart: string
  workingDays: string[]
  workingHours: {
    start: string
    end: string
  }
  facultyConstraints: {
    [facultyId: string]: {
      unavailableSlots: TimeSlot[]
      maxHoursPerDay: number
    }
  }
  classroomConstraints: {
    [classroomId: string]: {
      unavailableSlots: TimeSlot[]
    }
  }
}

export interface OptimizationResult {
  score: number
  conflicts: Conflict[]
  suggestions: string[]
  efficiency: number
}

export interface Conflict {
  type: "faculty_clash" | "classroom_clash" | "batch_clash" | "constraint_violation"
  description: string
  severity: "low" | "medium" | "high"
  affectedEntries: string[]
  suggestions: string[]
}

// Form data types
export interface TimetableGenerationRequest {
  academicYear: string
  semester: number
  batches: string[]
  constraints: TimetableConstraints
  preferences: {
    prioritizeFactorPreferences: boolean
    balanceWorkload: boolean
    minimizeGaps: boolean
    optimizeRoomUtilization: boolean
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard statistics
export interface DashboardStats {
  totalTimetables: number
  activeTimetables: number
  totalFaculty: number
  totalClassrooms: number
  totalBatches: number
  utilizationRate: number
}
