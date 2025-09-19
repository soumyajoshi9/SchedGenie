// AI-powered timetable generation engine with optimization and conflict resolution

import type {
  Batch,
  Subject,
  Faculty,
  Classroom,
  TimeSlot,
  TimetableEntry,
  Timetable,
  TimetableConstraints,
  OptimizationResult,
  Conflict,
  TimetableGenerationRequest,
} from "./types"
import { db } from "./database"

// Time slots configuration
const TIME_SLOTS: TimeSlot[] = [
  { id: "1", day: "monday", startTime: "09:00", endTime: "10:00", duration: 60, period: 1 },
  { id: "2", day: "monday", startTime: "10:00", endTime: "11:00", duration: 60, period: 2 },
  { id: "3", day: "monday", startTime: "11:15", endTime: "12:15", duration: 60, period: 3 },
  { id: "4", day: "monday", startTime: "12:15", endTime: "13:15", duration: 60, period: 4 },
  { id: "5", day: "monday", startTime: "14:15", endTime: "15:15", duration: 60, period: 5 },
  { id: "6", day: "monday", startTime: "15:15", endTime: "16:15", duration: 60, period: 6 },

  { id: "7", day: "tuesday", startTime: "09:00", endTime: "10:00", duration: 60, period: 1 },
  { id: "8", day: "tuesday", startTime: "10:00", endTime: "11:00", duration: 60, period: 2 },
  { id: "9", day: "tuesday", startTime: "11:15", endTime: "12:15", duration: 60, period: 3 },
  { id: "10", day: "tuesday", startTime: "12:15", endTime: "13:15", duration: 60, period: 4 },
  { id: "11", day: "tuesday", startTime: "14:15", endTime: "15:15", duration: 60, period: 5 },
  { id: "12", day: "tuesday", startTime: "15:15", endTime: "16:15", duration: 60, period: 6 },

  { id: "13", day: "wednesday", startTime: "09:00", endTime: "10:00", duration: 60, period: 1 },
  { id: "14", day: "wednesday", startTime: "10:00", endTime: "11:00", duration: 60, period: 2 },
  { id: "15", day: "wednesday", startTime: "11:15", endTime: "12:15", duration: 60, period: 3 },
  { id: "16", day: "wednesday", startTime: "12:15", endTime: "13:15", duration: 60, period: 4 },
  { id: "17", day: "wednesday", startTime: "14:15", endTime: "15:15", duration: 60, period: 5 },
  { id: "18", day: "wednesday", startTime: "15:15", endTime: "16:15", duration: 60, period: 6 },

  { id: "19", day: "thursday", startTime: "09:00", endTime: "10:00", duration: 60, period: 1 },
  { id: "20", day: "thursday", startTime: "10:00", endTime: "11:00", duration: 60, period: 2 },
  { id: "21", day: "thursday", startTime: "11:15", endTime: "12:15", duration: 60, period: 3 },
  { id: "22", day: "thursday", startTime: "12:15", endTime: "13:15", duration: 60, period: 4 },
  { id: "23", day: "thursday", startTime: "14:15", endTime: "15:15", duration: 60, period: 5 },
  { id: "24", day: "thursday", startTime: "15:15", endTime: "16:15", duration: 60, period: 6 },

  { id: "25", day: "friday", startTime: "09:00", endTime: "10:00", duration: 60, period: 1 },
  { id: "26", day: "friday", startTime: "10:00", endTime: "11:00", duration: 60, period: 2 },
  { id: "27", day: "friday", startTime: "11:15", endTime: "12:15", duration: 60, period: 3 },
  { id: "28", day: "friday", startTime: "12:15", endTime: "13:15", duration: 60, period: 4 },
  { id: "29", day: "friday", startTime: "14:15", endTime: "15:15", duration: 60, period: 5 },
  { id: "30", day: "friday", startTime: "15:15", endTime: "16:15", duration: 60, period: 6 },
]

export class TimetableGenerator {
  private batches: Batch[] = []
  private subjects: Subject[] = []
  private faculty: Faculty[] = []
  private classrooms: Classroom[] = []
  private constraints: TimetableConstraints
  private entries: TimetableEntry[] = []
  private conflicts: Conflict[] = []

  constructor(constraints: TimetableConstraints) {
    this.constraints = constraints
    this.loadData()
  }

  private loadData() {
    this.batches = db.batches.getAll()
    this.subjects = db.subjects.getAll()
    this.faculty = db.faculty.getAll()
    this.classrooms = db.classrooms.findAvailable()
  }

  // Main generation method
  async generateTimetable(
    request: TimetableGenerationRequest,
  ): Promise<{ timetable: Timetable; optimization: OptimizationResult }> {
    console.log("[v0] Starting timetable generation...")

    // Reset state
    this.entries = []
    this.conflicts = []

    // Filter batches based on request
    const selectedBatches = this.batches.filter(
      (batch) => request.batches.includes(batch.id) && batch.semester === request.semester,
    )

    console.log("[v0] Selected batches:", selectedBatches.length)

    // Generate entries for each batch
    for (const batch of selectedBatches) {
      await this.generateBatchTimetable(batch, request)
    }

    // Optimize the timetable
    const optimization = this.optimizeTimetable(request.preferences)

    // Create timetable object
    const timetable: Timetable = {
      id: Date.now().toString(),
      name: `Timetable ${request.academicYear} - Semester ${request.semester}`,
      academicYear: request.academicYear,
      semester: request.semester,
      status: "draft",
      entries: this.entries,
      constraints: this.constraints,
      createdBy: "system", // In production, use actual user ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("[v0] Generated timetable with", this.entries.length, "entries")

    return { timetable, optimization }
  }

  private async generateBatchTimetable(batch: Batch, request: TimetableGenerationRequest) {
    // Get subjects for this batch's semester
    const batchSubjects = this.subjects.filter((subject) => subject.semester === batch.semester)

    console.log("[v0] Processing batch:", batch.name, "with", batchSubjects.length, "subjects")

    for (const subject of batchSubjects) {
      // Calculate required hours per week based on credits
      const hoursPerWeek = subject.credits

      // Find suitable faculty
      const suitableFaculty = this.findSuitableFaculty(subject)
      if (!suitableFaculty.length) {
        this.conflicts.push({
          type: "constraint_violation",
          description: `No suitable faculty found for ${subject.name}`,
          severity: "high",
          affectedEntries: [],
          suggestions: ["Assign faculty to this subject", "Hire additional faculty"],
        })
        continue
      }

      // Schedule classes for this subject
      await this.scheduleSubject(batch, subject, suitableFaculty[0], hoursPerWeek)
    }
  }

  private findSuitableFaculty(subject: Subject): Faculty[] {
    return this.faculty.filter(
      (f) =>
        f.departmentId === subject.departmentId &&
        (f.specialization.length === 0 ||
          f.specialization.some(
            (spec) =>
              subject.name.toLowerCase().includes(spec.toLowerCase()) ||
              spec.toLowerCase().includes(subject.name.toLowerCase()),
          )),
    )
  }

  private async scheduleSubject(batch: Batch, subject: Subject, faculty: Faculty, hoursPerWeek: number) {
    let scheduledHours = 0
    const maxAttempts = 50
    let attempts = 0

    while (scheduledHours < hoursPerWeek && attempts < maxAttempts) {
      attempts++

      // Find available time slot
      const availableSlot = this.findAvailableTimeSlot(batch, faculty, subject)
      if (!availableSlot) {
        this.conflicts.push({
          type: "constraint_violation",
          description: `Cannot find available time slot for ${subject.name} - ${batch.name}`,
          severity: "medium",
          affectedEntries: [],
          suggestions: ["Adjust faculty schedule", "Add more time slots", "Reduce subject hours"],
        })
        break
      }

      // Find suitable classroom
      const classroom = this.findSuitableClassroom(subject, batch, availableSlot)
      if (!classroom) {
        this.conflicts.push({
          type: "classroom_clash",
          description: `No suitable classroom available for ${subject.name} at ${availableSlot.startTime}`,
          severity: "medium",
          affectedEntries: [],
          suggestions: ["Add more classrooms", "Reschedule other classes"],
        })
        continue
      }

      // Create timetable entry
      const entry: TimetableEntry = {
        id: Date.now().toString() + Math.random(),
        batchId: batch.id,
        subjectId: subject.id,
        facultyId: faculty.id,
        classroomId: classroom.id,
        timeSlot: availableSlot,
        type: subject.type === "practical" ? "practical" : "lecture",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      this.entries.push(entry)
      scheduledHours++

      console.log("[v0] Scheduled:", subject.name, "for", batch.name, "at", availableSlot.day, availableSlot.startTime)
    }
  }

  private findAvailableTimeSlot(batch: Batch, faculty: Faculty, subject: Subject): TimeSlot | null {
    // Shuffle time slots for better distribution
    const shuffledSlots = [...TIME_SLOTS].sort(() => Math.random() - 0.5)

    for (const slot of shuffledSlots) {
      // Check if slot is within working hours
      if (!this.isWithinWorkingHours(slot)) continue

      // Check batch availability
      if (this.isBatchBusy(batch.id, slot)) continue

      // Check faculty availability
      if (this.isFacultyBusy(faculty.id, slot)) continue

      // Check faculty preferences (if any)
      if (faculty.preferredTimeSlots.length > 0) {
        const hasPreference = faculty.preferredTimeSlots.some(
          (pref) => pref.day === slot.day && pref.startTime === slot.startTime,
        )
        if (!hasPreference) continue
      }

      return slot
    }

    return null
  }

  private findSuitableClassroom(subject: Subject, batch: Batch, timeSlot: TimeSlot): Classroom | null {
    // Filter classrooms by type and capacity
    const suitableRooms = this.classrooms.filter((room) => {
      // Check capacity
      if (room.capacity < batch.strength) return false

      // Check room type compatibility
      if (subject.type === "practical" && room.type !== "lab") return false
      if (subject.type === "theory" && room.type === "lab") return false

      // Check availability
      if (this.isClassroomBusy(room.id, timeSlot)) return false

      return true
    })

    // Return the first suitable room (could be optimized further)
    return suitableRooms[0] || null
  }

  private isWithinWorkingHours(slot: TimeSlot): boolean {
    const startHour = Number.parseInt(slot.startTime.split(":")[0])
    const workingStart = Number.parseInt(this.constraints.workingHours.start.split(":")[0])
    const workingEnd = Number.parseInt(this.constraints.workingHours.end.split(":")[0])

    return startHour >= workingStart && startHour < workingEnd
  }

  private isBatchBusy(batchId: string, slot: TimeSlot): boolean {
    return this.entries.some(
      (entry) =>
        entry.batchId === batchId && entry.timeSlot.day === slot.day && entry.timeSlot.startTime === slot.startTime,
    )
  }

  private isFacultyBusy(facultyId: string, slot: TimeSlot): boolean {
    return this.entries.some(
      (entry) =>
        entry.facultyId === facultyId && entry.timeSlot.day === slot.day && entry.timeSlot.startTime === slot.startTime,
    )
  }

  private isClassroomBusy(classroomId: string, slot: TimeSlot): boolean {
    return this.entries.some(
      (entry) =>
        entry.classroomId === classroomId &&
        entry.timeSlot.day === slot.day &&
        entry.timeSlot.startTime === slot.startTime,
    )
  }

  private optimizeTimetable(preferences: any): OptimizationResult {
    let score = 100
    const suggestions: string[] = []

    // Calculate efficiency metrics
    const totalSlots = TIME_SLOTS.length
    const usedSlots = this.entries.length
    const efficiency = (usedSlots / totalSlots) * 100

    // Penalize conflicts
    score -= this.conflicts.length * 10

    // Bonus for balanced distribution
    const dailyDistribution = this.calculateDailyDistribution()
    const isBalanced = Object.values(dailyDistribution).every((count) => count >= 2 && count <= 8)
    if (isBalanced) score += 10

    // Faculty workload analysis
    const facultyWorkload = this.calculateFacultyWorkload()
    const overloadedFaculty = Object.entries(facultyWorkload).filter(([_, hours]) => hours > 20)
    score -= overloadedFaculty.length * 5

    // Generate suggestions
    if (this.conflicts.length > 0) {
      suggestions.push(`Resolve ${this.conflicts.length} scheduling conflicts`)
    }
    if (efficiency < 60) {
      suggestions.push("Increase resource utilization")
    }
    if (overloadedFaculty.length > 0) {
      suggestions.push(`Balance workload for ${overloadedFaculty.length} faculty members`)
    }

    return {
      score: Math.max(0, score),
      conflicts: this.conflicts,
      suggestions,
      efficiency: Math.round(efficiency),
    }
  }

  private calculateDailyDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    }

    this.entries.forEach((entry) => {
      distribution[entry.timeSlot.day]++
    })

    return distribution
  }

  private calculateFacultyWorkload(): Record<string, number> {
    const workload: Record<string, number> = {}

    this.entries.forEach((entry) => {
      workload[entry.facultyId] = (workload[entry.facultyId] || 0) + 1
    })

    return workload
  }
}

// Default constraints
export const DEFAULT_CONSTRAINTS: TimetableConstraints = {
  maxHoursPerDay: 8,
  maxConsecutiveHours: 3,
  lunchBreakDuration: 60,
  lunchBreakStart: "13:15",
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  workingHours: {
    start: "09:00",
    end: "17:00",
  },
  facultyConstraints: {},
  classroomConstraints: {},
}

// Utility function to generate timetable
export async function generateTimetable(request: TimetableGenerationRequest) {
  const generator = new TimetableGenerator(request.constraints)
  return await generator.generateTimetable(request)
}
