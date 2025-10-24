import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Divider from '@mui/material/Divider'

function Card({ professor }) {
  return (
    <Card>
        <CardHeader className='text-left'>
            <CardTitle className="text-2xl">{professor.firstNames}{professor.lastNames}</CardTitle>
            <CardDescription>{professor.email}</CardDescription>
        </CardHeader>
        <Divider variant="middle" />

        <CardContent>
            <p>Classes: {professor.numClasses}</p>
            <p>Groups: {professor.numGroups}</p>
            <p>Games: {professor.numGames}</p>
        </CardContent>
    </Card>
  )
}

export default Card