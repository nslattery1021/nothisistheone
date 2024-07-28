import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listAppointments } from "./graphql/queries";
import {
  onCreateAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
} from "./graphql/subscriptions";
import moment from "moment";
import {
  DateInput,
  DatePicker,
  DateTimePicker,
  TimeInput,
} from "@mantine/dates";
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
const AppointmentsList = ({ setFilteredAppointments }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const client = generateClient();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const todayIsTrue =
      moment(selectedDate).format("YYYY-MM-DD") ==
      moment().format("YYYY-MM-DD");
    // function overlappingDates(start1, end1, startLast, endLast) {
    //   var _start1 = new Date(start1).valueOf();
    //   var _end1 = new Date(end1).valueOf();
    //   var _startLast = new Date(startLast).valueOf();
    //   var _endLast = new Date(endLast).valueOf();

    //   return !(_end1 < _startLast || _start1 > _endLast);
    // }
    console.log("todayIsTrue", todayIsTrue);

    setIsToday(todayIsTrue);

    const firstDate = moment(selectedDate)
      .clone()
      .startOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const secondDate = moment(selectedDate)
      .clone()
      .startOf("day")
      .add(1, "days")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    console.log(firstDate, secondDate);
    const filter = {
      startTime: {
        between: [firstDate, secondDate],
      },
    };


    const fetchAppointments = async (date) => {
      try {
        const appointmentData = await client.graphql({
          query: listAppointments,
          variables: { filter },
        });
        console.log("appointmentData", appointmentData.data.listAppointments);
        setAppointments(appointmentData.data.listAppointments.items);
        setFilteredAppointments(appointmentData.data.listAppointments.items);
      } catch (err) {
        console.log("error fetching appointments", err);
      }
    };
    fetchAppointments(selectedDate);

    const createSub = client
    .graphql({
      query: onCreateAppointment,
    })
    .subscribe({
      next: (eventData) => {
        const newEntry = eventData.data.onCreateAppointment;
        setAppointments((prevAppointments) => [...prevAppointments, newEntry]);
        setFilteredAppointments((prevAppointments) => [...prevAppointments, newEntry]);
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
        setFilteredAppointments((prevAppointments) => {
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
        setFilteredAppointments((prevGasWells) =>
            prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
          );
      },
    });
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };

  }, [selectedDate]);
  const changeDate = ({ increment, type }) => {
    if (type == "change") {
      setSelectedDate(moment(selectedDate).add(increment, "days"));
    } else if (type == "today") {
        setSelectedDate(moment());
    }
  };
  //   const handleDateChange = async (event) => {
  //     const date = event.target.value;
  //     console.log(date)
  //     setSelectedDate(date);
  //   };

  return (
    <div style={{ padding: "0.75rem" }}>
    <Flex justify="space-between">
        <Flex align="center" gap="xs">
          <Group>
          <DateInput
        size="sm"
        value={selectedDate}
        onChange={setSelectedDate}
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
      
    </div>
  );
};

export default AppointmentsList;
