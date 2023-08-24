import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import { useCities } from '../context/CitiesContext';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');

  const { isLoading } = useCities();
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (isLoading) {
      return <Spinner />;
    }

    e.preventDefault();

    await login(email, password);
  };

  // check if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // MUST add "replace" for navigating backwards
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button type='primary'>Login</button>
        </div>
      </form>
    </main>
  );
}
