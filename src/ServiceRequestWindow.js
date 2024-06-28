// src/AddLandfill.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createLandfills } from './graphql/mutations';
import { Autocomplete, Button, Chip, Divider, Input, Grid, Select } from '@mantine/core';
import AutocompleteInput from './AutocompleteInput';
import { showNotification } from '@mantine/notifications';


const ServiceRequestWindow = () => {
  const [landfill, setLandfill] = useState({
    name: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    lat: '',
    lng: '',
    active: false,
  });
  const client = generateClient();
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    console.log(e)
    const { name, value, type, checked } = e.target;
    setLandfill({
      ...landfill,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.graphql({
        query: createLandfills,
        variables: { input: landfill }
      }
        );
        showNotification({
          title: 'Success',
          message: 'Landfill added successfully!',
          color: 'green',
        });
      setLandfill({
        name: '',
        address: '',
        state: '',
        city: '',
        zip: '',
        country: '',
        lat: null,
        lng: null,
        active: false,
      });
    } catch (error) {
      console.error('Error adding landfill:', error);
    }
  };


  return (
    
    <form onSubmit={handleSubmit}>
        <Grid>
            <Grid.Col span={12}>
              <Input.Wrapper label="Gas Well Name">
                <Input name="name" placeholder="Name" value={landfill.name} onChange={handleChange} required/>
              </Input.Wrapper>
            </Grid.Col>
          
            <Grid.Col span={12}>
              <Select
                label="Gas Well Type"
                placeholder="Choose gas well type"
                data={['Smart Well', 'Header Monitor']}
              />
                {/* <Input name="address" placeholder="Address" value={landfill.address} onChange={handleChange} required/> */}
            </Grid.Col>
        
            <Grid.Col span={12}>
              <Select
                label="Gas Well Subtype"
                placeholder="Choose gas well subtype"
                data={['2" Well', '3" Well']}
              />
                {/* <Input name="address" placeholder="Address" value={landfill.address} onChange={handleChange} required/> */}
            </Grid.Col>

            
           
            <Grid.Col position="right" span={12}>
                <Button type="submit">Add Gas Well</Button>
            </Grid.Col>
        </Grid>
    </form>
  );
};

export default ServiceRequestWindow;
