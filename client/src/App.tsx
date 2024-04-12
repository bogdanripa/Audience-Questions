import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import "./App.css";
import Header from './Header';
import Audience from './Audience';
import Speaker from './Speaker';
import QR from './QR';
import Secret from './Secret';

export default function App() {
  const [usersOnline, setUsersOnline] = useState(0);

  return (
    <>
      <Header usersOnline={usersOnline}/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Audience setUsersOnline={setUsersOnline}/>} />
          <Route path="/speaker" element={<Speaker setUsersOnline={setUsersOnline}/>} />
          <Route path="/qr" element={<QR/>} />
          <Route path="/secret" element={<Secret/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
