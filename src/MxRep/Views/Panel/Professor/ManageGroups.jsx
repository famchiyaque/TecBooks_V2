import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetProfessorGroups } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardGroup from '@/MxRep/Components/Panels/Professor/CardGroup'
import Loader from '@/Global Components/Loader'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Settings, AlertCircle, Users } from 'lucide-react'

function ManageGroups() {
  const navigate = useNavigate()
  const { user, isLoading, isInitialized } = useAuth()
  const { groups, groupsIsLoading, error, getProfessorGroups } = useGetProfessorGroups()
  const [filter, setFilter] = useState('current') // 'current' or 'all'

  useEffect(() => {
    if (!isInitialized || isLoading || !user) {
      return
    }

    console.log("[MANAGE GROUPS] getting professor groups, user: ", user)
    getProfessorGroups(user.userId)
  }, [isInitialized, isLoading, user, getProfessorGroups])

  const filteredGroups = useMemo(() => {
    if (!groups || groups.length === 0) return []
    
    if (filter === 'current') {
      return groups.filter(group => group.status === 'active' || group.status === 'current')
    }
    
    return groups
  }, [groups, filter])

  // Sort by recency (most recent first)
  const sortedGroups = useMemo(() => {
    return [...filteredGroups].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [filteredGroups])

  const handleGroupClick = (group) => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-groups/${group.id}`)
  }

  const navigateToCreateGroup = () => {
    const slug = user.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/create-group`)
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
            <h1 className="text-3xl font-bold text-slate-900">My Groups</h1>
            <p className="text-slate-600 mt-1">
              Manage your class groups by semester and period
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
              onClick={navigateToCreateGroup}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Group
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
        {groupsIsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader message="Loading groups..." />
          </div>
        )}

        {/* Error State */}
        {error && !groupsIsLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading groups: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!groupsIsLoading && !error && sortedGroups?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {filter === 'current' ? 'No current groups' : 'No groups yet'}
            </h3>
            <p className="text-slate-600 text-center mb-6 max-w-sm">
              {filter === 'current' 
                ? 'There are no active groups for the current semester'
                : 'Create your first group to start organizing students'}
            </p>
            <Button onClick={navigateToCreateGroup} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Group
            </Button>
          </div>
        )}

        {/* Groups Grid */}
        {!groupsIsLoading && sortedGroups && sortedGroups.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {sortedGroups.length} group{sortedGroups.length !== 1 ? 's' : ''}
                {filter === 'current' && groups && groups.length > sortedGroups.length && (
                  <span className="text-slate-400 ml-1">
                    ({groups.length - sortedGroups.length} past)
                  </span>
                )}
              </p>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-wrap gap-6">
              {sortedGroups.map((group) => (
                <div key={group.id} className="w-[calc(33.333%-16px)] min-w-[300px]">
                  <CardGroup 
                    group={group}
                    onClick={() => handleGroupClick(group)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ManageGroups
