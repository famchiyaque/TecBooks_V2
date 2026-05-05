import React, { createContext, useContext, useState, useEffect } from 'react'

const NavigationContext = createContext()

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}

export const NavigationProvider = ({ children }) => {
  // Always start closed (only opens when user clicks hamburger menu)
  const [isOpen, setIsOpen] = useState(false)

  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('globalNavExpandedSections')
    return saved !== null ? JSON.parse(saved) : []
  })

  const [recentPages, setRecentPages] = useState(() => {
    const saved = localStorage.getItem('globalNavRecentPages')
    return saved !== null ? JSON.parse(saved) : []
  })

  // Persist expanded sections and recent pages to localStorage
  useEffect(() => {
    localStorage.setItem('globalNavExpandedSections', JSON.stringify(expandedSections))
  }, [expandedSections])

  useEffect(() => {
    localStorage.setItem('globalNavRecentPages', JSON.stringify(recentPages))
  }, [recentPages])

  const toggleNavigation = () => {
    setIsOpen(prev => !prev)
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId)
      } else {
        return [...prev, sectionId]
      }
    })
  }

  const isSectionExpanded = (sectionId) => {
    return expandedSections.includes(sectionId)
  }

  const addRecentPage = (page) => {
    setRecentPages(prev => {
      const filtered = prev.filter(p => p.path !== page.path)
      const updated = [page, ...filtered].slice(0, 5)
      return updated
    })
  }

  const value = {
    isOpen,
    setIsOpen,
    toggleNavigation,
    expandedSections,
    toggleSection,
    isSectionExpanded,
    recentPages,
    addRecentPage
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
