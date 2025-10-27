import React, { useEffect, useState } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetInstitutionStudents } from '@/MxRep/utils/hooks/admin.hooks'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Loader from '@/Global Components/Loader'
import { Filter, Settings, AlertCircle, GraduationCap } from 'lucide-react'

function ManageStudents() {
  const { user, isLoading, isInitialized } = useAuth()
  const { getInstitutionStudents, studentsIsLoading, error, students } = useGetInstitutionStudents()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 15

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }
    console.log("[MANAGE STUDENTS] getting institution students, user: ", user)
    if (user.institution) {
      console.log("[MANAGE STUDENTS] getting institution students for institution: ", user.institution)
      getInstitutionStudents(user.institution.institutionId)
    }
  }, [isInitialized, isLoading, user, getInstitutionStudents])

  // Show loader while auth is initializing
  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  // After initialization, if no user, show error
  if (!user) {
    return <div>Not authenticated</div>
  }

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(students.length / studentsPerPage)

  const handleStudentClick = (studentId) => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/admin-panel/manage-students/${studentId}`)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-3xl font-bold text-slate-900">Manage Students</h1>
            <p className="text-slate-600 mt-1">
              View and manage all students in your institution
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Loading State */}
        {studentsIsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading students..." />
          </div>
        )}

        {/* Error State */}
        {error && !studentsIsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading students: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!studentsIsLoading && !error && students.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No students found</h3>
            <p className="text-slate-600 text-center max-w-sm">
              There are no students registered in your institution yet.
            </p>
          </div>
        )}

        {/* Students Table */}
        {!studentsIsLoading && students.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, students.length)} of {students.length} students
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Student ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Major</TableHead>
                    <TableHead className="font-semibold text-center">Games Played</TableHead>
                    <TableHead className="font-semibold text-center">Avg Score</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student) => (
                    <TableRow 
                      key={student.id}
                      onClick={() => handleStudentClick(student.id)}
                      className="cursor-pointer bg-white py-2 hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900">
                        {student.studentId}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {student.firstNames} {student.lastNames}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {student.major}
                      </TableCell>
                      <TableCell className="text-center text-slate-900">
                        {student.numGamesPlayed}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${
                          student.avgScore >= 90 ? 'text-green-600' :
                          student.avgScore >= 80 ? 'text-blue-600' :
                          student.avgScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {student.avgScore.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ManageStudents