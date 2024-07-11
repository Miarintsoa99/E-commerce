import React, { useState } from "react";
import "./CSS/LoginSignUp.css";

const LoginSignup = () => {
  // état pour changer en login ou sign up
  const [state, setState] = useState("Login");

  // état pour gérer les champs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login fonction executer",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method : 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type' : 'application/json',
      },
      body :JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>{
         responseData = data
    }) 
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } 
    else {
      alert(responseData.error)
    }
  };

  const signup = async () => {
    console.log("Sign up fonction exécuter",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method : 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type' : 'application/json',
      },
      body :JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>{
         responseData = data
    }) 
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } 
    else {
      alert(responseData.error)
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign up" ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={changeHandler}
              placeholder="Your name"
              required
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email Adress"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
            required
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign up" ? (
          <p className="loginsignup-login">
            Already Have an account{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              {" "}
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account ?
            <span
              onClick={() => {
                setState("Sign up");
              }}
            >
              {" "}
              Click here
            </span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing , I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
