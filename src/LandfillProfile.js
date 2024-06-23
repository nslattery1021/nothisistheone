import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getLandfills } from './graphql/queries';
import { Container, Title, Text } from '@mantine/core';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path

const LandfillProfile = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const client = generateClient();

  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const landfillData = await client.graphql({
            query: getLandfills,
            variables: { id: id }
      });
        
        setLandfill(landfillData.data.getLandfills);
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
    
    <div>
      <h3>{landfill.name}</h3>
      
      <GoogleMapComponent lat={landfill.lat} lng={landfill.lng} />

    </div>
  );
};

export default LandfillProfile;
