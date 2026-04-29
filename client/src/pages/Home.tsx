import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="home-page">
      <nav className="home-nav">
        <Link to="/">Home</Link> |{" "}
        <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>

      <section className="auth-status">
        <h1>Auth State</h1>
        {user ? (
          <>
            <p>Logged in as {user.email}</p>
            <p className="token-preview">
              Token: {accessToken ? `${accessToken.slice(0, 20)}...` : "No token"}
            </p>
            <button className="auth-button" type="button" onClick={() => void logout()}>
              Logout
            </button>
          </>
        ) : (
          <p>You are not logged in.</p>
        )}
      </section>
    </div>
  )
}

export default Home
