import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home,
  Dashboard, 
  Description, 
  Upload, 
  Assessment, 
  School,
  TrendingUp,
  ShowChart,
  HelpOutline,
  MenuBook,
  ChevronRight,
  ExpandMore
} from '@mui/icons-material'
import { useNavigation } from './NavigationContext'

const iconMap = {
  Home: Home,
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

function NavigationItem({ item, level = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSection, isSectionExpanded, addRecentPage, isOpen, toggleNavigation } = useNavigation()

  const isActive = item.path && location.pathname.startsWith(item.path)
  const isExpanded = isSectionExpanded(item.id)
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon ? iconMap[item.icon] : null

  const handleClick = () => {
    if (item.disabled) return

    if (item.type === 'section' || item.type === 'subsection') {
      toggleSection(item.id)
    } else if (item.path) {
      navigate(item.path)
      addRecentPage({
        label: item.label,
        path: item.path,
        timestamp: Date.now()
      })
      // Close navigation on mobile after clicking a link
      if (window.innerWidth <= 1024) {
        toggleNavigation()
      }
    }
  }

  if (item.type === 'divider') {
    return <div className="nav-divider" />
  }

  const indentLevel = level * 16

  return (
    <div className="nav-item-container">
      <div
        className={`nav-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''} level-${level}`}
        onClick={handleClick}
        style={{ paddingLeft: `${16 + indentLevel}px` }}
      >
        {Icon && (
          <Icon className="nav-icon" sx={{ fontSize: level === 0 ? 24 : 20 }} />
        )}
        
        {isOpen && (
          <>
            <span className="nav-label">{item.label}</span>
            
            {hasChildren && (
              <div className="nav-expand-icon">
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </div>
            )}
          </>
        )}
      </div>

      {hasChildren && isExpanded && isOpen && (
        <div className="nav-children">
          {item.children.map(child => (
            <NavigationItem 
              key={child.id} 
              item={child} 
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NavigationItem
