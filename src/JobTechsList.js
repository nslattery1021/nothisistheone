import React, { useEffect, useState, useRef } from "react";
import { listJobTeches } from "./graphql/queries";
import {
  onCreateJobTech,
  onUpdateJobTech,
  onDeleteJobTech,
} from "./graphql/subscriptions";
import { generateClient } from "aws-amplify/api";
import moment from "moment";
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
const JobTechsList = ({ usersSchedule, users, filteredAppointments }) => {
  const [jobTechs, setJobTechs] = useState([]);
  const viewport = useRef(null);
  const client = generateClient();
  const timeSlotWidth = 120;

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
  useEffect(() => {
    console.log("filteredAppointments", filteredAppointments);
    const fetchJobTechs = async (appointmentIDs) => {
      const variables = {
        filter: {
          or: appointmentIDs,
        },
      };
      try {
        const jobTechData = await client.graphql({
          query: listJobTeches,
          variables: variables,
        });

        console.log("Job Tech Fetch", jobTechData.data.listJobTeches);
        setJobTechs(jobTechData.data.listJobTeches.items ?? []);
      } catch (err) {
        console.log("error fetching job techs", err);
      }
    };

    const appointmentIDs = filteredAppointments.map((app) => {
      return {
        appointmentID: {
          eq: app.id,
        },
      };
    });
    if (appointmentIDs.length > 0) {
      console.log("appointmentIDs", appointmentIDs);
      fetchJobTechs(appointmentIDs);
    } else {
      console.log("NOTHING");
      setJobTechs([]);
    }
  }, [filteredAppointments]);

  useEffect(() => {
    const createSub = client
      .graphql({
        query: onCreateJobTech,
      })
      .subscribe({
        next: (eventData) => {
          const newEntry = eventData.data.onCreateJobTech;
          setJobTechs((prevAppointments) => [...prevAppointments, newEntry]);
        },
      });

    const updateSub = client
      .graphql({
        query: onUpdateJobTech,
      })
      .subscribe({
        next: (eventData) => {
          const updatedEntry = eventData.data.onUpdateJobTech;
          console.log("Updated Appointment", updatedEntry);
          setJobTechs((prevAppointments) => {
            return prevAppointments.map((appointment) =>
              appointment.id === updatedEntry.id ? updatedEntry : appointment
            );
          });
        },
      });

    const deleteSub = client
      .graphql({
        query: onDeleteJobTech,
      })
      .subscribe({
        next: (eventData) => {
          const deletedEntry = eventData.data.onDeleteJobTech.id;
          setJobTechs((prevGasWells) =>
            prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
          );
        },
      });
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [filteredAppointments]);

  function findAppointment(id) {
    return filteredAppointments.find((app) => app.id == id);
  }

  return (
    <div>
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
                      //   height: `${techAssignedJobs[tech.Username] ? (getMaxValue(techAssignedJobs[tech.Username], "overlap") + 1) * 41 : 41}px`,
                      height: "41px",
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
                        height: "41px",
                        // height: `${techAssignedJobs[tech.Username] ? (getMaxValue(techAssignedJobs[tech.Username], "overlap") + 1) * 41 : 41}px`,
                      }}
                      className="tech"
                    >
                      {jobTechs &&
                        (
                          jobTechs.filter(
                            (jt) => jt.technicianId == tech.Username
                          ) ?? []
                        ).map((appointment) => {
                          const foundApp = filteredAppointments.find(
                            (app) => app.id == appointment.appointmentID
                          );

                          if(!foundApp){ return; }
                          console.log(foundApp);
                          console.log(
                            "jobTechs",
                            jobTechs.filter(
                              (jt) => jt.technicianId == tech.Username
                            ) ?? []
                          );
                          const jobWidth = moment(foundApp.endTime).diff(
                            moment(foundApp.startTime),
                            "hours",
                            true
                          );
                          const startPosition =
                            moment(foundApp.startTime).hour() +
                            moment(foundApp.startTime).minutes() / 60;
                          console.log(startPosition);
                          return (
                            <div
                              key={foundApp.id}
                              draggable="true"
                              data-id={foundApp.id}
                              //   onDragStart={drag}
                              className={`eachJob ${foundApp.status}`}
                              style={{
                                left: timeSlotWidth * startPosition + "px",
                                top: foundApp.overlap * 41 + "px",
                                width: timeSlotWidth * jobWidth + "px",
                              }}
                            >
                              Landfill
                              {/* {landfills.find(
                                (landfill) =>
                                  landfill.id == appointment.landfillsID
                              ).name ?? "Error"} */}
                            </div>
                          );
                        })}

                      {eachTimeSlot.map((timeSlot) => (
                        <div
                          onClick={() => {
                            // setSelectedTech(tech.Username);
                            // newJob({ timeSlot });
                          }}
                          key={timeSlot}
                          className="eachTimeSlot"
                          data-time={timeSlot}
                          //   onDrop={(event) =>
                          //     drop(event, timeSlot, tech.Username)
                          //   }
                          //   onDragOver={allowDrop}
                          //   onDragLeave={leaveDrop}
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

export default JobTechsList;
