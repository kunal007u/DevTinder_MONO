import React from 'react'
import { Route, Routes } from 'react-router'
import Body from './Components/Body'

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Body/>} />
        </Routes>
    </>
  )
}

export default App
