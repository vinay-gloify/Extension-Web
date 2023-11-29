import React, { useState } from "react";
import { API_ENDPOINT } from "../services/api";
import requestInstance from "../utils/request";
import { setCurrentUser } from "../utils/utils";
import Navbar from "./navbar/Navbar";
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import "./login.css"


const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please Enter Email';
  } 

  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

   if (!values.password) {
    errors.password = 'Please Enter Password';
  } 

  else if (!/^(?=.*?[a-z])/i.test(values.password)) {
    errors.password = 'Must contain lowercase';
  }
  else if (!/^(?=.*?[0-9])/i.test(values.password)) {
    errors.password = 'Must contain number';
  }
  else if (!/.{4,}/i.test(values.password)) {
    errors.password = 'Must have 4 characters';
  }

  return errors;
};


function Login(props) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [hidePassword, setHidePassword] = useState(true);

  function togglePasswordVisibility() {
    setHidePassword(!hidePassword);
}

const formik = useFormik({
  initialValues:{
    email:'',
    password:'',
  },
  validate,
  onSubmit: login => {
    setLoading(true);
    handleLoginClick(login)
  }
})


  const handleLoginClick = (login) => {
    // e.preventDefault();
    let value = {
      "email": login.email,
      "password" : login.password,
    };
      
      requestInstance.post(API_ENDPOINT.LOGIN_API, value).then((res) => {
        if (res?.data?.status == "success") {
          setCurrentUser(res.data.access);
         localStorage.setItem("email", login.email);
         toast.success(res.data.status)
          props.setislogedIn(true);
          props.setlogin(false);
          setLoading(false);
          //console.log(res.data.status)
        }
      })
     .catch((error) => {
      setLoading(false);
      //console.log(error.response.data);
    })
  };

  // const handleChange = (prop) => (event) => {
  //   setUserData({ ...userData, [prop]: event.target.value });
  // };

  const handleSignUpClick = () => {
    props.setSignUp(true);
    props.setlogin(false);
  };
  return (
    <div>
      <Navbar/>
    <div className="d-flex justify-content-center">
      
    <div className="col-10 form-group row">
    
      <form onSubmit={formik.handleSubmit}>
        <div className="col-xs-3 ">
          <h2 className="my-3 text-center fs-4">Log in to your account</h2>
          <label htmlFor="userName" className="form-label">
            Email
          </label>
          <input
            className="form-control my-2"
            id="email"
            type="email"
            name="email"
            onChange={formik.handleChange}
               onBlur={formik.handleBlur}
              value={formik.values.email}
            // onChange={handleChange("email")}
           
          />
           {formik.touched.email && formik.errors.email ? (
         <div className="errormsg">{formik.errors.email}</div>
       ) : null}
          <label htmlFor="userName" className="form-label">
            Password
          </label>
          <input
           type={hidePassword ? "password" : "text"}
            className="form-control"
            id="password"
            name="password"
           // onChange={handleChange("password")}
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
            
          />
           <div onClick={togglePasswordVisibility}> {hidePassword? (<AiOutlineEye  className="signineye" />): (<AiOutlineEyeInvisible className="signineye"/>)}</div>
          {formik.touched.password && formik.errors.password ? (
                <div className="errormsgpass">{formik.errors.password}</div>
              ) : null}
          <div className="getpassword text-end"><a href="https://www.discovemail.com/forget" target="_blank" className="text-decoration-none"> <span>Forgot Password?</span></a></div>
        </div>
        <button className="btn w-100 btn-danger mt-3" disabled={loading} type="submit">
        {loading ? <>Signing...</> : <>Login</>}
        </button>
      </form>
      <div>
        <p className="h6 mt-3 d-flex justify-content-center">
          Don't have an account ?{" "}
          <span
            onClick={(e) => handleSignUpClick(e)}
            className=" ms-2 text-black-50 cursor-pointer"
          >
            
            Sign up
          </span>
        </p>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Login;
