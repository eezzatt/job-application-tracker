import { useState } from 'react'

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [position, setPosition] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState("")
  const [jobId, setJobId] = useState("")
  const [token, setToken] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  

  const handleRegister = async () => {
    try {
      setError(null)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      }
      else {
        setToken(data.token)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }


  const handleLogin = async () => {
    try {
      setError(null)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      }
      else {
        setToken(data.token)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }


  const handleInsert = async () => {
    try{
      setError(null)
      setResult(null)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ position, company, status })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      }
      else {
        setResult(data)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }


  const handleRetrieve = async () => {
    try {
      setError(null)
      setResult(null)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/retrieve`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      }
      else {
        setResult(data)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }


  const handleUpdate = async () => {
    try {
      setError(null)
      setResult(null)

      const response = await fetch (`${import.meta.env.VITE_API_URL}/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      }
      else {
        setResult(data)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {token ?
        (<div>
          <h1>JOB APPLICATION TRACKER</h1>
          <input
            type='text'
            placeholder='Enter your job position here'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter your company here'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter the application status here'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <button onClick={handleInsert}>Insert</button>
          {result && <p>Job application inserted: {JSON.stringify(result)}</p>}
          {error && <p>Error: {error}</p>}
          <button onClick={handleRetrieve}>Retrieve</button>
          {result && <p>Job applications: {JSON.stringify(result)}</p>}
          {error && <p>Error: {error}</p>}
          <input
            type='text'
            placeholder='Enter the job ID here'
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          {result && <p>New job status: {JSON.stringify(result)}</p>}
          {error && <p>Error: {error}</p>}
        </div>) : 
        (<div>
          <h1>LOGIN/REGISTER</h1>
            <input
              type='text'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            {error && <p>Error: {error}</p>}
        </div>)
      }
    </div>
  )
}

export default App