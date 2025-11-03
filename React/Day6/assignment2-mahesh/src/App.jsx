import Student from "./components/student"

function App() {
  return (
    <div>
      <h2>Student List</h2>
      <Student name="Mahesh" age="19" course="CSE" />
      <Student name="Riya" age="20" course="IT" />
      <Student name="Amit" age="21" course="AIML" />
    </div>
  )
}

export default App
