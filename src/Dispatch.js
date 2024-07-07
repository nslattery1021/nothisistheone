// src/App.js
import React, { useEffect, useState, useRef } from 'react';
import { DateInput } from '@mantine/dates';
import { ActionIcon, Button, Flex, Group, ScrollArea, Modal, TextInput, Box } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconTool, IconCheck } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment';

const Dispatch = () => {
    const [chosenDate, setChosenDate] = useState(moment());
    const [startingDate, setStartingDate] = useState(moment());
    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [activeContentTitle, setActiveContentTitle] = useState('');
    const [activeContent, setActiveContent] = useState('');

const techs = [
    {
        'name'  : 'Office',
        'techs' : [
            {
                'first_name'   : 'Neil',
                'last_name'    : 'Slattery'
            },
            {
                'first_name'   : 'Brandon',
                'last_name'    : 'Cosgriff'
            }
        ]
    },
    {
        'name'  : 'Technicians',
        'techs' : [
            {
                'first_name'   : 'Kaleb',
                'last_name'    : 'Rozell'
            },
            {
                'first_name'   : 'James',
                'last_name'    : 'Floyd'
            }
        ]
    },
    {
        'name'  : 'Assembly',
        'techs' : [
            {
                'first_name'   : 'Andy',
                'last_name'    : 'Kester'
            },
            {
                'first_name'   : 'Chris',
                'last_name'    : 'Sos'
            },
        ]
    }
]

const timeSlots = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]
const eachTimeSlot = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", 
    "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", 
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", 
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", 
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
  ]

  const handleAddGasWell = async (newJob) => {

    console.log(newJob)

    // try {
    //   const result = await client.graphql({
    //     query: createGasWells,
    //     variables: { input: newGasWell }
    //   });
  
    //   notifications.show({
    //     id: 'success-adding-gas-wells',
    //     withCloseButton: true,
    //     autoClose: 5000,
    //     title: 'New Gas Well Added!',
    //     message: `${newGasWell.gasWellName} has been added.`,
    //     icon: <IconCheck />,
    //     color: 'green'
    //   });
    //   // setGasWells((prevGasWells) => [...prevGasWells, result.data.createGasWells]);
    //   closeModal();
    // } catch (error) {
    //   console.error('Error adding gas well:', error);
    // }
  };

    const newJob = (timeslot) => {
        const startTimeForJob = moment(`${moment(chosenDate).format('YYYY-MM-DD')}T${timeslot.timeSlot}:00`).format();
        console.log(startTimeForJob)
        setStartingDate(startTimeForJob);
        setActiveContent('addNewJob');
        openModal();
    }

    const changeDate = ({increment, type}) => {
        if(type == "change"){
            setChosenDate(moment(chosenDate).add(increment, 'days'));
        } else if(type == "today"){
            setChosenDate(moment());  
        }
    }
    const renderModals = () => {
        switch (activeContent) {
          
          case 'addNewJob':
            return (
            //   <AddNewJob onSubmit={handleNewJob} startingDate={startingDate}/>
            <Box sx={{ maxWidth: 400 }} mx="auto">
      <form o>
        <TextInput
          label="New Job Name"
          required
        />
        <Group position="right" mt="md">
          <Button type="submit">{'Add New Job'}</Button>
        </Group>
      </form>
    </Box>
            );
        
          default:
            return <div style={{ padding: '0.75rem' }}>Select an option from the menu.</div>;
        }
      };
  return (
    <div style={{padding: "0.75rem"}}>
        <Modal title={activeContentTitle} zIndex={10} opened={openedModal} onClose={closeModal}>
            {renderModals()}
        </Modal>
        <h3>
            Dispatch
        </h3>
        <Flex
        justify='space-between'
        >
            <Flex       
            align="center"
            gap="xs"
            >
                <Group>

                    <DateInput
                    size="sm"
                    value={chosenDate}
                    onChange={setChosenDate}
                    placeholder="Date input"
                    />
                
                    <ActionIcon.Group>
                       <ActionIcon onClick={() => changeDate({ increment: -1, type: 'change'})} size="input-sm" color='gray'>
                            <IconChevronLeft stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon onClick={() => changeDate({ increment: 1, type: 'change'})} size="input-sm" color='gray'>
                            <IconChevronRight stroke={1.5} />
                        </ActionIcon> 
                    </ActionIcon.Group>
                    

                </Group>

                    <Button onClick={() => changeDate({ type: 'today'})} color='gray'>Today</Button>
            </Flex>
            <div>
                <Button leftSection={<IconPlus style={{width: "1.25rem", height: "1.25rem"}} stroke={1.5} />}>Add Job</Button>
            </div>
        </Flex>
        <div style={{display: 'flex', marginTop: '1rem', width: '100%', overflow: 'hidden'}}>
          
            <div id="techRows" style={{width: '20%'}}>
                <div className='tech' ></div>
                {techs.map(category => (
                    <>
                    <div  key={category.name} className="category">{category.name}</div>
                    {category.techs.map(tech => (
                    <div key={tech.first_name} className="tech">
                        {tech.first_name} {tech.last_name}
                    </div>
                    ))}
                    </>
                ))}
            </div>
            <div id="scheduleRows" style={{width: '80%'}}>
            <ScrollArea  type="scroll" scrollbarSize={4} scrollbars='x'>
            <div style={{display: 'flex'}}>
                    {timeSlots.map(timeSlot => (
                        <div className='timeslot'>{timeSlot}</div>
                    ))}
            </div>
            {techs.map(category => (
                    <>
                    <div key={`row-${category.name}`} className="category"></div>
                    {category.techs.map(tech => (
                    <div key={`row-${tech.first_name}`} style={{background: '#FAFAFA'}} className="tech">
                        {eachTimeSlot.map(timeSlot => (
                            <div onClick={() => newJob({ timeSlot })} className='eachTimeSlot' style={{display: 'inline-block'}}></div>
                        ))}

                    </div>
                    ))}
                    </>
                ))}
            </ScrollArea>
                
            </div>
        </div>
    </div>
    
  );
};

export default Dispatch;
