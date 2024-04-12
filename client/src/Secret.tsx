import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function QR() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const updatePassword = async () => {
        localStorage.setItem('secret', password);
        navigate('/speaker/');
    };

    return (
        <div className="new-question">
            <label htmlFor="newQuestion">Enter speaker secret:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        updatePassword();
                    }
                }}
            />
            <button onClick={updatePassword}>Send</button>
        </div>
    );
}