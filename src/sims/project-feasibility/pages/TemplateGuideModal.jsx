import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MobileStepper,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'

// One slide per InputNovus sheet that actually needs explaining, in the
// order someone filling the template would hit them, plus a last slide
// showing where Inversion/Capacidad end up once parsed (Fixed Assets).
const SLIDES = [
  {
    image: '/imgs/template-guide/01-empleados.png',
    title: 'Employees',
    description:
      'One row per position. "Tipo" must be exactly "operacion" or "administracion" - that\'s what classifies it as direct/indirect labor, engineering or administrative. "Percepcion" is the base monthly salary; IMSS/Infonavit/Vales de Despensa/Prima Vacacional/Aguinaldo/Fondo de Ahorro/Comedor/ISR are the % or amounts that build the real integrated salary.',
  },
  {
    image: '/imgs/template-guide/02-inversion.png',
    title: 'Investment (Inversion)',
    description:
      'Fixed assets grouped by category (Transport Equipment, Buildings, Computer Equipment, Machinery and Equipment…). Each asset\'s value repeats the same across every year column - it\'s the same book value, not a fresh purchase every year.',
  },
  {
    image: '/imgs/template-guide/03-bom.png',
    title: 'BOM (Bill of Materials)',
    description:
      'One row per product component: Id, Description, Quantity, Cost and scrap/yield % (Sxrap). "Costo de Venta" (sale cost) and "Costo de Materia Prima" (raw material cost) are computed on their own from these rows - don\'t fill them in by hand.',
  },
  {
    image: '/imgs/template-guide/04-capacidad.png',
    title: 'Capacity',
    description:
      'Top: the line parameters (Quality Yield, seconds per unit, shifts, working days per week, etc.) that determine annual capacity. Bottom: the machine table (Line/Machine, operators, cycle time, acquisition value per year) - this is where machinery lives if you don\'t also put it in Investment.',
  },
  {
    image: '/imgs/template-guide/05-demanda.png',
    title: 'Demand (Customer Orders)',
    description:
      'The monthly % breakdown of how the year\'s demand is spread out, the historical totals from previous years, and the projected "Year Zero" total per year. This feeds every purchase/production order in the project.',
  },
  {
    image: '/imgs/template-guide/06-fixed-assets-result.jpg',
    title: 'Where this shows up in TecBooks',
    description:
      'Every category you filled in Investment (and Capacity\'s machinery, if it\'s not also in Investment) becomes a row in Fixed Assets, with accumulated depreciation computed automatically year by year - this is how it looks once loaded into the platform.',
  },
]

/**
 * Walkthrough of the official InputNovus template (what each sheet is for,
 * what has to be filled) shown right after downloading it from NewProgram -
 * viewable as slides or skipped outright, same escape hatch every step.
 */
function TemplateGuideModal({ open, onClose }) {
  const [step, setStep] = useState(0)
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  const handleClose = () => {
    setStep(0)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 22, color: '#073a5a' }}>
          {step + 1}. {slide.title}
        </Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(7, 58, 90, 0.03)',
            borderRadius: 2,
            p: 1,
            mb: 2,
            minHeight: 320,
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 8 }}
          />
        </Box>
        <Typography sx={{ fontSize: 18, color: 'text.secondary' }}>
          {slide.description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button onClick={handleClose} sx={{ fontSize: 16 }}>
          Skip
        </Button>

        <MobileStepper
          variant="dots"
          steps={SLIDES.length}
          position="static"
          activeStep={step}
          sx={{ bgcolor: 'transparent', flexGrow: 1, justifyContent: 'center' }}
          nextButton={null}
          backButton={null}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            startIcon={<ArrowBackIosNew sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 16 }}
          >
            Back
          </Button>
          {isLast ? (
            <Button variant="contained" onClick={handleClose} sx={{ fontSize: 16, bgcolor: '#073a5a', borderRadius: 999 }}>
              Done
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setStep((s) => s + 1)}
              endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}
              sx={{ fontSize: 16, bgcolor: '#073a5a', borderRadius: 999 }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default TemplateGuideModal
