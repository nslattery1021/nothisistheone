// src/Landfills.js
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listLandfills } from './graphql/queries';

const Landfills = () => {
  const [landfills, setLandfills] = useState([]);
  const client = generateClient();

  useEffect(() => {
    fetchLandfills();
  }, []);

  const fetchLandfills = async () => {
    try {
      const landfillsData = await client.graphql({ query: listLandfills });
      setLandfills(landfillsData.data.listLandfills.items);
    } catch (error) {
      console.error('Error fetching landfills:', error);
    }
  };

  return (
    <div>
      <h1>Landfills</h1>
      <ul>
        {landfills.map(landfill => (
          <li key={landfill.id}>
            {landfill.name} - {landfill.address}, {landfill.city}, {landfill.state}, {landfill.zip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Landfills;
