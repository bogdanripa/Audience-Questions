import { useState, useEffect } from "react";
import { BackendService, Question } from "@genezio-sdk/audience-questions"
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

type QuestionsProps = {
    mode: string,
    setUsersOnline: (count: number) => void
  }

export default function Questions({mode, setUsersOnline}: QuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const navigate = useNavigate();

    let ws: Socket;

    const onNewQuestion = (newQuestion: Question) => {
        // Update the state with the new array of questions
        setQuestions((prevState) => [...prevState,newQuestion]);
    }

    const onUpdateQuestion = (q: Question) => {
        // Update the state with the new array of questions
        setQuestions((prevState: Question[]) => {
            const newState = prevState
                .map(question => {
                    if (question.text === q.text) {
                        return { ...question, ...q }; // Update the existing question with `q`
                    }
                    return question; // Return the question unchanged
                })
                .filter(question => !question.answered); // Remove questions that are marked as answered

            // Then, sort the updated list by votes in descending order
            newState.sort((a, b) => {
                // Assuming votes is optional, default to 0 if undefined
                const votesA = a.votes || 0;
                const votesB = b.votes || 0;

                return votesB - votesA; // For descending order
            });

            return newState;
        });
    }

    const onUserCountUpdate = (uc: number) => {
        setUsersOnline(uc);
    }

    const initWSComms = async () => {
        // Determine the current URL and port of the client application
        // Create a new WebSocket instance and connect to the server
        let url:string = await BackendService.getSecketURL()
        ws = io(url);

        // Event listener for WebSocket open connection
        ws.on('connect', () => {
            console.log('WebSocket connected');
            // Send a "ping" command after connection
            ws.timeout(5000).emit('ping');
        });
        
        // Event listener for receiving messages from the server
        ws.on('pong', () => {
            console.log('Received pong from server');
        });

        ws.on('new question', onNewQuestion);
        ws.on('update question', onUpdateQuestion);
        ws.on('user count', onUserCountUpdate)
        
        // Event listener for WebSocket connection close
        ws.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
    };

    const fetchQuestions = async () => {
        try {
            const fetchedQuestions = await BackendService.getQuestions(true);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }

    useEffect( () => {
        if (mode == "speaker") {
            let secret = localStorage.getItem('secret') || '';
            if (!secret) {
                navigate('/secret/');
                return;
            }
        }
        fetchQuestions();
        initWSComms();
    }, []);

    const handleVote = async (q: Question) => {
        try {
            // Check if the question ID exists in local storage
            const votedQuestions = JSON.parse(localStorage.getItem('votedQuestions') || '[]');
            if (votedQuestions.includes(q.text)) {
                // User has already voted on this question
                alert('You have already voted on this question.');
                return; // Exit the function
            }
    
            // Vote on the question using the BackendService
            await BackendService.vote(q);
    
            // Update the local state to reflect the new vote count
            // (You'll need to implement this part)
    
            // Add the question ID to local storage to indicate that it has been voted on
            localStorage.setItem('votedQuestions', JSON.stringify([...votedQuestions, q.text]));
        } catch (error) {
            console.error("Error voting:", error);
        }
    };
   
    const handleAnswered = async (q: Question) => {
        try {
            let secret:string = localStorage.getItem('secret') || '';
            await BackendService.answer(q, secret);
            // Update the local state to reflect the new vote count
        } catch (error) {
            console.error("Error answering:", error);
            navigate('/secret/');
        }
    };

    return (
        <>
            <ul id="questionsList">
                {questions.map(question => (
                    <li key={question.text}>
                        <span>{question.text} ({question.votes} votes)</span>
                        {mode === "audience" ? (
                            <button onClick={() => handleVote(question)}>Up</button>
                        ) : (
                            <button onClick={() => handleAnswered(question)}>Answer</button>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}