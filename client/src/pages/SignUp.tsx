import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

type SignUpForm = {
  email: string
  password: string
}

const SignUp = () => {
  const signup = useAuthStore((state) => state.signup)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [formData, setFormData] = useState<SignUpForm>({
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
      const successMessage = await signup(formData)
      setMessage(successMessage)
      setFormData({ email: "", password: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <p>Create your account</p>
          <h1>Sign Up</h1>
        </div>

        <div className="field-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            value={formData.password}
            onChange={(event) =>
              setFormData((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Minimum 4 characters"
            minLength={4}
            required
          />
        </div>

        {error && <p className="auth-alert error">{error}</p>}
        {message && <p className="auth-alert success">{message}</p>}

        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
