import React, { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/api";
import { listGasWells, getGasWells } from "./graphql/queries";


const ExampleComponent = () => {
  const [data, setData] = useState([]);
  const client = generateClient()
  // List all items
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.graphql({
          query: listGasWells
      });
        setData(result.data.listGasWells.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <h3>{item.gasWellName}</h3>
          <p>Latitude: {item.lat}</p>
          <p>Longitude: {item.lng}</p>
        </div>
      ))}
    </div>
  );
};

export default ExampleComponent;
