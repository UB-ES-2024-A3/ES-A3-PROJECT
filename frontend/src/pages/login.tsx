import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const router = useRouter();

  // Fakes a login 
  const handleLogin = () => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', 'userTest1'); // This datum comes from the form fields, or from the server?. For presentation in profile.
      localStorage.setItem('userAuthToken', 'fillerToken'); // This datum is sent from the server. To let it know it is the user who sends requests.
      router.push('/');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
