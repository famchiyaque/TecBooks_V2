import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import StudentPanelLayout from './Layout'
import MyGames from '@/MxRep/Views/Panel/Student/MyGames'
import GameView from '@/MxRep/Views/Panel/Student/Game/Game'
import JoinGame from '@/MxRep/Views/Panel/Student/JoinGame'
import Inbox from '@/MxRep/Views/Panel/Student/Inbox'
import Profile from '@/MxRep/Views/Panel/Student/Profile'


function StudentPanelRouter() {

  return (
    <Routes>

      <Route path="/" element={ <StudentPanelLayout /> }>
        <Route index element={ <Navigate to="my-games" /> } />

        <Route path="join-game" element={ <JoinGame /> } />

        <Route path="my-games">
          <Route index element={<MyGames />} />
          <Route path=":gameId" element={<GameView />} />
        </Route>

        <Route path="inbox" element={ <Inbox /> } />
        <Route path="profile" element={ <Profile /> } />
      </Route>
      
    </Routes>
  )
}

export default StudentPanelRouter