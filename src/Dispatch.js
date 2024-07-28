// src/App.js
import React, { useEffect, useState, useRef } from "react";
import {
  DateInput,
  DatePicker,
  DateTimePicker,
  TimeInput,
} from "@mantine/dates";
import { generateClient } from "aws-amplify/api";
import { notifications } from "@mantine/notifications";

import {
  onCreateAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onCreateJobTech,
  onUpdateJobTech,
  onDeleteJobTech,
} from "./graphql/subscriptions";
import { listAppointments, listLandfills } from "./graphql/queries";
import {
  createAppointment,
  createJob,
  createJobTech,
  updateAppointment,
} from "./graphql/mutations";

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
  Textarea,
  Container,
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
import { getCurrentUser } from "aws-amplify/auth";

import { useDisclosure } from "@mantine/hooks";
import moment from "moment";

async function currentAuthenticatedUserId() {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    return userId;
  } catch (err) {
    console.log(err);
  }
}
const Dispatch = () => {
  const viewport = useRef(null);

  const [chosenDate, setChosenDate] = useState(moment());
  const [startingDate, setStartingDate] = useState(moment());
  const [isToday, setIsToday] = useState(false);

  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [activeContentTitle, setActiveContentTitle] = useState("");
  const [activeContent, setActiveContent] = useState("");
  const [users, setUsers] = useState([]);
  const [usersSchedule, setUsersSchedule] = useState([]);
  const [landfills, setLandfills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [techAssignedJobs, setTechAssignedJobs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);

  const isMobile = window.innerWidth <= 768;
  const timeSlotWidth = 120;
  const client = generateClient();

  const clientUser = new CognitoIdentityProviderClient({
    region: process.env.REACT_APP_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    },
  });

  currentAuthenticatedUserId();
  useEffect(() => {
    const listUsers = async () => {
      const input = {
        // ListUsersRequest
        UserPoolId: "us-east-1_xWuXFvELQ", // required
      };
      const command = new ListUsersCommand(input);
      const response = await clientUser.send(command);

      const organizeUserAttributes = (attributes) => {
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

      const transformedUsersByDepartment = transformedUsers.reduce(
        (acc, person) => {
          const { department } = person;
          if (!acc[department]) {
            acc[department] = { name: department, techs: [] };
          }
          acc[department].techs.push(person);
          return acc;
        },
        {}
      );

      console.log("Users By Department", transformedUsersByDepartment);

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
      } catch (error) {
        console.error("Error fetching gaswells:", error);
      }
    };

    fetchLandfills();
  }, []);

  /*STARTING SCROLL*/

  //   if(isToday){

  //     const hours = moment().hours();
  //     const minutes = moment().minutes();

  // // Calculate the total minutes in the day
  //     const totalMinutesInDay = (hours * 60) + minutes;

  //     console.log(viewport.current.scrollWidth)
  //     console.log(totalMinutesInDay/1440 * viewport.current.scrollWidth)

  //     const newScrollWidth = totalMinutesInDay/1440 * viewport.current.scrollWidth;

  //     viewport.current.scrollTo({ left: newScrollWidth, behavior: 'smooth' });
  //   }

  useEffect(() => {
    const todayIsTrue =
      chosenDate.format("YYYY-MM-DD") == moment().format("YYYY-MM-DD");
    function overlappingDates(start1, end1, startLast, endLast) {
      var _start1 = new Date(start1).valueOf();
      var _end1 = new Date(end1).valueOf();
      var _startLast = new Date(startLast).valueOf();
      var _endLast = new Date(endLast).valueOf();

      return !(_end1 < _startLast || _start1 > _endLast);
    }
    setIsToday(todayIsTrue);

    const firstDate = chosenDate
      .clone()
      .startOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const secondDate = chosenDate
      .clone()
      .startOf("day")
      .add(1, "days")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const filter = {
      startTime: {
        between: [firstDate, secondDate],
      },
    };
    const fetchJobs = async () => {
      try {
        const jobData = await client.graphql({
          query: listAppointments,
          variables: { filter },
        });
        console.log("Appointments for Chosen Date",jobData.data.listAppointments.items)
        setAppointments(jobData.data.listAppointments.items);

        // const appointmentsByTech = jobData.data.listAppointments.items.reduce(
        //   (acc, appointment) => {
        //     appointment.JobTeches.items.forEach((techInfo) => {
        //       const techId = techInfo.technicianId;
        //       console.log(techInfo, acc);
        //       if (!acc[techId]) {
        //         acc[techId] = [];
        //       }
        //       acc[techId].push({
        //         jobName: appointment.jobName,
        //         id: appointment.id,
        //         startTime: appointment.startTime,
        //         endTime: appointment.endTime,
        //         status: appointment.status,
        //         landfillsID: appointment.Job.landfillsID,
        //         techInfo: techInfo,
        //         overlap: 0,
        //       });
        //     });
        //     return acc;
        //   },
        //   {}
        // );

        // for (let i = 0; i < Object.keys(appointmentsByTech).length; i++) {
        //   var overlap = 0;
        //   const appKey = Object.keys(appointmentsByTech)[i];
        //   const sortedApps = appointmentsByTech[appKey].sort(
        //     (a, b) => moment(a.startTime) - moment(b.startTime)
        //   );
        //   var lastApp = null;
        //   for (let j = 0; j < sortedApps.length; j++) {
        //     // sortedApps[i].overlap = 1;
        //     if (lastApp) {
        //       const isOverlapping = overlappingDates(
        //         sortedApps[j].startTime,
        //         sortedApps[j].endTime,
        //         lastApp.startTime,
        //         lastApp.endTime
        //       );
        //       if (isOverlapping) {
        //         overlap++;
        //         sortedApps[j].overlap = overlap;
        //       }
        //     }

        //     lastApp = sortedApps[j];
        //   }
        // }

        // setTechAssignedJobs(appointmentsByTech);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchJobs();

    const createSub = client
      .graphql({
        query: onCreateAppointment,
      })
      .subscribe({
        next: (eventData) => {
          const newEntry = eventData.data.onCreateAppointment;
          if (
            moment(newEntry.startTime) > chosenDate.startOf("day") &&
            moment(newEntry.startTime) <
              chosenDate.add(1, "days").startOf("day")
          ) {
            setAppointments((prevAppointments) => [
              ...prevAppointments,
              newEntry,
            ]);
          }
        },
      });

    const updateSub = client
      .graphql({
        query: onUpdateAppointment,
      })
      .subscribe({
        next: (eventData) => {
          const updatedEntry = eventData.data.onUpdateAppointment;
          console.log("Updated Appointment",updatedEntry)
          setAppointments((prevAppointments) => {
            return prevAppointments.map((appointment) =>
              appointment.id === updatedEntry.id ? updatedEntry : appointment
            );
          });
        },
      });

    const deleteSub = client
      .graphql({
        query: onDeleteAppointment,
      })
      .subscribe({
        next: (eventData) => {
          const deletedEntry = eventData.data.onDeleteAppointment.id;
          setAppointments((prevGasWells) =>
            prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
          );
        },
      });

    //   const createSubJT = client
    //   .graphql({
    //     query: onCreateJobTech,
    //   })
    //   .subscribe({
    //     next: (eventData) => {
    //       console.log("Created New JT", eventData);
    //       const newEntry = eventData.data.onCreateJobTech;
    //       console.log('newEntry',newEntry);

    //       setAppointments((prevAppointments) => {
    //         const foundApp = prevAppointments.find(prev => prev.id == newEntry.appointmentID)
    //         const foundJT = foundApp.JobTeches.items.find(prev => prev.id == newEntry.id)

    //         console.log('foundApp',foundApp)
    //         console.log('foundJT',foundJT)

    //         // foundApp.JobTeches.items.push(newEntry)
    //         return prevAppointments;
    //       });

    //       // if (
    //       //   moment(newEntry.startTime) > chosenDate.startOf("day") &&
    //       //   moment(newEntry.startTime) <
    //       //     chosenDate.add(1, "days").startOf("day")
    //       // ) {
    //       //   setAppointments((prevAppointments) => [...prevAppointments, newEntry]);
    //       // }
    //     },
    //   });

    // const updateSubJT = client
    //   .graphql({
    //     query: onUpdateJobTech,
    //   })
    //   .subscribe({
    //     next: (eventData) => {
    //       console.log("Updated New JT", eventData);

    //       const updatedEntry = eventData.data.onUpdateJobTech;

    //       setAppointments((prevAppointments) => {
    //         return prevAppointments.map((appointment) =>
    //           appointment.id === updatedEntry.id ? updatedEntry : appointment
    //         )
    //       }
    //       );
    //     },
    //   });

    // const deleteSubJT = client
    //   .graphql({
    //     query: onDeleteJobTech,
    //   })
    //   .subscribe({
    //     next: (eventData) => {
    //       console.log("Deleted New JT", eventData);

    //       const deletedEntry = eventData.data.onDeleteJobTech.id;

    //       // setAppointments((prevGasWells) =>
    //       //   prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
    //       // );
    //     },
    //   });
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
      // createSubJT.unsubscribe();
      // updateSubJT.unsubscribe();
      // deleteSubJT.unsubscribe();
    };
  }, [chosenDate]);

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
      status: "scheduled",
      landfillsID: newJob.landfills,
    };
    console.log(addNewJob);

    try {
      const result = await client.graphql({
        query: createJob,
        variables: { input: addNewJob },
      });

      const newJobAdded = result.data.createJob;
      createAppointmentAfterJob(newJobAdded.id, newJob);
    } catch (error) {
      console.error("Error adding gas well:", error);
    }
  };

  const getMaxValue = (arr, prop) => {
    return arr.reduce((max, obj) => {
      return obj[prop] > max ? obj[prop] : max;
    }, arr[0][prop]);
  };
  async function createJobTechAfterApp(appId, jobDetails) {
    var successfulAttempt = true;
    for (let t = 0; t < jobDetails.technicians.length; t++) {
      const addNewJobTech = {
        technicianId: jobDetails.technicians[t],
        appointmentID: appId,
      };

      try {
        const result = await client.graphql({
          query: createJobTech,
          variables: { input: addNewJobTech },
        });

        const newJobAdded = result.data.createJobTech;
      } catch (error) {
        successfulAttempt = false;
        console.error("Error adding gas well:", error);
      }
    }

    if (successfulAttempt) {
      notifications.show({
        id: "success-adding-new-job",
        withCloseButton: true,
        autoClose: 5000,
        title: "New Job Added!",
        message: `New job has been added.`,
        icon: <IconCheck />,
        color: "green",
      });
      closeModal();
    } else {
      console.log("ERROR ADDING JOB");
    }
  }

  async function createAppointmentAfterJob(jobId, jobDetails) {
    const addNewAppointment = {
      startTime: moment(
        `${moment(jobDetails.startDate).format("YYYY-MM-DD")}T${jobDetails.startTime}`
      )
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      endTime: moment(
        `${moment(jobDetails.endDate).format("YYYY-MM-DD")}T${jobDetails.endTime}`
      )
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      jobID: jobId,
      status: "scheduled",
    };
    console.log(addNewAppointment);

    try {
      const result = await client.graphql({
        query: createAppointment,
        variables: { input: addNewAppointment },
      });

      const newJobAdded = result.data.createAppointment;

      createJobTechAfterApp(newJobAdded.id, jobDetails);
    } catch (error) {
      console.error("Error adding gas well:", error);
    }
  }

  const newJob = (timeslot) => {
    const startTimeForJob = moment(
      `${moment(chosenDate).format("YYYY-MM-DD")}T${timeslot.timeSlot}:00`
    ).format();
    setStartingDate(startTimeForJob);
    setActiveContent("addNewJob");
    setActiveContentTitle("New Job");
    openModal();
  };

  const changeDate = ({ increment, type }) => {
    if (type == "change") {
      setChosenDate(moment(chosenDate).add(increment, "days"));
    } else if (type == "today") {
      setChosenDate(moment());
    }
  };

  function allowDrop(e) {
    e.target.className = "eachTimeSlot hovered-timeslot";
    e.preventDefault();
  }

  function leaveDrop(e) {
    e.target.className = "eachTimeSlot";
    e.preventDefault();
  }

  function drag(e) {
    console.log("started dragging!");
    e.dataTransfer.setData("Item", e.target.getAttribute("data-id"));
    //   ev.preventDefault();
  }

  function drop(e, timeslot, tech) {
    const appointmentId = e.dataTransfer.getData("Item");
    const techId = tech;
    console.log(e);
    e.target.className = "eachTimeSlot";
    console.log(timeslot);
    console.log(techId);
    console.log(appointmentId);
    // e.stopPropagation()

    if (window.confirm("Are you sure you want to reschedule this job?")) {
      updateAppointmentTime(null, techId, appointmentId, timeslot);
    }
  }

  async function updateAppointmentTime(
    jobTechId,
    techId,
    appointmentId,
    timeslot
  ) {
    console.log(jobTechId, techId, appointmentId);
    const foundAppointment = appointments.find(
      (app) => app.id == appointmentId
    );

    const timeDiff = moment(foundAppointment.endTime).diff(
      moment(foundAppointment.startTime),
      "hours",
      true
    );

    const newStartTime = moment(
      `${moment(foundAppointment.startTime).format("YYYY-MM-DD")}T${timeslot}`
    );

    const newEndTime = newStartTime.clone().add(timeDiff, "hours");

    console.log(newStartTime.utc().format());
    console.log(newEndTime.utc().format());

    try {
      const result = await client.graphql({
        query: updateAppointment,
        variables: {
          input: {
            id: appointmentId,
            startTime: newStartTime.utc().format(),
            endTime: newEndTime.utc().format(),
          },
        },
      });

      const updatedApp = result.data.updateAppointment;
      console.log(updatedApp);
    } catch (error) {
      console.error("Error updating appointment time:", error);
    }
  }

  const renderModals = () => {
    switch (activeContent) {
      case "addNewJob":
        return (
          //   <AddNewJob onSubmit={handleNewJob} startingDate={startingDate}/>
          <AddJob
            onSubmit={handleAddNewJob}
            users={users}
            landfills={landfills}
            chosenDate={startingDate}
            technician={selectedTech}
          />
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
            >
              Add Job
            </Button>
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

          {usersSchedule &&
            usersSchedule.map((category) => (
              <>
                <div key={category.name} className="category">
                  {category.name}
                </div>
                {category.techs.map((tech) => (
                  <div
                    key={tech.first_name}
                    style={{
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      height: `${techAssignedJobs[tech.Username] ? (getMaxValue(techAssignedJobs[tech.Username], "overlap") + 1) * 41 : 41}px`,
                    }}
                    className="tech"
                  >
                    {tech.FullName}
                  </div>
                ))}
              </>
            ))}
        </div>
        <div id="scheduleRows" style={{ width: "80%" }}>
          <ScrollArea
            type="scroll"
            viewportRef={viewport}
            scrollbarSize={4}
            scrollbars="x"
          >
            <div style={{ display: "flex" }}>
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="timeslot">
                  {timeSlot}
                </div>
              ))}
            </div>

            {usersSchedule &&
              usersSchedule.map((category) => (
                <>
                  <div key={`row-${category.name}`} className="category"></div>
                  {category.techs.map((tech) => (
                    <div
                      key={`row-${tech.first_name}`}
                      style={{
                        background: "#FAFAFA",
                        height: `${techAssignedJobs[tech.Username] ? (getMaxValue(techAssignedJobs[tech.Username], "overlap") + 1) * 41 : 41}px`,
                      }}
                      className="tech"
                    >
                      {techAssignedJobs[tech.Username] &&
                        techAssignedJobs[tech.Username].map((appointment) => {
                          const jobWidth = moment(appointment.endTime).diff(
                            moment(appointment.startTime),
                            "hours",
                            true
                          );
                          const startPosition =
                            moment(appointment.startTime).hour() +
                            moment(appointment.startTime).minutes() / 60;

                          return (
                            <div
                              key={appointment.id}
                              draggable="true"
                              data-id={appointment.id}
                              onDragStart={drag}
                              className={`eachJob ${appointment.status}`}
                              style={{
                                left: timeSlotWidth * startPosition + "px",
                                top: appointment.overlap * 41 + "px",
                                width: timeSlotWidth * jobWidth + "px",
                              }}
                            >
                              {/* Landfill */}
                              {landfills.find(
                                (landfill) =>
                                  landfill.id == appointment.landfillsID
                              ).name ?? "Error"}
                            </div>
                          );
                        })}

                      {eachTimeSlot.map((timeSlot) => (
                        <div
                          onClick={() => {
                            setSelectedTech(tech.Username);
                            newJob({ timeSlot });
                          }}
                          key={timeSlot}
                          className="eachTimeSlot"
                          data-time={timeSlot}
                          onDrop={(event) =>
                            drop(event, timeSlot, tech.Username)
                          }
                          onDragOver={allowDrop}
                          onDragLeave={leaveDrop}
                          style={{ display: "inline-block", height: "100%" }}
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
