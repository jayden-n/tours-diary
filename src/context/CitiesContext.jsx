import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };

    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
      };

    default:
      throw new Error('Unknown action type.');
  }
};
const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch {
        dispatch({
          type: 'rejected',
          payload: alert('There was an error loading cities...'),
        });
      }
    };
    fetchCities();
  }, []);

  // GETTING A CITY //
  async function getCity(id) {
    // optimize when clicking on the same country
    if (Number(id) === currentCity.id) return;
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch {
      dispatch({
        type: 'rejected',
        payload: alert('There was an error loading city...'),
      });
    }
  }
  // CREATING A CITY //
  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch {
      dispatch({
        type: 'rejected',
        payload: alert('There was an error loading city...'),
      });
    }
  }
  // DELETING A CITY //
  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({
        type: 'rejected',
        payload: alert('There was an error loading city...'),
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('useContext was used outside of the provider');

  return context;
}
export { CitiesProvider, useCities };
