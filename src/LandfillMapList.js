// src/Landfills.js
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listLandfills } from './graphql/queries';
import { deleteLandfills } from './graphql/mutations';
import LandfillProfile from './LandfillProfile'; // Adjust the path according to your project structure
import { Link } from "react-router-dom";
import { IconMap } from '@tabler/icons-react';
import { onCreateLandfills, onUpdateLandfills, onDeleteLandfills } from './graphql/subscriptions';
import { ActionIcon, Table } from '@mantine/core';


const LandfillMapList = () => {
  const [landfills, setLandfills] = useState([]);
  const client = generateClient();

  useEffect(() => {
    fetchLandfills();

    /* create a todo */
const createSub = client.graphql({
    query: onCreateLandfills,
    }).subscribe({
    next: (eventData) => {
        console.log("Created New Landfill",eventData)
      const newLandfill = eventData.data.onCreateLandfills;
      console.log(newLandfill)
      setLandfills((prevLandfills) => [...prevLandfills, newLandfill]);
    }
  });
  
  /* update a todo */
  const updateSub = client.graphql({
    query: onUpdateLandfills
  }).subscribe({
    next: (eventData) => {
        console.log("Updated New Landfill",eventData)

      const updatedLandfill = eventData.data.onUpdateLandfills;
      setLandfills((prevLandfills) =>
        prevLandfills.map((landfill) =>
          landfill.id === updatedLandfill.id ? updatedLandfill : landfill
        )
      );
    }
  });
  
  /* delete a todo */
  const deleteSub = client.graphql({
    query: onDeleteLandfills
  }).subscribe({
    next: (eventData) => {
        console.log("Deleted New Landfill",eventData)

      const deletedLandfillId = eventData.data.onDeleteLandfills.id;
      setLandfills((prevLandfills) =>
        prevLandfills.filter((landfill) => landfill.id !== deletedLandfillId)
      );
    }
  });


  return () => {
    createSub.unsubscribe();
    updateSub.unsubscribe();
    deleteSub.unsubscribe();
  };
  }, []);

  const fetchLandfills = async () => {
    try {
      const landfillsData = await client.graphql({ query: listLandfills });
      setLandfills(landfillsData.data.listLandfills.items);
    } catch (error) {
      console.error('Error fetching landfills:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
        await client.graphql({
            query: deleteLandfills,
            variables: { 
              input: { id }
            }
          })
      setLandfills((prevLandfills) => prevLandfills.filter((landfill) => landfill.id !== id));
    } catch (error) {
      console.error('Error deleting landfill:', error);
    }
  };
  return (
    <div style={{padding: "0.75rem"}}>
      <h2>Landfills</h2>
     
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {landfills.length > 0 ? landfills.map((landfill) => (

            <Table.Tr key={landfill.id}>
              <Table.Td>
              {/* <Link to={`/landfill/${landfill.id}`}>{landfill.name}</Link> */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {landfill.name}
              <Link to={`/landfill/${landfill.id}`}>
                <ActionIcon variant="transparent" aria-label="Settings">
                    <IconMap style={{ width: '25px', height: '25px' }} stroke={1.5} />
                </ActionIcon>
                </Link>
              </div>
              
                </Table.Td>
              <Table.Td style={{fontSize: "0.85rem"}}>
                <div>
                    {landfill.address}
                </div>
                <div>
                    {landfill.city} {landfill.state} {landfill.zip}
                </div>
                </Table.Td>
              
            </Table.Tr>
          )) : 
          <Table.Tr>
            <Table.Td align='center' style={{color: 'rgba(0,0,0,0.87)'}} colSpan={7}>No landfills added yet.</Table.Td>
            </Table.Tr>}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default LandfillMapList;
