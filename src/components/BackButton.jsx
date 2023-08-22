import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      type='back'
      // NICE TRICK: GOING BACK TO THE PREV PAGE
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
};

export default BackButton;
