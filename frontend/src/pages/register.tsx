import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RegisterService from '@/services/registerService';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errors, setErrors] = useState({message: '', isUsername: false, isEmail: false});

  // Fakes a register
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from rerendering when the form is submitted
    if(password == repeatedPassword) {
      if (await sendRequest()) {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/');
      }
    }
  };

  const sendRequest = async () => {
    return RegisterService.registerRequest(
      username,
      email,
      password
    )
    .then(result => {
      console.log(result);
      setErrors({message: '', isUsername: false, isEmail: false});
      return true;
    })
    .catch(errorMsg => {
      const isUsernameError = errorMsg.toLowerCase().includes('username');
      const isEmailError = errorMsg.toLowerCase().includes('email');
      console.log(errorMsg);
      setErrors({message: errorMsg, isUsername: isUsernameError, isEmail: isEmailError});
      return false;
    });
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100vh'}}>
      <div style={{ boxShadow: "0 1px 1px 0 grey", margin: 20, padding: 25, backgroundColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
        <h2 style={{ margin: '10px 0px' }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={{ margin: 5}}>
            <label> Username: </label><br />
            <input type="text" id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} required
              style={{padding: 3}}
            /><br />
          </div>
          <div style={{ margin: 5}}>
            <label> Email: </label><br />
            <input type="email" id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} required
              style={{padding: 3}}
            /><br />
          </div>
          <div style={{ margin: 5}}>
            <label> Password: </label><br />
            <input type="password" id="password"  
              value={password} 
              onChange={(e) => setPassword(e.target.value)} required
              style={{padding: 3}}
            /><br />
          </div>
          <div style={{ margin: 5}}>
            <label> Repeat the password: </label><br />
            <input type="password" id="repPassword"  
              value={repeatedPassword} 
              onChange={(e) => setRepeatedPassword(e.target.value)} required
              style={{padding: 3}}
            /><br />
          </div>
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
  );
};

export default RegisterPage;
