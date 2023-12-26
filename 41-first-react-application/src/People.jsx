import { useEffect, useState } from 'react'

export default function People() {
  const [people, setPeople] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'George' },
    { id: 3, name: 'Peter' },
  ])

  const getPeople = () =>
  {
      fetch('https://jsonplaceholder.typicode.com/users')
          .then(response => response.json())
          .then(result => setPeople(result))

  }

//   getPeople()
  useEffect(() => getPeople(), [])

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  )
}
