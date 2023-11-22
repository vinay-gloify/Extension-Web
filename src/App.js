/*global chrome*/
import "./App.css";
import { useEffect, useState } from "react";
import Forms from "./components/Forms";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getCurrentUser } from "./utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  const [login, setlogin] = useState(true);
  const [islogedIn, setislogedIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [dashboardView, setdashboardView] = useState(false);
 
  
  useEffect(() => {
    const token = getCurrentUser();
    if (token) {
      setlogin(false);
      setislogedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <div className="data">
        {login && (
          <>
            <Login
              setlogin={setlogin}
              setislogedIn={setislogedIn}
              setSignUp={setSignUp}
            />
          </>
        )}
        {islogedIn && (
          <>
            <Forms
              setlogin={setlogin}
              setislogedIn={setislogedIn}
              setdashboardView={setdashboardView}
            />
          </>
        )}
        {signUp && (
          <>
            <Signup
              setlogin={setlogin}
              setislogedIn={setislogedIn}
              setSignUp={setSignUp}
            />
          </>
        )}
        {/* {dashboardView && (
          <>
            <UserDashboard
              setlogin={setlogin}
              setislogedIn={setislogedIn}
              setSignUp={setSignUp}
            />
          </>
        )} */}
      </div>
      <ToastContainer autoClose={2000} style={{ width: "300px", margin:"0 0 0 6rem" }}/>
    </div>
  );
}

export default App;
