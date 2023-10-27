import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignupAndLogin from '../SignupAndLogin/SignupAndLogin.jsx';
import Chat from '../Chat/Chat.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={!token ? <SignupAndLogin show = {true} /> : <Navigate to="/chat" replace />} />
          {/* <Route path="/" element={<SignupAndLogin show={true} />} /> */}
          <Route path="/chat" element={token ? <Chat /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;