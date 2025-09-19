"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, BookOpen, GraduationCap, Calendar, BarChart3, Clock } from "lucide-react"
import type { User, DashboardStats } from "@/lib/types"

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "admin") {
        router.push("/login")
        return
      }
      setUser(parsedUser)
    } else {
      router.push("/login")
      return
    }

    // Mock stats data
    setStats({
      totalTimetables: 12,
      activeTimetables: 3,
      totalFaculty: 45,
      totalClassrooms: 28,
      totalBatches: 18,
      utilizationRate: 78,
    })
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TimetableGen Pro</h1>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Timetables</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTimetables}</div>
              <p className="text-xs text-muted-foreground">{stats?.activeTimetables} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFaculty}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClassrooms}</div>
              <p className="text-xs text-muted-foreground">Available for scheduling</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.utilizationRate}%</div>
              <p className="text-xs text-muted-foreground">Resource efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/departments")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle>Manage Departments</CardTitle>
                  <CardDescription>Add, edit, and organize departments</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/faculty")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle>Manage Faculty</CardTitle>
                  <CardDescription>Add faculty members and their preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/classrooms")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle>Manage Classrooms</CardTitle>
                  <CardDescription>Configure rooms and their facilities</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/subjects")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-orange-600" />
                <div>
                  <CardTitle>Manage Subjects</CardTitle>
                  <CardDescription>Add subjects and course curriculum</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/batches")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-red-600" />
                <div>
                  <CardTitle>Manage Batches</CardTitle>
                  <CardDescription>Organize student batches and sections</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/timetables")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-teal-600" />
                <div>
                  <CardTitle>Generate Timetables</CardTitle>
                  <CardDescription>Create and manage timetables</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/dashboard/admin/reports")}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>View utilization reports and export data</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">New timetable generated for CS Department</span>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm">Faculty member Dr. Smith added to EE Department</span>
                <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Classroom Lab 301 marked as unavailable</span>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
