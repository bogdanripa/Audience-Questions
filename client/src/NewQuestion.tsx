import { useState } from "react";
import { BackendService, Question } from "@genezio-sdk/audience-questions"

export default function NewQuestion() {
    const [question, setQuestion] = useState("");

    const sendQuestion = async () => {
        let q:Question = {text: question}
        try {
            await BackendService.newQuestion(q);
        } catch(e) {
            alert(e.message);
        }
        setQuestion("");
    };

    return (
        <div className="new-question">
            <label htmlFor="newQuestion">Ask a new question:</label>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendQuestion();
                    }
                }}
            />
            <button onClick={sendQuestion}>Send</button>
        </div>
    );
}
