// src/App.js
import React from 'react';
import { IconTool } from '@tabler/icons-react';
import { Timeline, Text } from '@mantine/core';
import moment from 'moment';

const ServiceList = ({ selectedGasWell, isComplete }) => {
    if (!selectedGasWell || !selectedGasWell.Devices.Services) {
        return <p>No gas well selected or no services available.</p>;
      }
    
      const allServices = selectedGasWell?.Devices?.Services.items
      .filter(serv => serv.isComplete == isComplete)
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt));

      const status = isComplete ? 'completed' : 'incomplete';
      return (
        <div>
          {allServices.length > 0 ? (
            <Timeline active={allServices.length} color="orange" bulletSize={24}>
                {allServices.map(service => (
                <Timeline.Item key={service.id} title={service.title} bullet={<IconTool color='white' size="0.8rem" />}>
                    <Text c="dimmed" size="sm">{moment(service.createdAt).format('l h:mm a')}</Text>
                </Timeline.Item>
                ))}
            </Timeline>
           
          ) : (
            <p>No {status} services found.</p>
          )}
        </div>
      );
};

export default ServiceList;
