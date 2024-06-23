// src/AddLandfill.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createLandfills } from './graphql/mutations';
import { Autocomplete, Button, Chip, Divider, Input, Grid, Switch } from '@mantine/core';
import AutocompleteInput from './AutocompleteInput';
import { showNotification } from '@mantine/notifications';


const AddLandfill = () => {
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

  const handlePlaceSelected = (place) => {
    console.log("Place",place)
    setLandfill((prevLandfill) => ({
      ...prevLandfill,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      city: place.city || '',
      state: place.state || '',
      zip: place.zip || '',
      country: place.country || ''
    }));
  };

  return (
    
    <form onSubmit={handleSubmit}>
        <Grid>
            <Grid.Col span={12}>
              <Input.Wrapper label="Landfill Name">
                <Input name="name" placeholder="Name" value={landfill.name} onChange={handleChange} required/>
              </Input.Wrapper>
            </Grid.Col>
            {/* <Grid.Col span={12}><Input name="address" placeholder="Address" value={landfill.address} onChange={handleChange} required/></Grid.Col> */}
            <Grid.Col span={12}>
            <Input.Wrapper label="Address Search">
            <AutocompleteInput onPlaceSelected={handlePlaceSelected}/>
            </Input.Wrapper>

            </Grid.Col>
            </Grid>
            
            <Divider my="md" label="or" labelPosition="center"/>
            <Grid>
            <Grid.Col span={12}>
              <Input.Wrapper label="Address">
                <Input name="address" placeholder="Address" value={landfill.address} onChange={handleChange} required/>
              </Input.Wrapper>
            </Grid.Col>
        
            <Grid.Col span={8}>
              <Input name="city" placeholder="City" value={landfill.city} onChange={handleChange} required/>
             

              </Grid.Col>
            
            
            {/* <Grid.Col span={4}>
            <Autocomplete
                placeholder="State"
                name="state"
                value={landfill.state} 
                onChange={handleChange} 
                required
                data={[
                    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
                  ]}
                />
                </Grid.Col> */}
            <Grid.Col span={4}><Input name="state" placeholder="State" value={landfill.state} onChange={handleChange} required/></Grid.Col>

            <Grid.Col span={6}><Input name="zip" placeholder="ZIP" value={landfill.zip} onChange={handleChange} required/></Grid.Col>
            <Grid.Col span={6}><Input name="country" placeholder="Country" value={landfill.country} onChange={handleChange} required/></Grid.Col>
            </Grid>
            <Divider my="md" />
            <Grid>
            <Grid.Col span={6}>
              <Input.Wrapper label="Latitude">
                <Input name="lat" placeholder="Latitude"  type="number" step="0.01" value={landfill.lat} onChange={handleChange} required/>
              </Input.Wrapper>
              </Grid.Col>
            <Grid.Col span={6}>
            <Input.Wrapper label="Latitude">
            <Input name="lng" placeholder="Longitude"  type="number" step="0.01" value={landfill.lng} onChange={handleChange} required/>
            </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={12}>
            <Switch
                defaultChecked
                name="active" type="checkbox" onChange={handleChange} 
                label="Active"
                />                
            </Grid.Col>
            <Grid.Col position="right" span={12}>
                <Button type="submit">Add Landfill</Button>
            </Grid.Col>
        </Grid>
    </form>
  );
};

export default AddLandfill;
