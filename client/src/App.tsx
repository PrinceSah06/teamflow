import './App.css'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import DashBoard from './pages/DashBoard';
import InviteAccept from './pages/InviteAccept';
import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {

  return <>
  <Routes>
    <Route path='/'  element={<Home/>} /> 
    <Route path='/login'  element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} /> 
    <Route path='/signup'  element={<PublicOnlyRoute><SignUp/></PublicOnlyRoute>} /> 
    <Route path='/dashboard'  element={<PrivateRoute><DashBoard/></PrivateRoute>} /> 
    <Route path='/dashBoard'  element={<PrivateRoute><DashBoard/></PrivateRoute>} /> 
    <Route path='/invite/:token'  element={<PrivateRoute><InviteAccept/></PrivateRoute>} /> 
    <Route path='*' element={<Navigate to='/' replace />} />
    </Routes></>}
  export default App
