import React, { useEffect, useState } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CardInbox from '@/MxRep/Components/Panels/Common/CardInbox'
import Loader from '@/Global Components/Loader'
import { Filter, Settings, AlertCircle, Inbox as InboxIcon } from 'lucide-react'

function Inbox() {
  const { user, isLoading, isInitialized } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    // TODO: Fetch notifications from backend
    // For now, using mock data
    const mockNotifications = [
      {
        id: 'prof-req-001',
        title: 'Registry Approval Request',
        date: new Date().toISOString(),
        professorName: 'Dr. Jane Smith',
        email: 'jane.smith@hogwarts.edu',
        department: 'Computer Science',
        content: 'Dr. Jane Smith has requested to register as a professor at your institution. They have provided all required information and are awaiting approval to access the system.',
        type: 'professor_registration'
      },
      {
        id: 'prof-req-002',
        title: 'Registry Approval Request',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        professorName: 'Prof. John Doe',
        email: 'john.doe@hogwarts.edu',
        department: 'Mathematics',
        content: 'Prof. John Doe has submitted a registration request to join your institution as a professor. Please review their credentials and approve or reject their request.',
        type: 'professor_registration'
      },
      {
        id: 'prof-req-003',
        title: 'Registry Approval Request',
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        professorName: 'Dr. Emily Chen',
        email: 'emily.chen@hogwarts.edu',
        department: 'Physics',
        content: 'Dr. Emily Chen is requesting access to the platform as a professor. They have completed the registration form and are ready for your review.',
        type: 'professor_registration'
      }
    ]

    setNotifications(mockNotifications)
    setNotificationsLoading(false)
  }, [isInitialized, isLoading, user])

  // Show loader while auth is initializing
  if (!isInitialized || isLoading) {
    return <Loader message="Loading session..." />
  }

  // After initialization, if no user, show error
  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className='text-left'>
            <h1 className="text-3xl font-bold text-slate-900">Inbox</h1>
            <p className="text-slate-600 mt-1">
              Review and manage registration requests and notifications
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
        {notificationsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading notifications..." />
          </div>
        )}

        {/* Error State */}
        {error && !notificationsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading notifications: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!notificationsLoading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <InboxIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
            <p className="text-slate-600 text-center max-w-sm">
              You're all caught up! New registration requests and notifications will appear here.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!notificationsLoading && notifications.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                {notifications.length} pending notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <CardInbox 
                  key={notification.id} 
                  notification={notification}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Inbox