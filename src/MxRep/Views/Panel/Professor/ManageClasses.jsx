import React, { useEffect } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetProfessorClasses } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import Loader from '@/components/global/Loader'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Settings, AlertCircle, BookOpen, Calendar, Users } from 'lucide-react'

function ManageClasses() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { classes, classesIsLoading, error, getProfessorClasses } = useGetProfessorClasses()

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    console.log("[MANAGE CLASSES] getting professor classes, user: ", user)
    getProfessorClasses(user.userId)
  }, [isInitialized, isLoading, user, getProfessorClasses])

  const handleClassClick = (classItem) => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-classes/${classItem.id}`)
  }

  const navigateToCreateClass = () => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/create-class`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-3xl font-bold text-slate-900">My Classes</h1>
            <p className="text-slate-600 mt-1">
              Manage your classes and their groups
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
              onClick={navigateToCreateClass}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Class
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
      <div className="space-y-6">
        {/* Loading State */}
        {classesIsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading classes..." />
          </div>
        )}

        {/* Error State */}
        {error && !classesIsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading classes: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!classesIsLoading && !error && classes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No classes yet</h3>
            <p className="text-slate-600 text-center mb-6 max-w-sm">
              Create your first class to start organizing student groups
            </p>
            <Button onClick={navigateToCreateClass} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Class
            </Button>
          </div>
        )}

        {/* Classes List */}
        {!classesIsLoading && classes && classes.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {classes.length} class{classes.length !== 1 ? 'es' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classItem) => (
                <Card 
                  key={classItem.id}
                  className="border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleClassClick(classItem)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-slate-600 font-mono">
                          {classItem.code}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>

                    {classItem.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {classItem.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-600">
                          {formatDate(classItem.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-600">
                          {classItem.numGroups} group{classItem.numGroups !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ManageClasses
