import { useState, useEffect } from "react"

export default function Clicker({ keyName, textColor='black', increment})
{
    const [ count, setCount ] = useState(parseInt(localStorage.getItem(keyName)?? 0))

    useEffect(() => {
        return () => {
            localStorage.removeItem(keyName)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(keyName, count)

    }, [ count ])

    const buttonClick = () => 
    {
        setCount(count + 1)
        increment()
    }


    return <div>
        <div>Clicks count: { count }</div>
        <button onClick={ buttonClick } 
                style={{ color: textColor }}>
                Click me!
        </button>


    </div>
    
}