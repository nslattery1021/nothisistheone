import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '83vh'
};

const mobileContainerStyle = {
    width: '100%',
    height: '73vh' // Adjust height for mobile devices
  };

const GoogleMapComponent = ({ lat, lng }) => {
  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };
  const isMobile = window.innerWidth <= 768;

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={isMobile ? mobileContainerStyle : containerStyle}
        center={center} 
        // mapTypeId='google.maps.MapTypeId.SATELLITE'
        zoom={16}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
