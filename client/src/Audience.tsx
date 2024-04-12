import NewQuestion from './NewQuestion';
import Questions from './Questions';

type AudienceProps = {
  setUsersOnline: (count: number) => void
}

export default function Audience({ setUsersOnline }: AudienceProps) {
  return (
    <>
        <NewQuestion/>
        <h2>Vote on existing questions</h2>
        <Questions mode="audience" setUsersOnline={setUsersOnline}/>
    </>
  );
}
