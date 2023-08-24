import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'user/login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'user/logout':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      throw new Error('Unknown action');
  }
};

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'user/login', payload: FAKE_USER });
    // else {
    //   alert('Wrong credentials');
    // }
  };
  const logout = () => {
    dispatch({ type: 'user/logout' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Auth Context was used outside the AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
