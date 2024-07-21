// src/App.js
import React, { useEffect, useState, useRef } from "react";
import { DateInput, DatePicker, DateTimePicker, TimeInput } from "@mantine/dates";
import { generateClient } from "aws-amplify/api";
import { notifications } from "@mantine/notifications";

import {
  listLandfills
} from "./graphql/queries";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  ScrollArea,
  Modal,
  MultiSelect,
  Select,
  Box, 
  Textarea
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconCheck,
  IconCalendarEvent,
} from "@tabler/icons-react";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import AddJob from "./AddJob";

import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { createAppointment, createJob } from "./graphql/mutations";

const Dispatch = () => {
  const ref = useRef(null);

  const [chosenDate, setChosenDate] = useState(moment());
  const [startingDate, setStartingDate] = useState(moment());
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [activeContentTitle, setActiveContentTitle] = useState("");
  const [activeContent, setActiveContent] = useState("");
  const [users, setUsers] = useState([]);
  const [usersSchedule, setUsersSchedule] = useState([]);
  const [landfills, setLandfills] = useState([]);

  const isMobile = window.innerWidth <= 768;

  const client = generateClient();

  const clientUser = new CognitoIdentityProviderClient({
    region: process.env.REACT_APP_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    },
  });

  useEffect(() => {
    const listUsers = async () => {
      const input = {
        // ListUsersRequest
        UserPoolId: "us-east-1_xWuXFvELQ", // required
      };
      const command = new ListUsersCommand(input);
      const response = await clientUser.send(command);

      const organizeUserAttributes = (attributes) => {
        console.log("attributes", attributes);
        return attributes?.reduce((acc, attr) => {
          acc[attr.Name] = attr.Value;
          return acc;
        }, {});
      };

      const transformedUsers = response.Users.map((user) => {
        const organizedAttributes = organizeUserAttributes(user.Attributes);
        return {
          Username: user.Username,
          first_name: organizedAttributes.given_name,
          last_name: organizedAttributes.family_name,
          FullName: `${organizedAttributes.given_name} ${organizedAttributes.family_name}`,
          email: organizedAttributes.email,
          phone_number: organizedAttributes.phone_number,
          phone_number_verified: organizedAttributes.phone_number_verified,
          email_verified: organizedAttributes.email_verified,
          department: organizedAttributes.nickname,
        };
      });

      const transformedUsersByDepartment = transformedUsers.reduce((acc, person) => {
        const { department } = person;
        console.log(department)
        if (!acc[department]) {
          acc[department] = { name: department, techs: [] };
        }
        acc[department].techs.push(person);
        return acc;
      }, {});


      console.log("transformedUsers",Object.values(transformedUsersByDepartment) )
      setUsers(transformedUsers);
      setUsersSchedule(Object.values(transformedUsersByDepartment));
    };

    listUsers();
    
    const fetchLandfills = async () => {
      try {
        const landfillData = await client.graphql({
          query: listLandfills,
        });
        // document.title = landfill.name;
        setLandfills(landfillData.data.listLandfills.items);
console.log(landfillData.data.listLandfills.items)
      } catch (error) {
        console.error("Error fetching gaswells:", error);
      }
    };

    fetchLandfills();
  }, []);

  const timeSlots = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];
  const eachTimeSlot = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  
  const handleAddNewJob = async (newJob) => {
    console.log(newJob);
    const addNewJob = {
      description: newJob.summary,
      landfillsID: 'scheduled',
    }
    console.log(addNewJob);

    try {
      const result = await client.graphql({
        query: createJob,
        variables: { input: addNewJob }
      });

      const newJobAdded = result.data.createJob

      // console.log(result.)
      createAppointmentAfterJob(newJobAdded.id,newJob)
      // notifications.show({
      //   id: 'success-adding-new-job',
      //   withCloseButton: true,
      //   autoClose: 5000,
      //   title: 'New Job Added!',
      //   message: `New job has been added.`,
      //   icon: <IconCheck />,
      //   color: 'green'
      // });
      // closeModal();
    } catch (error) {
      console.error('Error adding gas well:', error);
    }
  };

  async function createAppointmentAfterJob(jobId,jobDetails){

    const addNewAppointment = {
      startTime: moment(`${moment(jobDetails.startDate).format('YYYY-MM-DD')}T${jobDetails.startTime}`).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      endTime: moment(`${moment(jobDetails.endDate).format('YYYY-MM-DD')}T${jobDetails.endTime}`).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      jobID: jobId,
      status: 'scheduled'
    }
    console.log(addNewAppointment);

    try {
      const result = await client.graphql({
        query: createAppointment,
        variables: { input: addNewAppointment }
      });

      const newJobAdded = result.data.createJob

      // console.log(result.)
      notifications.show({
        id: 'success-adding-new-job',
        withCloseButton: true,
        autoClose: 5000,
        title: 'New Job Added!',
        message: `New job has been added.`,
        icon: <IconCheck />,
        color: 'green'
      });
      closeModal();
    } catch (error) {
      console.error('Error adding gas well:', error);
    }
  }

  const newJob = (timeslot) => {
    const startTimeForJob = moment(
      `${moment(chosenDate).format("YYYY-MM-DD")}T${timeslot.timeSlot}:00`
    ).format();
    console.log('startTimeForJob',startTimeForJob);
    setStartingDate(startTimeForJob);
    setActiveContent("addNewJob");
    setActiveContentTitle("New Job")
    openModal();
  };

  const changeDate = ({ increment, type }) => {
    if (type == "change") {
      setChosenDate(moment(chosenDate).add(increment, "days"));
    } else if (type == "today") {
      setChosenDate(moment());
    }
  };

  function thisFunction(item) {
    console.log(item);
  }

  const renderModals = () => {
    switch (activeContent) {
      case "addNewJob":
        return (
          //   <AddNewJob onSubmit={handleNewJob} startingDate={startingDate}/>
          <AddJob onSubmit={handleAddNewJob} users={users} landfills={landfills} chosenDate={startingDate} />
        );

      default:
        return (
          <div style={{ padding: "0.75rem" }}>
            Select an option from the menu.
          </div>
        );
    }
  };
  return (
    <div style={{ padding: "0.75rem" }}>
      <Modal
       size="lg"
        title={activeContentTitle}
        zIndex={10}
        opened={openedModal}
        onClose={closeModal}
      >
        {renderModals()}
      </Modal>
      <h3>Dispatch</h3>
      <Flex justify="space-between">
        <Flex align="center" gap="xs">
          <Group>
            <DateInput
              size="sm"
              value={chosenDate}
              onChange={setChosenDate}
              placeholder="Date input"
            />

            <ActionIcon.Group>
              <ActionIcon
                onClick={() => changeDate({ increment: -1, type: "change" })}
                size="input-sm"
                color="gray"
              >
                <IconChevronLeft stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                onClick={() => changeDate({ increment: 1, type: "change" })}
                size="input-sm"
                color="gray"
              >
                <IconChevronRight stroke={1.5} />
              </ActionIcon>
            </ActionIcon.Group>
          </Group>
          {isMobile ? (
            <ActionIcon
              onClick={() => changeDate({ type: "today" })}
              size="input-sm"
              color="gray"
            >
              <IconCalendarEvent
                style={{ width: "1.35rem", height: "1.35rem" }}
              />
            </ActionIcon>
          ) : (
            <Button onClick={() => changeDate({ type: "today" })} color="gray">
              Today
            </Button>
          )}
        </Flex>
        <div>
          {isMobile ? (
            <ActionIcon size="input-sm">
              <IconPlus style={{ width: "1.35rem", height: "1.35rem" }} />
            </ActionIcon>
          ) : (
            <Button
              leftSection={
                <IconPlus
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  stroke={1.5}
                />
              }
            ></Button>
          )}
        </div>
      </Flex>
      <div
        style={{
          display: "flex",
          marginTop: "1rem",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div id="techRows" style={{ width: "20%" }}>
          <div className="tech"></div>

          {usersSchedule && usersSchedule.map((category) => (
            <>
              <div key={category.name} className="category">
                {category.name}
              </div>
              {category.techs.map((tech) => (
                <div
                  key={tech.first_name}
                  style={{ fontSize: "0.85rem", overflow: "hidden" }}
                  className="tech"
                >
                  {tech.FullName}
                </div>
              ))}
            </>
          ))}
        </div>
        <div id="scheduleRows" style={{ width: "80%" }}>
          <ScrollArea type="scroll" scrollbarSize={4} scrollbars="x">
            <div style={{ display: "flex" }}>
              {timeSlots.map((timeSlot) => (
                <div className="timeslot">{timeSlot}</div>
              ))}
            </div>

          
            {usersSchedule && usersSchedule.map((category) => (
              <>
                <div key={`row-${category.name}`} className="category"></div>
                {category.techs.map((tech) => (
                  <div
                    key={`row-${tech.first_name}`}
                    style={{ background: "#FAFAFA" }}
                    className="tech"
                  >
                    {eachTimeSlot.map((timeSlot) => (
                      <div
                        onClick={() => newJob({ timeSlot })}
                        className="eachTimeSlot"
                        style={{ display: "inline-block" }}
                      ></div>
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
