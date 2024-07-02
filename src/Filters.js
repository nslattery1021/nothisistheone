import React, { useState, useEffect } from 'react';
import { Stack, Text, Button, Group, Box, Accordion, Chip } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';


const Filters = ({ selectedSubtypes, setSelectedSubtypes, selectedPriorities, setSelectedPriorities, closeModal }) => {
    
    const [openAccordion, setOpenAccordion] = useState(['incomplete'])
    const [selectAccIndex, setSelectAccIndex] = useState([0])
    const typeOptions = [
        { value: 'Header Monitor', label: 'Header Monitor' },
        { value: 'Smart Well', label: 'Smart Well' },
      ];
  const subtypeOptions = {
     "Header Monitor" :[
        { value: 'Above Surface', label: 'Above Surface' },
        { value: 'Subsurface', label: 'Subsurface' },
        { value: 'Riser', label: 'Riser' },
    ],
    "Smart Well" :[
        { value: '2" Well', label: '2" Well' },
    { value: '3" Well', label: '3" Well' },
    ]}
  ;

  const priorities = [
    { color: 'red', label: 'High' },
    { color: 'orange', label: 'Medium' },
    { color: 'yellow', label: 'Low' },
  ];

  const handleAccordChange = (index) => {
    console.log("Index",index)
    // if(selectAccIndex.some(fil => fil == index)){
        
    // }
    
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">

        <Accordion multiple onChange={setOpenAccordion}>
            <Accordion.Item value={"priority"}>
            <Accordion.Control style={{fontWeight: '800'}}>Priority</Accordion.Control>
                <Accordion.Panel>
                <Chip.Group multiple value={selectedPriorities} onChange={setSelectedPriorities}>
                <Group gap="xs">
                    {priorities.map((st) => (
                        
                        <Chip color={st.color} key={st.label} value={st.label}>
                        {st.label}
                        </Chip>
                    ))}
                    </Group>

                </Chip.Group> 

                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value={"device"}>
                <Accordion.Control style={{fontWeight: '800'}}>Device Types</Accordion.Control>
                <Accordion.Panel>
                    <Stack gap="md">
                        {typeOptions.map((type) => (
                            <Stack gap="xs">
                                <Text>{type.label}</Text>
                                <Chip.Group multiple value={selectedSubtypes} onChange={setSelectedSubtypes}>
                                    <Group gap="xs">
                                    {subtypeOptions[type.label].map((subtype) => (
                                        
                                        <Chip key={subtype.label} value={subtype.label}>
                                        {subtype.label}
                                        </Chip>
                                    ))}
                                    </Group>
                                </Chip.Group>
                            </Stack>
                        ))}
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value={"age"}>
                <Accordion.Control style={{fontWeight: '800'}}>Age</Accordion.Control>
                <Accordion.Panel>

                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value={"service"}>
                <Accordion.Control style={{fontWeight: '800'}}>Service</Accordion.Control>
                <Accordion.Panel>

                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
            
    
        <Group position="right" mt="md">
          <Button onClick={closeModal} color="gray" type="submit">Cancel</Button>
        </Group>
    </Box>
  );
};

export default Filters;
