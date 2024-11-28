import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RegisterService from '@/services/registerService';
import InputField from '@/components/input_field';
import Image from 'next/image';
import Head from 'next/head';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', username: '', password: '', repeatedPassword: ''});

  const validateEmail = () => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return 'Email is required';
    }
    else if (!emailRegex.test(email)) {
      return "Email format is incorrect. Please enter a valid email address (e.g., name@company.com)";
    }
    return '';
  }

  const validateUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!username) {
      return 'Username is required';
    }
    if (!usernameRegex.test(username)){
      return 'Username contains invalid characters. Only letters, numbers, periods, and underscores are allowed';
    }
    return '';
  }

  const validatePassword = () => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8){
      return "The password must be at least 8 characters long";
    }
    return '';
  }
  
  const validateRepeatedPassword = () => {
    if (!repeatedPassword) {
      return 'Repeating the password is required';
    }
    if (password != repeatedPassword){
      return "The passwords introduced doesn't match";
    }
    if (repeatedPassword.length < 8){
      return "The password must be at least 8 characters long";
    }
    return '';
  }

  const validateInputs = () => {
    const emailError = validateEmail();
    const usernameError = validateUsername();
    const passwordError = validatePassword();
    const repeatedPasswordError = validateRepeatedPassword();

    const newErrors = { 
      email: emailError, 
      username: usernameError, 
      password: passwordError, 
      repeatedPassword: repeatedPasswordError 
    };

    setErrors(newErrors);

    return !emailError && !usernameError && !passwordError && !repeatedPasswordError; 
  };

  // Fakes a register
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from rerendering when the form is submitted
    if (!validateInputs())
      return;
    const registerResult = await sendRequest();
    if (registerResult.isRegistered) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', registerResult.userId);
      router.push('/profile');
    }
  };

  const sendRequest = async () => {
    return RegisterService.registerRequest(
      username,
      email,
      password
    )
    .then(result => {
      setErrors({ email: '', username: '', password: '', repeatedPassword: ''});
      return {isRegistered: true, userId: result};
    })
    .catch(errorMsg => {
      const errorType = errorMsg.toLowerCase().includes('username') ? "username": "email";
      console.log(errorType, errorMsg);
      setErrors(prevErrors => ({
        ...prevErrors,
        [errorType]: errorMsg
      }));
      return {isRegistered: false, userId: ''};
    });
  };

  const handleLogin = () => {
    router.push('/login');
  };



  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
        <div style={{ 
          boxShadow: "0 1px 1px 0 grey", 
          margin: "10%", 
          padding: "4%", 
          backgroundColor: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          width: '33%',  
          borderRadius: "5%"
        }}>
          <Image src='/rebook_logo.png' alt='Rebook Logo' width={200} height={200} />
          <h1 style={{ margin: '10px 0px', width: '100%', textAlign: 'center', fontSize: '32pt' }}>Register</h1>
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <InputField label={"Username:"} type={"text"} id={"username"} value={username} onChange={setUsername} error={errors.username}/>
            <InputField label={"Email:"} type={"text"} id={"email"} value={email} onChange={setEmail} error={errors.email}/>
            <InputField label={"Password:"} type={"password"} id={"password"} value={password} onChange={setPassword} error={errors.password}/>
            <InputField label={"Password (repeat):"} type={"password"} id={"password2"} value={repeatedPassword} onChange={setRepeatedPassword} error={errors.repeatedPassword}/>
            <div style={{ margin: '10px 5px'}}>
              <button type="submit" style={{ width: '100%'}}>Register</button><br />
            </div>
          </form>
          <div style={{ margin: 5}}>
            <button style={{ padding: 0, width: '100%' }} className="secondaryButton" onClick={handleLogin}>
              <u>Already have an account? Login</u>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
