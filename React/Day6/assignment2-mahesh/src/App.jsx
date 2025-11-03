import { useState } from "react"
import Student from "./components/student"

function App() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [course, setCourse] = useState("")

  function addStudent() {
    if (name && age && course) {
      const newStudent = { name, age, course }
      setStudents([...students, newStudent])
      setName("")
      setAge("")
      setCourse("")
    }
  }

  return (
    <div>
      <h2>Student List</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <button onClick={addStudent}>Add Student</button>

      {students.map((s, index) => (
        <Student key={index} name={s.name} age={s.age} course={s.course} />
      ))}
    </div>
  )
}

export default App
