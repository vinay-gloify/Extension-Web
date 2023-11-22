import React, { useState } from "react";
import { API_ENDPOINT } from "../services/api";
import requestInstance from "../utils/request";
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import "./login.css"
import Navbar from "./navbar/Navbar";


const validate = values => {
  const errors = {};

  if (!values.first_name) {
       errors.first_name = 'Please Enter Firstname';
     } 
     else if (/^(?=.*?[0-9])/i.test(values.first_name)) {
      errors.first_name = 'Must not contain number';
    }
    else if (/(?=.*?[#?!@$%^&*-])/i.test(values.first_name)){
      errors.first_name = 'Must not contain special characters'
    }

    else if (!values.email) {
      errors.email = 'Please Enter Email';
    } 
    
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
  
   else if (!values.password) {
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

function Signup(props) {
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
  });

  function togglePasswordVisibility() {
    setHidePassword(!hidePassword);
}

const handleLoginClick = () => {
    props.setislogedIn(false);
    props.setSignUp(false);
    props.setlogin(true);
  };

  const formik = useFormik({
    initialValues:{
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    },
    validate,
    onSubmit: signup => {
      setLoading(true);
      handleApiCall(signup)

    }
  })

  const handleApiCall = (signup) => {
    let value = {
      "email": signup.email,
      "first_name": signup.first_name,
      "last_name": signup.last_name,
      "password": signup.password
    };
    requestInstance.post(API_ENDPOINT.SIGNUP_API, value).then((res) => {
      //console.log(res);
      if (res.data.status == "success") {
        toast.success(res.data.message);
        props.setislogedIn(false);
        props.setSignUp(false);
        props.setlogin(true);
        setLoading(false);
      }
    })
   .catch((error) =>{
    setLoading(false);
    //console.log(error.response.data);
  });
  };

  // const handleChange = (prop) => (event) => {
  //   setUserData({ ...userData, [prop]: event.target.value });
  // };

  // const handleCreateAccount = (e) => {
  //   e.preventDefault();
  //   handleApiCall(userData);
  // };
  return (
    <div>
      <Navbar />
      <div className="form-group row p-4">
        <div className="col-xs-3 ">
          <h2 className="my-3 text-center fs-4">Create an account</h2>
          <form onSubmit={formik.handleSubmit}>
          <label className="form-label mt-3">First Name</label>
          <input
          id="first_name"
          name="first_name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
         value={formik.values.first_name}
            className="form-control"
            //onChange={handleChange("first_name")}
            type="text"
          />
          {formik.touched.first_name && formik.errors.first_name ? (
         <div className="errorfirst">{formik.errors.first_name}</div>
       ) : null}
          <label className="form-label mt-3">Last Name</label>
          <input
          id="last_name"
          name="last_name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
         value={formik.values.last_name}
            className="form-control"
           // onChange={handleChange("last_name")}
            type="text"
          />
          {/* <label className="form-label mt-3">Phone</label>
          <input
            className="form-control "
            onChange={handleChange("phone_number")}
            id="ex2"
            type="phone number"
          /> */}
          <label className="form-label mt-3">Email</label>
          <input
           name="email"
            className="form-control "
            onChange={formik.handleChange}
               onBlur={formik.handleBlur}
              value={formik.values.email}
            //onChange={handleChange("email")}
            id="email"
            type="email"
          />
           {formik.touched.email && formik.errors.email ? (
         <div className="errorfirst">{formik.errors.email}</div>
       ) : null}
          <label className="form-label mt-3">Password</label>
          <input
          type={hidePassword ? "password" : "text"}
            className="form-control"
            //onChange={handleChange("password")}
            id="password"
            name="password"
            onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
            
          />
          <div onClick={togglePasswordVisibility}> {hidePassword? (<AiOutlineEye  className="signupeye" />): (<AiOutlineEyeInvisible className="signupeye"/>)}</div>
          {formik.touched.password && formik.errors.password ? (
                <div className="errormsgpass">{formik.errors.password}</div>
              ) : null}
        
        <button
          
          className="btn w-100 btn-primary mt-3"
          type="submit" disabled={loading}
        >
          {loading ? <>Registering...</> : <>SignUp</>}
        </button>
        </form>
        </div>
        <div>
          <p className="h6 mt-3 d-flex justify-content-center">
            Already have an account?{" "}
            <span
              onClick={(e) => handleLoginClick(e)}
              className=" ms-2 text-black-50 cursor-pointer"
            >
              {" "}
              Login{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
