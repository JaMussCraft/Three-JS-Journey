import { useState } from 'react'
import Clicker from './Clicker.jsx'
import People from './People.jsx'

export default function App() {
  const [hasClicker, setHasClicker] = useState(true)
  const [count, setCount] = useState(0)

  const toggleClicker = () => {
    setHasClicker(!hasClicker)
  }

  const increment = () =>
  {
    setCount(count + 1)
  }

  return (
    <>
      <People></People>

      <div>Total count: {count}</div>

      <button onClick={toggleClicker}>{hasClicker ? 'Hide' : 'Show'} Clicker</button>
      {hasClicker ? (
        <>
          <Clicker increment={increment} keyName="countA" textColor={`hsl(${Math.random() * 360}deg, 100%, 70%)`} />
          ` <Clicker increment={increment} keyName="countB" textColor={`hsl(${Math.random() * 360}deg, 100%, 70%)`} />
          <Clicker increment={increment} keyName="countC" textColor={`hsl(${Math.random() * 360}deg, 100%, 70%)`} />
        </>
      ) : null}
    </>
  )
}
