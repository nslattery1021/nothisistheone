import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getLandfills, gasWellsByLandfillsID } from './graphql/queries';
import { Modal, Title, Text } from '@mantine/core';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path

const LandfillProfile = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [gasWells, setGasWells] = useState([]);

  const client = generateClient();

  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const landfillData = await client.graphql({
            query: getLandfills,
            variables: { id: id }
        });
        setLandfill(landfillData.data.getLandfills);

        const gasWellsData = await client.graphql({
            query: gasWellsByLandfillsID,
            variables: { landfillsID: id }
        });
        setGasWells(gasWellsData.data.gasWellsByLandfillsID.items);

      } catch (error) {
        console.error('Error fetching gaswells:', error);
      }
    };

    fetchLandfill();
  }, [id]);

  if (!landfill) {
    return <div>Loading...</div>;
  }

  return (
    
    <div style={{height: "80%"}}>
      <h3 style={{padding: "0 0.75rem"}}>{landfill.name}</h3>
      <div style={{position: 'relative'}}>
        <GoogleMapComponent lat={landfill.lat} lng={landfill.lng} gasWells={gasWells}/>
      </div>
    </div>
  );
};

export default LandfillProfile;
