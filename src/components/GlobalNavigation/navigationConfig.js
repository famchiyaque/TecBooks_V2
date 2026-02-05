import { 
  Dashboard, 
  Description, 
  Upload, 
  Assessment, 
  School,
  TrendingUp,
  ShowChart,
  HelpOutline,
  MenuBook
} from '@mui/icons-material'

/**
 * Global Navigation Configuration
 * 
 * Defines the structure and hierarchy of the application's main navigation
 */

export const navigationConfig = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/home',
    type: 'link'
  },
  {
    id: 'erp-simulator',
    label: 'ERP Simulator',
    icon: 'Dashboard',
    type: 'section',
    children: [
      {
        id: 'templates',
        label: 'Templates',
        icon: 'Description',
        type: 'subsection',
        children: [
          {
            id: 'browse-templates',
            label: 'Browse Templates',
            path: '/templates',
            type: 'link'
          },
          {
            id: 'upload-template',
            label: 'Upload Template',
            path: '/templates/upload',
            type: 'link'
          }
        ]
      },
      {
        id: 'in-app',
        label: 'In-App Survey',
        icon: 'Assessment',
        path: '/survey',
        type: 'link'
      },
      {
        id: 'from-mxrep',
        label: 'From MxRep',
        icon: 'School',
        path: '/mxrep',
        type: 'link',
        description: 'Import data from MxRep simulation'
      }
    ]
  },
  {
    id: 'mxrep',
    label: 'MxRep',
    icon: 'School',
    type: 'section',
    description: 'Educational Production Simulator',
    children: [
      {
        id: 'mxrep-signin',
        label: 'Sign In / Go to Panel',
        path: '/mxrep',
        type: 'link'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Interactive Tools',
    icon: 'TrendingUp',
    type: 'section',
    description: 'Visual tools for financial concepts',
    children: [
      {
        id: 'project-evaluation',
        label: 'Project Evaluation',
        icon: 'TrendingUp',
        path: '/sims/project-evaluation',
        type: 'link',
        description: 'NPV, IRR, ROI calculator'
      },
      {
        id: 'sales-forecaster',
        label: 'Sales Forecaster',
        icon: 'ShowChart',
        path: '/sims/forecasting',
        type: 'link',
        description: 'Forecast sales with multiple models'
      }
    ]
  },
  {
    id: 'divider-1',
    type: 'divider'
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: 'HelpOutline',
    path: '/faq',
    type: 'link'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'MenuBook',
    path: '/docs',
    type: 'link',
    disabled: true // Coming soon
  }
]

// Icon mapping for string-based icon references
export const iconMap = {
  Home: 'Home',
  Dashboard: Dashboard,
  Description: Description,
  Upload: Upload,
  Assessment: Assessment,
  School: School,
  TrendingUp: TrendingUp,
  ShowChart: ShowChart,
  HelpOutline: HelpOutline,
  MenuBook: MenuBook
}
