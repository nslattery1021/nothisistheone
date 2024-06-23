import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getLandfills } from './graphql/queries';
import { Container, Title, Text } from '@mantine/core';

const LandfillProfile = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const client = generateClient();

  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const landfillData = await client.graphql(getLandfills, { id });
        setLandfill(landfillData.data.getLandfill);
      } catch (error) {
        console.error('Error fetching landfill:', error);
      }
    };

    fetchLandfill();
  }, [id]);

  if (!landfill) {
    return <div>Loading...</div>;
  }

  return (
    
    <Container>
      <Title>{landfill.name}</Title>
      <Text>{landfill.address}</Text>
      <Text>{landfill.city}, {landfill.state} {landfill.zip}</Text>
      <Text>{landfill.country}</Text>
      <Text>Latitude: {landfill.lat}</Text>
      <Text>Longitude: {landfill.lng}</Text>
      <Text>{landfill.description}</Text>
      <Text>Active: {landfill.active ? 'Yes' : 'No'}</Text>
    </Container>
  );
};

export default LandfillProfile;
