import React from 'react'
import Paper from '@mui/material/Paper'
import { PiStudent } from "react-icons/pi"
import { GiTeacher } from "react-icons/gi"
import { FaSchool } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'

function StartRegistry() {
  const navigate = useNavigate()

  const cards = [
    {
      title: "Students",
      icon: <PiStudent className="text-6xl text-blue-600 mb-4" />,
      description: "Create an account to join your professors' classes and participate in production line simulator games!",
      route: "student",
      bg: "bg-blue-50",
      hover: "hover:bg-blue-100"
    },
    {
      title: "Professors",
      icon: <GiTeacher className="text-6xl text-green-600 mb-4" />,
      description: "Configure, create, and organize simulator games for your students.",
      route: "professor",
      bg: "bg-green-50",
      hover: "hover:bg-green-100"
    },
    {
      title: "Institution",
      icon: <FaSchool className="text-6xl text-purple-600 mb-4" />,
      description: "Register your institution to give your professors and students access to the simulator and dashboards.",
      route: "institution",
      bg: "bg-purple-50",
      hover: "hover:bg-purple-100"
    }
  ]

  return (
    <div className='w-full'>
      <Typography variant='h3' sx={{ marginTop: '2rem' }}>Choose your user type</Typography>
      <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-around items-stretch gap-6 py-10">
        {cards.map((card) => (
          <Paper
            key={card.title}
            elevation={6}
            onClick={() => navigate(`/mxrep/register/${card.route}`)}
            className={`cursor-pointer flex flex-col items-center p-6 rounded-xl transition-all duration-300 ${card.bg} ${card.hover} hover:shadow-xl w-80`}
          >
            {card.icon}
            <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
            <p className="text-center text-gray-700">{card.description}</p>
          </Paper>
        ))}
      </div>
    </div>
  )
}

export default StartRegistry
