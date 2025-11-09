import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes,Route} from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import RoomPage from './pages/RoomPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/room/:roomId"  element={<RoomPage/>}></Route>
       </Routes>
    </>
  )
}

export default App
