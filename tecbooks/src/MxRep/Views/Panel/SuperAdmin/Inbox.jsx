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
        id: 'inst-req-001',
        title: 'Institution Registration Request',
        date: new Date().toISOString(),
        institutionName: 'New University',
        email: 'contact@newuniversity.edu',
        content: 'A new institution has requested to register. Please review their application.',
        type: 'institution_registration'
      }
    ]

    setNotifications(mockNotifications)
    setNotificationsLoading(false)
  }, [isInitialized, isLoading, user])

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
            <h1 className="text-3xl font-bold text-slate-900">Inbox</h1>
            <p className="text-slate-600 mt-1">
              Review and manage notifications
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
        {notificationsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading notifications..." />
          </div>
        )}

        {error && !notificationsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading notifications: {error}
            </AlertDescription>
          </Alert>
        )}

        {!notificationsLoading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <InboxIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
            <p className="text-slate-600 text-center max-w-sm">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}

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

