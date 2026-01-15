import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import ProfessorPanelLayout from './Layout'
import ManageGames from '@/MxRep/Views/Panel/Professor/ManageGames'
import GameView from '@/MxRep/Views/Panel/Professor/Game/Game'
import CreateGame from '@/MxRep/Views/Panel/Professor/CreateGame'
import ManageGroups from '@/MxRep/Views/Panel/Professor/ManageGroups'
import GroupView from '@/MxRep/Views/Panel/Professor/Group/Group'
import CreateGroup from '@/MxRep/Views/Panel/Professor/CreateGroup'
import ManageClasses from '@/MxRep/Views/Panel/Professor/ManageClasses'
import ClassView from '@/MxRep/Views/Panel/Professor/Class/Class'
import CreateClass from '@/MxRep/Views/Panel/Professor/CreateClass'
import Inbox from '@/MxRep/Views/Panel/Professor/Inbox'
import Profile from '@/MxRep/Views/Panel/Professor/Profile'

function ProfessorPanelRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProfessorPanelLayout />}>
        <Route index element={<Navigate to="manage-games" />} />

        <Route path="create-game" element={<CreateGame />} />
        <Route path="create-group" element={<CreateGroup />} />
        <Route path="create-class" element={<CreateClass />} />

        <Route path="manage-games">
          <Route index element={<ManageGames />} />
          <Route path=":gameId" element={<GameView />} />
        </Route>

        <Route path="manage-groups">
          <Route index element={<ManageGroups />} />
          <Route path=":groupId" element={<GroupView />} />
        </Route>

        <Route path="manage-classes">
          <Route index element={<ManageClasses />} />
          <Route path=":classId" element={<ClassView />} />
        </Route>

        <Route path="inbox" element={<Inbox />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default ProfessorPanelRouter