import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fakes a login 
  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100vh'}}>
      <div style={{ boxShadow: "0 1px 1px 0 grey", margin: 20, padding: 25, backgroundColor: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
        <h2 style={{ margin: '10px 0px' }}>Login</h2>
        <form>
          <div style={{ margin: 5}}>
            <label> Username or email:</label><br />
            <input type="text" id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} required
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
          <div style={{ margin: '10px 5px'}}>
            <button type="submit" onClick={handleLogin} style={{ width: '100%'}}>Login</button><br />
          </div>
        </form>
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
