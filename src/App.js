// src/App.js
import React from 'react';
import Landfills from './Landfills';
import AddLandfill from './AddLandfill';

const App = () => {
  return (
    <div>
      <h1>Landfill Management</h1>
      <AddLandfill />
      <Landfills />
    </div>
  );
};

export default App;
