import { useCities } from '../context/CitiesContext';
import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Message from './Message';
import Spinner from './Spinner';

const CountryList = () => {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message='Add your 1st city by clicking on a city on the map' />
    );
  }

  const countries = cities.reduce((array, city) => {
    if (!array.map((el) => el.country).includes(city.country)) {
      return [...array, { country: city.country, emoji: city.emoji }];
    } else {
      return array;
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
};

export default CountryList;
