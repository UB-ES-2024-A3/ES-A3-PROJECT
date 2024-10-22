import { useRouter } from 'next/router';
import { useState } from 'react';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fakes a login 
  const handleLogin = () => {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <h2 style={{ margin: 10 }}>{isLogin ? 'Login' : 'Register'}</h2>
        <form>
            <div style={{ margin: 5}}>
                <label> Username: </label><br />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={setUsername}
                  required
                /><br />
            </div>
            {!isLogin && (
                <div style={{ margin: 5}}>
                    <label> Email: </label><br />
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={setEmail}
                      required
                    /><br />
                </div>
            )}
            <div style={{ margin: 5}}>
                <label> Password: </label><br />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={setPassword}
                  required
                /><br />
            </div>
            <button type="submit" onClick={handleLogin}>Login</button><br />
        </form>
        <div>
          <button style={{ color: 'blue', backgroundColor: 'white', padding: 0, margin: 10}}
            onClick={() => setIsLogin(!isLogin)}
          >
            <u>{isLogin ? "Don't have an account? Register" : "Already have an account? Login"}</u>
          </button>
        </div>
    </div>
  );
};

export default LoginPage;
