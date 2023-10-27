import axios from 'axios';
import React, { useEffect, useState, useContext, Redirect} from 'react'
import { Link, Navigate,useNavigate  } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
// import { CustomGoogleLogin } from '../Login/GoogleLogin.jsx';
// import { gapi } from 'gapi-script';
import joi from 'joi';
// import { gapi } from 'gapi-script'
// import {GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// import { useGoogleOneTapLogin } from '@react-oauth/google';
// import { GoogleLogin } from 'react-google-login';

export default function SignupAndLogin({show }) {
  let [popup, setPopup] = useState(null);
  let [changeForm, setChangeForm] = useState('login');
  const navigate = useNavigate();

  const hideLogin = (event) => {
    console.log('hide');
    event.preventDefault();
    show = false;
    setPopup(false);
    console.log({ show });
    document.body.style.overflow = 'auto';
    clearInputFields();
  }

  const clearInputFields = () => {
    // Get all the input elements with the class name 'all'
    const inputFields = document.getElementsByClassName('all-inputs');
    const feedbacks = document.getElementsByClassName('feedback');
    // Loop through each input element and set its value to ''
    for (let i = 0; i < inputFields.length; i++) {
      inputFields[i].value = '';
    }
    for (let i = 0; i < feedbacks.length; i++) {
      feedbacks[i].style.display = 'none';
    }
    // document.getElementsByName('email').value = ''
  }

  const [user, setUser] = useState({
    'userName': '',
    'email': '',
    'phone': '',
    'password': '',
    'cPassword': '',
  });

  const submitSignUpData = async (event) => {
    event.preventDefault();
    let myPopup = document.getElementById('myPopup')
    let closePopup = document.getElementById('closePopup')

    closePopup.addEventListener("click", function () {
      myPopup.classList.remove("show");
    });
    window.addEventListener("click", function (event) {
      if (event.target === myPopup) {
        myPopup.classList.remove("show");
      }
    });
    try {
      // Assuming you have the 'user' object containing the input values
      const validationResult = validateSignup(user);
      console.log({ validationResult });
      if (validationResult?.error) {
        const { error } = validationResult;
        if (error.userName) {
          document.getElementById('userNameError').textContent = 'UserName Must Contains 3 chars At Least!';
        }
        else {
          document.getElementById('userNameError').textContent = '';
        }

        if (error.email) {
          document.getElementById('emailError').textContent = 'Must Enter A Valid Email!';
        }
        else {
          document.getElementById('emailError').textContent = '';
        }

        if (error.phone) {
          document.getElementById('phoneError').textContent = 'Must Enter A Valid Phone!';
        } else {
          document.getElementById('phoneError').textContent = '';
        }

        if (error.cPassword) {
          document.getElementById('cPasswordError').textContent = "Passwords NOT Matching";
        } else {
          document.getElementById('cPasswordError').textContent = "";
        }

        if (error.password) {
          document.getElementById('cPasswordError').textContent = "-At least one digit -At least one lowercase And One UpperCase \n -Minimum length of 8 characters";
        } else {
          document.getElementById('cPasswordError').textContent = "";
        }
      }
      else {
        console.log({ user });
        const response = await axios.post('http://localhost:5000/auth/signUp', user);
        console.log({ response });
        if (response.status == 201) {
          myPopup.classList.add("show");
          document.getElementById("response-message").innerHTML = (response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      // The request was made and the server responded with a non-2xx status code
      if (error.response?.data) {
        myPopup.classList.add("show");
        document.getElementById("response-message").innerHTML = (error.response.data.message + ' Please Go To Login!');
      }
      else if (error.request) {
        // The request was made but no response was received
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        // console.log('Error', error.message);
      }
      // console.log(error.config);
      // Handle the error here
    }
  }


  const getInputValue = (event) => {
    // let myUser = { ...user };
    user[event.target.name] = event.target.value;
    setUser(user);
    // script.makeValidation(user)
    console.log({ user })
  }
  // --------------------------------------Login------------------------
  const [loginUser, setLoginUser] = useState({
    'email': '',
    'password': '',
    'isRemember': false,
  });

  const submitLoginData = async (event) => {
    console.log('hello login');
    event.preventDefault();
    try {
      // Assuming you have the 'user' object containing the input values
      const validationResult = validateLogin({email: loginUser.email, password: loginUser.password});
      console.log({ validationResult });
      if (validationResult?.error) {
        const { error } = validationResult;
        if (error.email || error.password) {
          document.getElementById('emailPasswordError').textContent = 'Must Enter A Valid Login Data!';
        }
        else {
          document.getElementById('emailError').textContent = '';
        }
      }
      else {
        const response = await axios.post('http://localhost:5000/auth/login', { email: loginUser.email, password: loginUser.password });
        console.log(response.status);
        if (response.status === 202) {
          if (loginUser.isRemember) {
            sessionStorage.setItem('token', response.data.token);
            localStorage.setItem('token', response.data.token);
          }
          else {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('token', response.data.token);
          }
          hideLogin(event);
          // alert('yyu')
          // navigate('/chat.status
          return <Navigate to="/chat" replace />;
        }
        else {
          document.getElementById('emailPasswordError').textContent = 'Something Wrong Happened!';
        }
      }
    } catch (error) {
      // The request was made and the server responded with a non-2xx status code
      if (error.response?.data) {
        document.getElementById('emailPasswordError').textContent = 'This Email Or Password Is NOT Exist!';
      }
      else if (error.request) {
        // The request was made but no response was received
        // console.log(error.request);
      } else {
      }
    }
  }

  const getLoginInputValues = (event) => {
    console.log(event.target.name);
    switch (event.target.name) {
      case 'email':
      case 'password':
        loginUser[event.target.name] = event.target.value;
        break;
      case 'isRemember':
        if (event.target.checked) {
          loginUser['isRemember'] = true;
        } else {
          loginUser['isRemember'] = false;
        }
        break;
      default:
        break;
    }
    setLoginUser(loginUser);
    // script.makeLoginValidation(loginUser)
    console.log({ loginUser })
  }

  const validateSignup = (user) => {
    const schema = joi.object({
      userName: joi.string().trim().min(3).max(25).required(),
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 4,
          tlds: { allow: ['com', 'net'] },
        })
        .required(),
      phone: joi.string().trim().pattern(/^\+?[1-9]\d{1,11}$/).required(),
      password: joi
        .string()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
      cPassword: joi.string().trim().valid(joi.ref('password')).required(),
    }).required();

    const { error, value } = schema.validate(user, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.reduce((acc, { path, message }) => {
        acc[path[0]] = message;
        return acc;
      }, {});

      return {
        error: errorDetails,
        value,
      };
    }

    return {
      error: null,
      value,
    };
  };

  const validateLogin = (user) => {
    const schema = joi.object({
      email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net'] },
      }).required(),
      password: joi.string().required(),
    }).required();

    const { error, value } = schema.validate(user, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.reduce((acc, { path, message }) => {
        acc[path[0]] = message;
        return acc;
      }, {});

      return {
        error: errorDetails,
        value,
      };
    }

    return {
      error: null,
      value,
    };
  }

  const switchForm = () => {
    console.log({ changeForm });
    changeForm === 'login' ? setChangeForm('signup') : setChangeForm('login');
  }

  useEffect(() => {
    console.log(show);
    setPopup(show);
    console.log('jjjjjjjjjjjjjjjjjjjjj');
    return () => {
      console.log('baaaaaaaaaaaaaaaay');
    };
  }, []);



  return (
    <>
      <div id='main'>
      {popup === true ?
        <div id='loginContainer'>
          {
            changeForm === 'login' ?
              <div id='login-form'>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link to="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" to="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                <link rel="stylesheet" to="css/style.css" />
                <section className="ftco-section">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-7 col-lg-5">
                        <div className="wrap">
                          <div className="login-wrap p-4 p-md-5">
                            <div className="d-flex">
                              <div className="w-100">
                                <h3 className="mb-4">Login</h3>
                              </div>
                              <div className="w-100">
                                <p className="social-media d-flex justify-content-end">
                                  <Link className="social-icon d-flex align-items-center justify-content-center">

                                    {/* {initGoogleSignIn()} */}

                                    {/* {<GoogleLogin
                                    clientId={'200689384505-lejet0f8tet6vmggh6lj08pfjtqi02v1.apps.googleusercontent.com'}
                                    onSuccess={responseMessage}
                                    onError={errorMessage}
                                    
                                    />} */}
                                    {/* className="google" */}
                                    {/* <span className="fa fa-google"> </span> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                                      </path>
                                      <path fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                                      </path>
                                      <path fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                                      </path>
                                      <path fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                                      </path>
                                    </svg>
                                  </Link>
                                  <Link to="#" className="social-icon d-flex align-items-center justify-content-center">
                                    {/* className="facebook" */}
                                    {/* <span className="fa fa-facebook" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z">
                                      </path>
                                      <path fill="#fff"
                                        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z">
                                      </path>
                                    </svg>
                                  </Link>
                                  <Link to="#" className="social-icon d-flex align-items-center justify-content-center">
                                    {/* className="twitter" */}
                                    {/* <span className="fa fa-twitter" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#03A9F4"
                                        d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429">
                                      </path>
                                    </svg>
                                  </Link>
                                </p>
                              </div>
                            </div>
                            <form onSubmit={submitLoginData} className="signin-form">
                              <div className="form-group mt-3">
                                <input onChange={getLoginInputValues} type="email" name='email' className="form-control all-inputs" required />
                                <label className="form-control-placeholder" htmlFor="email">email</label>
                                {/* <div id="email-error" class="feedback"></div> */}
                              </div>
                              <div className="form-group">
                                <input onChange={getLoginInputValues} id="password-field-login" type="password" name='password' className="form-control all-inputs" required />
                                <label className="form-control-placeholder" htmlFor="password">Password</label>
                                <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password" />
                              </div>
                              <div style={{ paddingBottom: '20px' }} id="emailPasswordError" className="feedback"></div>
                              <div className="form-group">
                                <button type="submit" className="form-control btn btn-primary rounded submit px-3">Login</button>
                              </div>
                              <div className="form-group d-md-flex">
                                <div className="w-50 text-left">
                                  <label className="checkbox-wrap checkbox-primary mb-0">Remember Me
                                    <input onChange={getLoginInputValues} type="checkbox" name='isRemember' defaultChecked />
                                    <span className="checkmark" />
                                  </label>
                                </div>
                                <div className="w-50 text-md-right">
                                  <Link style={{ color: 'rgb(0, 0, 255)' }} to="#">Forgot Password ?</Link>
                                </div>
                              </div>
                            </form>
                            <p onClick={switchForm} className="text-center">Not a member? <span className='switch-span' data-toggle="tab">Sign Up</span></p>
                            <button onClick={hideLogin} id="closeSignupForm"><b>X</b></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              :
              <div id='signup-form'>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <link to="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" to="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                <link rel="stylesheet" to="css/style.css" />
                <section className="ftco-section">
                  <div style={{ width: '70%' }} className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-7 col-lg-5">
                        <div className="wrap">
                          {/* <Link id="image-frame" to="#" className="img d-flex align-items-center justify-content-center">
                            <span className="fa fa-user-o">
                              <label className="custom-file-upload">
                                <input type="file" name="personal-image" onChange="readURL(this);" />
                                <img id="blah" src="" alt='' />
                              </label>
                            </span>
                          </Link> */}
                          <div className="login-wrap p-4 p-md-5">
                            <div className="d-flex">
                              <div className="w-100">
                                <h3 className="mb-4">Sign In</h3>
                              </div>
                              <div className="w-100">
                                <p className="social-media d-flex justify-content-end">
                                  <Link to="#" className="social-icon d-flex align-items-center justify-content-center">
                                    {/* className="google" */}
                                    {/* <span className="fa fa-google"> </span> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                                      </path>
                                      <path fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                                      </path>
                                      <path fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                                      </path>
                                      <path fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                                      </path>
                                    </svg>
                                  </Link>
                                  <Link to="#" className="social-icon d-flex align-items-center justify-content-center">
                                    {/* className="facebook" */}
                                    {/* <span className="fa fa-facebook" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z">
                                      </path>
                                      <path fill="#fff"
                                        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z">
                                      </path>
                                    </svg>
                                  </Link>
                                  <Link to="#" className="social-icon d-flex align-items-center justify-content-center">
                                    {/* className="twitter" */}
                                    {/* <span className="fa fa-twitter" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                      height="100" viewBox="0 0 48 48">
                                      <path fill="#03A9F4"
                                        d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429">
                                      </path>
                                    </svg>
                                  </Link>
                                </p>
                              </div>
                            </div>
                            <form onSubmit={submitSignUpData} className="signin-form">
                              <div className="form-group mt-3">
                                <input onChange={getInputValue} type="text" className="form-control all-inputs" name='userName' required />
                                <label className="form-control-placeholder" htmlFor="username">Username</label>
                                <div id="userNameError" className="feedback"></div>
                              </div>
                              <div className="form-group mt-3">
                                <input onChange={getInputValue} type="email" className="form-control all-inputs" name='email' required />
                                <label className="form-control-placeholder" htmlFor="email">email</label>
                                <div id="emailError" className="feedback"></div>
                              </div>
                              <div className="form-group mt-3">
                                <input onChange={getInputValue} type="text" className="form-control all-inputs" name='phone' required />
                                <label className="form-control-placeholder" htmlFor="phone">phone</label>
                                <div id="phoneError" className="feedback"></div>
                              </div>
                              <div className="form-group">
                                <input onChange={getInputValue} id="password-field-signUp" type="password" name='password' className="form-control all-inputs" required />
                                <label className="form-control-placeholder" htmlFor="password">Password</label>
                                <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password" />
                              </div>
                              {/* <div style={{ paddingBottom: '20px' }} id="passwordError" className="feedback"></div> */}
                              <div className="form-group">
                                <input onChange={getInputValue} id="Confirm-password-field" type="password" className="form-control all-inputs" name='cPassword' required />
                                <label className="form-control-placeholder" htmlFor="Confirm-password">Confirm
                                  Password</label>
                                <span toggle="#Confirm-password-field" className="fa fa-fw fa-eye field-icon toggle-password" />
                              </div>
                              <div style={{ paddingBottom: '20px' }} id="cPasswordError" className="feedback"></div>
                              <div className="form-group">
                                <button type="submit" className="form-control btn btn-primary rounded submit px-3">Sign In</button>
                              </div>
                            </form>
                            <p onClick={switchForm} className="mt-4">I'm already a member! <span className='switch-span' data-toggle="tab" >Login</span></p>
                          </div>
                        </div>
                        <button style={{ right: '20px' }} onClick={hideLogin} id="closeSignupForm"><b>X</b></button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
          }

          <div>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style dangerouslySetInnerHTML={{ __html: "\n        .popup {\n            position: fixed;\n            z-index: 1;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            overflow: auto;\n            background-color: rgba(0, 0, 0, 0.4);\n            display: none;\n        }\n        .popup-content {\n            background-color: white;\n            margin: 10% auto;\n            padding: 20px;\n            border: 1px solid #888888;\n            width: 30%;\n            font-weight: bolder;\n        }\n        .popup-content button {\n            display: block;\n            margin: 0 auto;\n        }\n        .show {\n            display: block;\n        }\n        h1 {\n            color: green;\n        }\n    " }} />

            <div id="myPopup" className="popup">
              <div className="popup-content">
                <h1 style={{ color: 'green' }}>
                  Announce !
                </h1>
                <p id="response-message"></p>
                {/* <span>Please Go To Login!</span> */}
                <button id="closePopup">
                  X
                </button>
              </div>
            </div>
          </div>
        </div>
        : ''
      }
      </div>
    </>
  )
}

