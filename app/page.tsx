import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, BookOpen, Settings, BarChart3, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SchedGenie Pro</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            AI-Powered Timetable Management System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Streamline your academic scheduling with AI-powered optimization, conflict resolution, and seamless
            integration with your existing systems.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="mr-4">
                Get Started
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <CardTitle>Smart Scheduling</CardTitle>
              </div>
              <CardDescription>
                AI-powered algorithm optimizes timetables considering faculty preferences, room availability, and
                academic constraints.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <CardTitle>Multi-User Access</CardTitle>
              </div>
              <CardDescription>
                Role-based access for administrators, faculty coordinators, and department heads with secure
                authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <CardTitle>Comprehensive Management</CardTitle>
              </div>
              <CardDescription>
                Manage departments, courses, batches, subjects, faculty, and classrooms all in one integrated platform.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <CardTitle>Analytics & Reports</CardTitle>
              </div>
              <CardDescription>
                Generate detailed reports, track utilization rates, and analyze scheduling efficiency with comprehensive
                dashboards.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-red-600" />
                <CardTitle>Flexible Configuration</CardTitle>
              </div>
              <CardDescription>
                Customize constraints, preferences, and optimization parameters to match your institution's specific
                requirements.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-teal-600" />
                <CardTitle>Export & Integration</CardTitle>
              </div>
              <CardDescription>
                Export timetables to CSV, PDF formats and integrate with existing academic management systems
                seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Scheduling Process?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of educational institutions that have streamlined their timetable generation with our
            intelligent system.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 SchedGenie Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
