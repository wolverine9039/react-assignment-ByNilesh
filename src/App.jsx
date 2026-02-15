import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './constants/activities.js'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div id='pro' className='container'>     
      <div id='input'>
        <input id='tfield' type='text' enterKeyHint='task'></input>
      </div>
      
    
    </div>
  )
}

export default App
