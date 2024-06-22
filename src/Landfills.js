// src/Landfills.js
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listLandfills } from './graphql/queries';
import { deleteLandfills } from './graphql/mutations';

import { onCreateLandfills, onUpdateLandfills, onDeleteLandfills } from './graphql/subscriptions';
import { Table, Button, Container, Loader, Title } from '@mantine/core';


const Landfills = () => {
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
    <Container>
      <Title order={1}>Landfills</Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Country</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {landfills.map((landfill) => (
            <tr key={landfill.id}>
              <td>{landfill.name}</td>
              <td>{landfill.address}</td>
              <td>{landfill.city}</td>
              <td>{landfill.state}</td>
              <td>{landfill.zip}</td>
              <td>{landfill.country}</td>
              <td>{landfill.description}</td>
              <td>
                <Button color="red" onClick={() => handleDelete(landfill.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Landfills;
