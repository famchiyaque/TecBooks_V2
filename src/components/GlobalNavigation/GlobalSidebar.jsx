import React, { useEffect } from 'react'
import { useNavigation } from './NavigationContext'
import NavigationItem from './NavigationItem'
import { navigationConfig } from './navigationConfig'
import { Close, Menu } from '@mui/icons-material'
import './globalNavigation.css'

function GlobalSidebar() {
  const { isOpen, toggleNavigation } = useNavigation()

  // Keyboard shortcut: Ctrl/Cmd + B
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleNavigation()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleNavigation])

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="global-nav-backdrop"
          onClick={toggleNavigation}
        />
      )}

      {/* Sidebar */}
      <nav className={`global-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="global-nav-header">
          <div className="global-nav-brand">
            {isOpen && (
              <>
                <span className="brand-logo">📊</span>
                <span className="brand-name">TecBooks</span>
              </>
            )}
          </div>
          <button 
            className="nav-toggle-btn"
            onClick={toggleNavigation}
            aria-label="Toggle navigation"
          >
            {isOpen ? <Close /> : <Menu />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="global-nav-content">
          {navigationConfig.map(item => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </div>

        {/* Footer with keyboard shortcut hint */}
        {isOpen && (
          <div className="global-nav-footer">
            <span className="keyboard-hint">
              Press <kbd>Ctrl</kbd> + <kbd>B</kbd> to toggle
            </span>
          </div>
        )}
      </nav>
    </>
  )
}

export default GlobalSidebar
