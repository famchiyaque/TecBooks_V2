import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, User, Briefcase, X, Check } from 'lucide-react'

function ApproveProfessor({ professorData, onApprove, onReject }) {
  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Institution (Read-only) - Full Width */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Institution
            </label>
            <Input
              value={professorData.institution}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>

          {/* Two Column Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Names */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name(s)
              </label>
              <Input
                value={professorData.firstNames}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>

            {/* Last Names */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name(s)
              </label>
              <Input
                value={professorData.lastNames}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <Input
                value={professorData.email}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Department
              </label>
              <Input
                value={professorData.department}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Additional Info */}
          {professorData.requestDate && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Request Date:</span>
                <span className="text-slate-700 font-medium">
                  {new Date(professorData.requestDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onReject}
              className="flex-1 gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button 
              type="button"
              onClick={onApprove}
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ApproveProfessor

