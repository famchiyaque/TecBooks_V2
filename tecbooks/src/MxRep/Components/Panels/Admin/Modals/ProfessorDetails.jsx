import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Divider } from '@mui/material'
import Status from '@/MxRep/Components/General/Status'
// import Loader from '@/Global Components/Loader'
import { GiUpgrade } from "react-icons/gi";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function ProfessorDetails({ open, onClose, professor }) {
    // const [professorDetails, setProfessorDetails] = useState(null)

    // useEffect(() => {
    //     const response = getProfessorDetails(professor.professorId)
    //     setProfessorDetails(response.data)
    // }, [])

    const getStatusVariant = () => {
        if (professor.isAdmin) return "super"
        else return "normal"
    }
    const getStatusContent = () => {
        if (professor.isAdmin) return "Admin"
        else return "Normal"
    }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className='w-full flex justify-between mx-2'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {professor.firstNames} {professor.lastNames}
            </Typography>

            <div>
                <Status variant={getStatusVariant()} content={getStatusContent()} />
                <GiUpgrade className="cursor-pointer hover:text-blue-500"  />
            </div>
        </div>

        <Divider />

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Implementation of get more professor details coming soon...
        </Typography>
        {/* Add your form fields here */}
      </Box>
    </Modal>
  )
}

export default ProfessorDetails