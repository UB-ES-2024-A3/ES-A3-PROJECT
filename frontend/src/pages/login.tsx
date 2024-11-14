import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LoginService from '@/services/loginService';
import InputField from '@/components/input_field';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '', credentials: '' });

  // Checks if the username and password fields are empty
  const validateInputs = () => {
    const newErrors = { username: '', password: '', credentials: '' };
    let validInputs = true;
    if (!username) {
      newErrors.username = 'Email or username is required';
      validInputs = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      validInputs = false;
    }
    setErrors(newErrors);
    return validInputs; 
  };

  // Here's where the request will be done
  // Returns true if the user is correctly authenticated and false otherwise
  const authenticate = async () =>{
    return LoginService.loginRequest(
      username,
      password
    )
    .then(result => {
      // Login success
      console.log(result);
      setErrors({username: '', password: '', credentials: ''});
      return {isAuthenticated: true, userId: result};
    })
    .catch(errorMsgs => {
      console.log(errorMsgs);
      Object.keys(errorMsgs).forEach(key => {
        setErrors(prevErrors => ({
          ...prevErrors,
          [key]: errorMsgs[key]
        }));
      });
      return {isAuthenticated: false, userId: ''};
    });
  }

  // Handles login form submission
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from rerendering when the form is submited
    
    if (!validateInputs()){
      return;
    }

    const authenticationResult = await authenticate();

    if (authenticationResult.isAuthenticated){
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', authenticationResult.userId);
      router.push('/');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };
  return (
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
        <h1 style={{ margin: '10px 0px', width: '100%', textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <InputField label={"Username or email:"} type={"text"} id={"username"} value={username} onChange={setUsername} error={errors.username}/>
          <InputField label={"Password:"} type={"password"} id={"password"} value={password} onChange={setPassword} error={errors.password}/>
          <div style={{ margin: '10px 5px'}}>
            <button type="submit" style={{ width: '100%'}}>Login</button><br />
          </div>
        </form>
        {errors.credentials && (
          <p className="mt-1 text-sm text-red-500">{errors.credentials}</p>
        )}
        <div style={{ margin: 5}}>
          <button style={{ padding: 0, width: '100%' }} className="secondaryButton" onClick={handleRegister}>
            <u>Don&apos;t have an account? Register</u>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
