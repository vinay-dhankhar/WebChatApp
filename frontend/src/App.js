import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import { useEffect } from "react";

function App() {
  // const useLogoutOnTabClose = () => {
    useEffect(() => {
      const handleTabClose = () => {
        // Clear the authentication token from local storage
        localStorage.removeItem('userInfo');
      };
  
      // Add event listener for tab close
      window.addEventListener('beforeunload', handleTabClose);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', handleTabClose);
      };
    }, []);
  // };
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<HomePage/>} ></Route>
      <Route path="/chat" element={<ChatPage/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
