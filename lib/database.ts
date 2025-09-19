// In-memory database simulation for the timetable system
// This would be replaced with actual database operations in production

import type { User, Department, Course, Batch, Subject, Faculty, Classroom, Timetable } from "./types"

// In-memory storage
const users: User[] = []
const departments: Department[] = []
const courses: Course[] = []
const batches: Batch[] = []
const subjects: Subject[] = []
const faculty: Faculty[] = []
const classrooms: Classroom[] = []
const timetables: Timetable[] = []

// Default admin user
const defaultAdmin: User = {
  id: "1",
  email: "admin@college.edu",
  password: "admin123", // In production, this would be hashed
  role: "admin",
  name: "System Administrator",
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Initialize with default data
if (users.length === 0) {
  users.push(defaultAdmin)
}

// Database operations
export const db = {
  // User operations
  users: {
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
    create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(newUser)
      return newUser
    },
    getAll: () => users,
  },

  // Department operations
  departments: {
    getAll: () => departments,
    findById: (id: string) => departments.find((d) => d.id === id),
    create: (dept: Omit<Department, "id" | "createdAt" | "updatedAt">) => {
      const newDept: Department = {
        ...dept,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      departments.push(newDept)
      return newDept
    },
    update: (id: string, updates: Partial<Department>) => {
      const index = departments.findIndex((d) => d.id === id)
      if (index !== -1) {
        departments[index] = { ...departments[index], ...updates, updatedAt: new Date() }
        return departments[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = departments.findIndex((d) => d.id === id)
      if (index !== -1) {
        departments.splice(index, 1)
        return true
      }
      return false
    },
  },

  // Course operations
  courses: {
    getAll: () => courses,
    findById: (id: string) => courses.find((c) => c.id === id),
    findByDepartment: (departmentId: string) => courses.filter((c) => c.departmentId === departmentId),
    create: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => {
      const newCourse: Course = {
        ...course,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      courses.push(newCourse)
      return newCourse
    },
  },

  // Batch operations
  batches: {
    getAll: () => batches,
    findById: (id: string) => batches.find((b) => b.id === id),
    findByCourse: (courseId: string) => batches.filter((b) => b.courseId === courseId),
    create: (batch: Omit<Batch, "id" | "createdAt" | "updatedAt">) => {
      const newBatch: Batch = {
        ...batch,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      batches.push(newBatch)
      return newBatch
    },
  },

  // Subject operations
  subjects: {
    getAll: () => subjects,
    findById: (id: string) => subjects.find((s) => s.id === id),
    findByDepartment: (departmentId: string) => subjects.filter((s) => s.departmentId === departmentId),
    findBySemester: (semester: number) => subjects.filter((s) => s.semester === semester),
    create: (subject: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
      const newSubject: Subject = {
        ...subject,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      subjects.push(newSubject)
      return newSubject
    },
  },

  // Faculty operations
  faculty: {
    getAll: () => faculty,
    findById: (id: string) => faculty.find((f) => f.id === id),
    findByDepartment: (departmentId: string) => faculty.filter((f) => f.departmentId === departmentId),
    create: (facultyMember: Omit<Faculty, "id" | "createdAt" | "updatedAt">) => {
      const newFaculty: Faculty = {
        ...facultyMember,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      faculty.push(newFaculty)
      return newFaculty
    },
  },

  // Classroom operations
  classrooms: {
    getAll: () => classrooms,
    findById: (id: string) => classrooms.find((c) => c.id === id),
    findByType: (type: string) => classrooms.filter((c) => c.type === type),
    findAvailable: () => classrooms.filter((c) => c.isAvailable),
    create: (classroom: Omit<Classroom, "id" | "createdAt" | "updatedAt">) => {
      const newClassroom: Classroom = {
        ...classroom,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      classrooms.push(newClassroom)
      return newClassroom
    },
  },

  // Timetable operations
  timetables: {
    getAll: () => timetables,
    findById: (id: string) => timetables.find((t) => t.id === id),
    findByStatus: (status: string) => timetables.filter((t) => t.status === status),
    create: (timetable: Omit<Timetable, "id" | "createdAt" | "updatedAt">) => {
      const newTimetable: Timetable = {
        ...timetable,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      timetables.push(newTimetable)
      return newTimetable
    },
    update: (id: string, updates: Partial<Timetable>) => {
      const index = timetables.findIndex((t) => t.id === id)
      if (index !== -1) {
        timetables[index] = { ...timetables[index], ...updates, updatedAt: new Date() }
        return timetables[index]
      }
      return null
    },
  },
}

// Seed data function
export const seedDatabase = () => {
  // Clear existing users except default admin
  const adminUser = users.find((u) => u.email === "admin@college.edu")
  users.length = 0
  if (adminUser) users.push(adminUser)

  // Add demo users for different roles
  db.users.create({
    email: "coord@college.edu",
    password: "coord123",
    role: "coordinator",
    name: "Department Coordinator",
  })

  db.users.create({
    email: "faculty@college.edu",
    password: "faculty123",
    role: "faculty",
    name: "Faculty Member",
  })

  // Add sample departments
  const csDept = db.departments.create({
    name: "Computer Science",
    code: "CS",
    headOfDepartment: "Dr. John Smith",
  })

  const eeDept = db.departments.create({
    name: "Electrical Engineering",
    code: "EE",
    headOfDepartment: "Dr. Jane Doe",
  })

  // Add sample courses
  const btech = db.courses.create({
    name: "Bachelor of Technology",
    code: "BTECH",
    departmentId: csDept.id,
    duration: 8,
  })

  // Add sample subjects
  db.subjects.create({
    name: "Data Structures",
    code: "CS201",
    credits: 4,
    type: "theory",
    departmentId: csDept.id,
    semester: 3,
  })

  db.subjects.create({
    name: "Database Management Systems",
    code: "CS301",
    credits: 4,
    type: "theory",
    departmentId: csDept.id,
    semester: 5,
  })

  // Add sample faculty
  db.faculty.create({
    name: "Dr. Alice Johnson",
    email: "alice@college.edu",
    employeeId: "FAC001",
    departmentId: csDept.id,
    designation: "Professor",
    specialization: ["Data Structures", "Algorithms"],
    maxHoursPerWeek: 20,
    preferredTimeSlots: [],
  })

  // Add sample classrooms
  db.classrooms.create({
    name: "Room 101",
    code: "R101",
    capacity: 60,
    type: "lecture_hall",
    facilities: ["Projector", "Whiteboard", "AC"],
    location: "Block A, First Floor",
    isAvailable: true,
  })

  db.classrooms.create({
    name: "Lab 201",
    code: "L201",
    capacity: 30,
    type: "lab",
    facilities: ["Computers", "Projector", "AC"],
    location: "Block B, Second Floor",
    isAvailable: true,
  })

  // Add sample batch
  db.batches.create({
    name: "CS 3rd Year A",
    courseId: btech.id,
    year: 3,
    semester: 5,
    strength: 45,
  })
}
