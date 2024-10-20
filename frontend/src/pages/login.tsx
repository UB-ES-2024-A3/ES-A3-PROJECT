import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const router = useRouter();

  // Fakes a login 
  const handleLogin = () => {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
