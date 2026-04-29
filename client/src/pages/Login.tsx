import { Link } from "react-router-dom"
import { useState } from "react"
import type { FormEvent } from "react"
import { useAuthStore } from "../store/authStore"

type LoginForm = {
  email: string
  password: string
}

const Login = () => {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")

    try {
      const successMessage = await login(formData)
      setMessage(successMessage)
      setFormData({ email: "", password: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <p>Welcome back</p>
          <h1>Login</h1>
        </div>

        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(event) =>
              setFormData((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter your password"
            minLength={4}
            required
          />
        </div>

        {error && <p className="auth-alert error">{error}</p>}
        {message && <p className="auth-alert success">{message}</p>}

        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New user? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
