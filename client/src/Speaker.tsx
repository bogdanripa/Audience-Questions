import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { BackendService } from "@genezio-sdk/audience-questions";
import Questions from './Questions';
import QR from './QR';

type SpeakerProps = {
  setUsersOnline: (count: number) => void
}

export default function Speaker({ setUsersOnline }: SpeakerProps) {
  const navigate = useNavigate();

  useEffect( () => {
    const secret = localStorage.getItem('secret') || '';

    BackendService.checkSecret(secret)
      .then((isValid: boolean) => {
        if (!isValid)
          navigate('/secret/');
      })
  }, []);

  return (
    <>
        <Questions mode="speaker" setUsersOnline={setUsersOnline}/>
        <div className="qr-speaker"><QR/></div>
    </>
  );
}
