import './App.css';
import Chat from '../Chat/Chat.jsx';
import Signup from '../Signup/Signup.jsx';



function App() {
  const token = localStorage.getItem('token');

  console.log(token);
  return (
    <div className="App">
      {!token ? <Signup /> : <Chat />}
    </div>
  );
}

export default App;