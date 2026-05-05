import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import { useGetGroup, useGetInstitutionStudents } from '@/MxRep/utils/hooks/professor.hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, MenuItem, InputLabel, FormControl as MUIFormControl } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Loader from '@/components/global/Loader'
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  Users,
  Hash,
  BookOpen,
  Trash2,
  UserPlus,
  UserMinus
} from 'lucide-react'

function Group() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { 
    group, 
    groupIsLoading, 
    error, 
    getGroup, 
    updateGroup,
    addStudentToGroup,
    removeStudentFromGroup,
    deleteGroup
  } = useGetGroup()
  const { students, getInstitutionStudents, studentsIsLoading } = useGetInstitutionStudents()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })
  const [saveError, setSaveError] = useState(null)
  const [operationError, setOperationError] = useState(null)

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    if (groupId) {
      getGroup(groupId)
    }
  }, [isInitialized, authLoading, user, groupId, getGroup])

  useEffect(() => {
    console.log("user in get students hook", user)
    if (user?.institutionId) {
      getInstitutionStudents(user.institution.institutionId)
    }
  }, [user, getInstitutionStudents])

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        code: group.code || '',
        description: group.description || ''
      })
    }
  }, [group])

  const handleBack = () => {
    const slug = user?.institution?.slug
    navigate(`/mxrep/${slug}/professor-panel/manage-groups`)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSaveError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSaveError(null)
    if (group) {
      setFormData({
        name: group.name || '',
        code: group.code || '',
        description: group.description || ''
      })
    }
  }

  const handleSave = async () => {
    setSaveError(null)
    const result = await updateGroup(groupId, {
      name: formData.name,
      code: formData.code,
      ...(formData.description && { description: formData.description })
    })
    
    if (result.success) {
      setIsEditing(false)
    } else {
      setSaveError(result.error)
    }
  }

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      setOperationError('Please select a student')
      return
    }

    setOperationError(null)
    const result = await addStudentToGroup(groupId, selectedStudentId)
    
    if (result.success) {
      setIsAddStudentOpen(false)
      setSelectedStudentId('')
    } else {
      setOperationError(result.error)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the group?')) {
      return
    }

    setOperationError(null)
    const result = await removeStudentFromGroup(groupId, studentId)
    
    if (!result.success) {
      setOperationError(result.error)
    }
  }

  const handleDeleteGroup = async () => {
    setOperationError(null)
    const result = await deleteGroup(groupId)
    
    if (result.success) {
      handleBack()
    } else {
      setOperationError(result.error)
    }
  }

  // Get students not already in the group
  const availableStudents = students.filter(student => {
    if (!group?.members) return true
    const memberIds = group.members.map(m => m._id || m.id || m)
    return !memberIds.includes(student.id || student._id)
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (!isInitialized || authLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (groupIsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader message="Loading group..." />
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Group not found'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div className='flex items-start gap-4'>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="mt-1 h-8 w-8 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className='text-left'>
              <h1 className="text-3xl font-bold text-slate-900">
                {isEditing ? 'Edit Group' : (group.name || group.code)}
              </h1>
              <p className="text-slate-600 mt-1">
                {group.className || (group.classId?.name) || 'Unknown Class'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button 
                  variant="destructive"
                  className="gap-2"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone and will remove all students from it.')) {
                      handleDeleteGroup()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-6" />
      </div>

      {/* Error Messages */}
      {(saveError || operationError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {saveError || operationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {group.numStudents || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-slate-900">
              {group.className || (group.classId?.name) || 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(group.createdAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Group Information Card */}
      <Card className="border-slate-200 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Group Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Name
            </label>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter group name"
              />
            ) : (
              <p className="text-slate-900 py-2">{group.name || 'N/A'}</p>
            )}
          </div>

          {/* Group Code */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Group Code
            </label>
            {isEditing ? (
              <Input
                name="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter group code"
              />
            ) : (
              <p className="text-slate-900 py-2 font-mono">{group.code || 'N/A'}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Description
            </label>
            {isEditing ? (
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter group description (optional)"
                className="resize-none h-24"
              />
            ) : (
              <p className="text-slate-900 py-2">{group.description || 'No description'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Management Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students ({group.numStudents || 0})
            </CardTitle>
            <Button 
              className="gap-2"
              onClick={() => setIsAddStudentOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {group.members && group.members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.members.map((member) => {
                  const memberId = member._id || member.id || member
                  const memberName = member.firstNames && member.lastNames 
                    ? `${member.firstNames} ${member.lastNames}`
                    : member.name || 'Unknown'
                  const memberEmail = member.email || 'N/A'
                  
                  return (
                    <TableRow key={memberId}>
                      <TableCell className="font-medium">{memberName}</TableCell>
                      <TableCell>{memberEmail}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(memberId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>No students in this group yet.</p>
              <p className="text-sm mt-2">Click "Add Student" to add students to this group.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Student to Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {operationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{operationError}</AlertDescription>
                </Alert>
              )}
              <MUIFormControl fullWidth>
                <InputLabel id="student-select-label">Select Student</InputLabel>
                <Select
                  labelId="student-select-label"
                  value={selectedStudentId}
                  label="Select Student"
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {availableStudents.length === 0 ? (
                    <MenuItem disabled>No available students</MenuItem>
                  ) : (
                    availableStudents.map((student) => (
                      <MenuItem key={student.id || student._id} value={student.id || student._id}>
                        {student.firstNames} {student.lastNames} ({student.email})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </MUIFormControl>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsAddStudentOpen(false)
                  setSelectedStudentId('')
                  setOperationError(null)
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} disabled={!selectedStudentId || studentsIsLoading}>
                  Add Student
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Group
