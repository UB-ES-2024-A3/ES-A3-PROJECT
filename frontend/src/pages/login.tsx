import { useRouter } from 'next/router';
import React, { useState } from 'react';

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
  const authenticate = () =>{
    setErrors({ username: '', password: '', credentials: 'Incorrect username/email or password' });
    return false;
  }

  // Handles login form submission
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the page from rerendering when the form is submited
    
    if (!validateInputs()){
      return;
    }

    const isAuthenticated = authenticate();

    if (isAuthenticated){
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100vh'}}>
      <div style={{ boxShadow: "0 1px 1px 0 grey", margin: 20, padding: 25, backgroundColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
        <h2 style={{ margin: '10px 0px' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ margin: 5}}>
            <label> Username or email:</label><br />
            <input type="text" id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className={`w-full px-3 py-2 pr-10 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 ${
                errors.username ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } transition-colors`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          <div style={{ margin: 5}}>
            <label> Password: </label><br />
            <input type="password" id="password"  
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={`w-full px-3 py-2 pr-10 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } transition-colors`}
            /> 
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            
          </div>
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
