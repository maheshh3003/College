import { useState } from "react"
import Student from "./components/student"

function App() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [course, setCourse] = useState("")

  function addStudent() {
    const s = { name: name, age: age, course: course }
    students.push(s)
    setStudents([...students])
    setName("")
    setAge("")
    setCourse("")
  }

  return (
    <div>
      <h2>Student List</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
      <button onClick={addStudent}>Add</button>

      {students.map((x, i) => (
        <Student key={i} name={x.name} age={x.age} course={x.course} />
      ))}
    </div>
  )
}

export default App
