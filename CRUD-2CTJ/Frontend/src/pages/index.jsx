import React from 'react';
import Reservation from '../pages/ReservasOnline/index';
import NavBar from '../components/NavBar/index';

function Home() {
  return (
      <div className="App">
        <NavBar />
        <Reservation />
      </div>
  );
}

export default Home;
