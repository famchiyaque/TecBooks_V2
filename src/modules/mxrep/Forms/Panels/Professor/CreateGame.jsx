import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { 
  Select as MUISelect, 
  MenuItem, 
  FormControl as MUIFormControl, 
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material'
import { Gamepad2, DollarSign, Calendar, Package, Building2, Users, Wrench, Factory, Receipt, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useGetProfessorGroups, useGetTemplates, useGetDefaultConfigs } from '@/MxRep/utils/hooks/professor.hooks'
import { useAuth } from '@/MxRep/utils/contexts/AuthContext'
import Loader from '@/components/global/Loader'

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

const DEFAULT_ORDERS_BY_MONTH = {
  january: 0.08,
  february: 0.09,
  march: 0.08,
  april: 0.08,
  may: 0.08,
  june: 0.09,
  july: 0.08,
  august: 0.08,
  september: 0.09,
  october: 0.08,
  november: 0.09,
  december: 0.08
}

const createGameSchema = z.object({
  name: z.string().min(3, 'Game name must be at least 3 characters'),
  description: z.string().optional().or(z.literal('')),
  groupId: z.string().min(1, 'Group is required'),
  initialCapital: z.number().min(1, 'Initial capital must be at least 1'),
  gameDurationMonths: z.number().min(1, 'Game duration must be at least 1 month').max(12, 'Maximum 12 months'),
  ordersPerYear: z.number().min(1, 'Orders per year must be at least 1'),
})

function CreateGame({ onSubmit, isCreating }) {
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const { groups, groupsIsLoading, getProfessorGroups } = useGetProfessorGroups()
  const { templates, templatesIsLoading, getTemplates } = useGetTemplates()
  const { defaultConfigs, configsIsLoading, getDefaultConfigs } = useGetDefaultConfigs()
  
  const [selectedTemplates, setSelectedTemplates] = useState({
    boms: [],
    expenses: []
  })
  const [ordersByMonth, setOrdersByMonth] = useState(DEFAULT_ORDERS_BY_MONTH)
  const [activeTab, setActiveTab] = useState('basic')
  const [expandedBoms, setExpandedBoms] = useState(false)
  const [expandedExpenses, setExpandedExpenses] = useState(false)

  const form = useForm({
    resolver: zodResolver(createGameSchema),
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      name: '',
      description: '',
      groupId: '',
      initialCapital: 1000000,
      gameDurationMonths: 12,
      ordersPerYear: 100000,
    }
  })

  useEffect(() => {
    if (!isInitialized || authLoading || !user) return
    
    getProfessorGroups(user.userId)
    getTemplates()
    getDefaultConfigs()
  }, [isInitialized, authLoading, user, getProfessorGroups, getTemplates, getDefaultConfigs])

  useEffect(() => {
    if (defaultConfigs) {
      // Set default values from configs
      if (defaultConfigs.gameSettings) {
        form.setValue('initialCapital', defaultConfigs.gameSettings.initialCapital || 1000000)
        form.setValue('gameDurationMonths', defaultConfigs.gameSettings.gameDurationMonths || 12)
      }
      if (defaultConfigs.ordersConfig) {
        form.setValue('ordersPerYear', defaultConfigs.ordersConfig.ordersPerYear || 100000)
        // Only update ordersByMonth if we have valid data from backend
        if (defaultConfigs.ordersConfig.ordersByMonth && Object.keys(defaultConfigs.ordersConfig.ordersByMonth).length > 0) {
          setOrdersByMonth(defaultConfigs.ordersConfig.ordersByMonth)
        }
      }
    }
  }, [defaultConfigs, form])

  const handleTemplateToggle = (category, id) => {
    setSelectedTemplates(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(item => item !== id)
        : [...prev[category], id]
    }))
  }

  const handleMonthChange = (month, value) => {
    setOrdersByMonth(prev => ({
      ...prev,
      [month]: parseFloat(value) || 0
    }))
  }

  const handleSubmit = (data) => {
    // Calculate total percentage to validate
    const totalPercentage = Object.values(ordersByMonth).reduce((sum, val) => sum + val, 0)
    
    if (Math.abs(totalPercentage - 1.0) > 0.01) {
      alert('Month percentages must sum to 1.0 (currently: ' + totalPercentage.toFixed(2) + ')')
      return
    }

    const gameData = {
      name: data.name,
      description: data.description,
      groupId: data.groupId,
      initialCapital: data.initialCapital,
      gameDurationMonths: data.gameDurationMonths,
      ordersConfig: {
        ordersPerYear: data.ordersPerYear,
        ordersByMonth: ordersByMonth
      },
      // Include selected templates
      selectedBOMIds: selectedTemplates.boms,
      selectedExpenseIds: selectedTemplates.expenses,
    }

    if (onSubmit) {
      onSubmit(gameData)
    }
  }

  const isLoading = authLoading || groupsIsLoading || templatesIsLoading || configsIsLoading

  if (!isInitialized || authLoading) {
    return <Loader message="Loading session..." />
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-12">
          <Loader message="Loading form data..." />
        </CardContent>
      </Card>
    )
  }

  const totalPercentage = Object.values(ordersByMonth).reduce((sum, val) => sum + val, 0)
  const isPercentageValid = Math.abs(totalPercentage - 1.0) < 0.01

  return (
    <Card className="border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="orders">Orders & Premises</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        Game Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the game objectives and content"
                          className="resize-none h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear description of what students will learn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Group
                      </FormLabel>
                      <FormControl>
                        <MUIFormControl fullWidth>
                          <MUISelect
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select a group
                            </MenuItem>
                            {groups?.map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name} - {group.className}
                              </MenuItem>
                            ))}
                          </MUISelect>
                        </MUIFormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Orders & Premises Tab */}
              <TabsContent value="orders" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="initialCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Initial Capital
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Starting budget for teams</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gameDurationMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Game Duration (Months)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max="12"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ordersPerYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Orders Per Year
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Total number of orders throughout the year</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium">Monthly Order Distribution</label>
                    <span className={`text-sm font-medium ${isPercentageValid ? 'text-green-600' : 'text-red-600'}`}>
                      Total: {totalPercentage.toFixed(3)} {isPercentageValid ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Percentage of yearly orders for each month (must sum to 1.0)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MONTHS.map((month) => (
                      <div key={month} className="space-y-1">
                        <label className="text-xs font-medium capitalize text-slate-700">
                          {month}
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={ordersByMonth[month] || 0}
                          onChange={(e) => handleMonthChange(month, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  {!isPercentageValid && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Percentages must sum to 1.0. Current total: {totalPercentage.toFixed(3)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="space-y-4 mt-4">
                {templatesIsLoading ? (
                  <Loader message="Loading templates..." />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Select the Bill of Materials (products) and expenses that will be available in this game.
                    </p>

                    {/* BOMs Collapsible */}
                    {templates?.boms && templates.boms.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedBoms(!expandedBoms)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-slate-700" />
                            <h3 className="font-semibold text-slate-900">
                              Bill of Materials (BOMs)
                            </h3>
                            <span className="text-sm font-normal text-slate-500">
                              ({selectedTemplates.boms.length} of {templates.boms.length} selected)
                            </span>
                          </div>
                          {expandedBoms ? (
                            <ChevronUp className="h-5 w-5 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-600" />
                          )}
                        </button>
                        {expandedBoms && (
                          <div className="p-4 border-t">
                            <FormGroup>
                              {templates.boms.map((bom) => (
                                <FormControlLabel
                                  key={bom._id || bom.id}
                                  control={
                                    <Checkbox
                                      checked={selectedTemplates.boms.includes(bom._id || bom.id)}
                                      onChange={() => handleTemplateToggle('boms', bom._id || bom.id)}
                                    />
                                  }
                                  label={
                                    <span className="text-sm">
                                      {bom.name || bom.productName} 
                                      {bom.sellingPrice && ` - $${bom.sellingPrice}`}
                                    </span>
                                  }
                                />
                              ))}
                            </FormGroup>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expenses Collapsible */}
                    {templates?.expenses && templates.expenses.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedExpenses(!expandedExpenses)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-slate-700" />
                            <h3 className="font-semibold text-slate-900">
                              Expenses
                            </h3>
                            <span className="text-sm font-normal text-slate-500">
                              ({selectedTemplates.expenses.length} of {templates.expenses.length} selected)
                            </span>
                          </div>
                          {expandedExpenses ? (
                            <ChevronUp className="h-5 w-5 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-600" />
                          )}
                        </button>
                        {expandedExpenses && (
                          <div className="p-4 border-t">
                            <FormGroup>
                              {templates.expenses.map((expense) => (
                                <FormControlLabel
                                  key={expense._id || expense.id}
                                  control={
                                    <Checkbox
                                      checked={selectedTemplates.expenses.includes(expense._id || expense.id)}
                                      onChange={() => handleTemplateToggle('expenses', expense._id || expense.id)}
                                    />
                                  }
                                  label={
                                    <span className="text-sm">
                                      {expense.name}
                                      {expense.monthlyCost && ` - $${expense.monthlyCost}/month`}
                                    </span>
                                  }
                                />
                              ))}
                            </FormGroup>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty State */}
                    {(!templates?.boms || templates.boms.length === 0) && 
                     (!templates?.expenses || templates.expenses.length === 0) && (
                      <div className="text-center py-8 text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p>No templates available</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="submit"
                disabled={isCreating || !isPercentageValid}
                className="flex-1 gap-2"
              >
                <Gamepad2 className="h-4 w-4" />
                {isCreating ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateGame
