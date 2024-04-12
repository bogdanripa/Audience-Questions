import Questions from './Questions';
import QR from './QR';

type SpeakerProps = {
  setUsersOnline: (count: number) => void
}

export default function Speaker({ setUsersOnline }: SpeakerProps) {
  return (
    <>
        <Questions mode="speaker" setUsersOnline={setUsersOnline}/>
        <div className="qr-speaker"><QR/></div>
    </>
  );
}
