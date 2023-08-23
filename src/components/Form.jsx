// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from '../context/CitiesContext';

const popperModifiers = [
  {
    name: 'arrow',
    options: { padding: 24 },
  },
];
// Emoji helper function
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState('');

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError('');

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        // Error handling when user click on the river
        if (!data.countryCode) {
          throw new Error('Sorry :( That does not seem like a city...');
        }
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
    // actively changing the country name when click
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !date) {
      return;
    }

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);

    navigate('/app/cities');
  };

  if (isLoadingGeocoding) {
    return <Spinner />;
  }
  if (!lat && !lng)
    return <Message message='Start by clicking somewhere on the map' />;

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>

        <ReactDatePicker
          id='date'
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
          popperModifiers={popperModifiers}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
