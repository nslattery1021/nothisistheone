import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getLandfills, gasWellsByLandfillsID } from './graphql/queries';
import { Modal, Title, Text } from '@mantine/core';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path
import { onCreateGasWells, onUpdateGasWells, onDeleteGasWells } from './graphql/subscriptions';

const LandfillProfile = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [gasWells, setGasWells] = useState([]);
  const isMobile = window.innerWidth <= 768;
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

    const createSub = client.graphql({
      query: onCreateGasWells,
      }).subscribe({
      next: (eventData) => {
          console.log("Created New GasWell",eventData)
        const newEntry = eventData.data.onCreateGasWells;
        console.log(newEntry)
        if (newEntry.landfillsID === id) {
          setGasWells((prevGasWells) => [...prevGasWells, newEntry]);
        }
      }
    });
    
    /* update a todo */
    const updateSub = client.graphql({
      query: onUpdateGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Updated New GasWell",eventData)
  
        const updatedEntry = eventData.data.onUpdateGasWells;
        setGasWells((prevGasWells) =>
          prevGasWells.map((gasWell) =>
              gasWell.id === updatedEntry.id ? updatedEntry : gasWell
          )
        );
      }
    });
    
    /* delete a todo */
    const deleteSub = client.graphql({
      query: onDeleteGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Deleted New GasWell",eventData)
  
        const deletedEntry = eventData.data.onDeleteGasWells.id;
        setGasWells((prevGasWells) =>
          prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
        );
      }
    });
  
  
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [id]);

  if (!landfill) {
    return <div>Loading...</div>;
  }

  return (
    
    <div style={{height: "80%"}}>
      <h3 style={{padding: "0 0.75rem"}}>{landfill.name}</h3>
      <div style={{position: 'absolute', top: '120px', height: isMobile ? '80%' : '90%', width: '100%'}}>
        <GoogleMapComponent lat={landfill.lat} lng={landfill.lng} gasWells={gasWells}/>
      </div>
    </div>
  );
};

export default LandfillProfile;
