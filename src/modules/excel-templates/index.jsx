import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TemplateSelector from './TemplateSelector'
import TemplateUpload from './TemplateUpload'

function ExcelTemplates() {
  return (
    <Routes>
      <Route path="/" element={<TemplateSelector />} />
      <Route path="/upload" element={<TemplateUpload />} />
    </Routes>
  )
}

export default ExcelTemplates
