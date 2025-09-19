import { type NextRequest, NextResponse } from "next/server"
import { exportToCSV } from "@/lib/export-utils"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { timetableId } = await request.json()

    if (!timetableId) {
      return NextResponse.json({ success: false, error: "Timetable ID is required" }, { status: 400 })
    }

    // Get timetable data
    const timetable = db.timetables.findById(timetableId)
    if (!timetable) {
      return NextResponse.json({ success: false, error: "Timetable not found" }, { status: 404 })
    }

    // Get additional data for export
    const additionalData = {
      subjects: db.subjects.getAll(),
      faculty: db.faculty.getAll(),
      classrooms: db.classrooms.getAll(),
      batches: db.batches.getAll(),
    }

    // Generate CSV content
    const csvContent = exportToCSV(timetable, additionalData)

    // Return CSV content
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${timetable.name.replace(/\s+/g, "_")}.csv"`,
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 })
  }
}
