import React, { useState, useEffect } from "react";
import {
  Textarea,
  MultiSelect,
  Button,
  Group,
  Box,
  Select,
  TextInput,
  Flex,
  Popover,
  Text,
  Center,
  Stack,
} from "@mantine/core";
import {
  DateInput,
  DatePicker,
  DateTimePicker,
  TimeInput,
} from "@mantine/dates";
import {
  IconClock,
  IconUsers,
  IconBuildingFactory,
  IconAlignJustified,
  IconBriefcase2,
} from "@tabler/icons-react";
import { listLandfills } from "./graphql/queries";
import { hasLength, useForm, isNotEmpty } from "@mantine/form";

import { generateClient } from "aws-amplify/api";
import moment from "moment";

const AddJob = ({ onSubmit, users, landfills, chosenDate, technician }) => {
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const chosenDateFormatted = new Date(chosenDate);
const endDateHourAdd = 8;
  const form = useForm({
    mode: "controlled",
    initialValues: {
      jobType: "Service",
      summary: "",
      technicians: technician ? [technician] : [],
      landfills: "",
      startDate: chosenDateFormatted,
      endDate: new Date(chosenDateFormatted.getTime() + endDateHourAdd * 60 * 60 * 1000),
      startTime: formatTime(chosenDateFormatted),
      endTime: formatTime(
        new Date(chosenDateFormatted.getTime() + endDateHourAdd * 60 * 60 * 1000)
      ),
    },

    validate: {
      jobType: isNotEmpty("Enter job Type"),
      summary: isNotEmpty("Enter summary"),
      technicians: isNotEmpty("Must have at least 1 technician"),
      landfills: isNotEmpty("Must choose a landfill"),
      startDate: isNotEmpty("Enter start date"),
      endDate: isNotEmpty("Enter end date"),
      startTime: isNotEmpty("Enter start time"),
      endTime: isNotEmpty("Enter end time"),
      // times: () => {
      //   const values = form.getValues();
      //   console.log(values);

      //   const startDateTime = moment(
      //     `${values.startDate} ${values.startTime}`,
      //     "YYYY-MM-DD HH:mm"
      //   );
      //   const endDateTime = moment(
      //     `${values.endDate} ${values.endTime}`,
      //     "YYYY-MM-DD HH:mm"
      //   );
      //   console.log(endDateTime.isBefore(startDateTime));
      //   return endDateTime.isBefore(startDateTime)
      //     ? { endTime: "End time cannot be before start time" }
      //     : null;
      // },
    },
  });

  const usersFormatted = users.map((user) => {
    return { value: user.Username, label: user.FullName };
  });

  const client = generateClient();
  //   const isEdit = !!gasWell?.id

  const generateTimes = () => {
    const times = [];
    const start = moment().startOf("day"); // Start of the day (12:00 AM)
    const end = moment().endOf("day").subtract(14, "minutes"); // End of the day (11:45 PM)

    while (start.isBefore(end) || start.isSame(end)) {
      times.push({
        value: start.clone().format("HH:mm"),
        label: start.clone().format("h:mm a"),
      });
      start.add(15, "minutes");
    }
    return times;
  };

  useEffect(() => {
    const startDateTime = new Date(form.values.startDate);
    const [startHours, startMinutes] = form.values.startTime.split(":");
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(form.values.endDate);
    const [endHours, endMinutes] = form.values.endTime.split(":");
    endDateTime.setHours(endHours, endMinutes);

    if (startDateTime >= endDateTime) {
      const adjustedEndDateTime = new Date(
        startDateTime.getTime() + endDateHourAdd * 60 * 60 * 1000
      );
      form.setFieldValue("endDate", adjustedEndDateTime);
      form.setFieldValue("endTime", formatTime(adjustedEndDateTime));
    }
  }, [
    form.values.startDate,
    form.values.endDate,
    form.values.startTime,
    form.values.endTime,
  ]);

  const timeArray = generateTimes();
  const isMobile = window.innerWidth <= 768;

  // const changeJobType = (newJobType) => {
  //   const currentStartTime = moment(
  //     `${moment(form.getValues().startDate).format("YYYY-MM-DD")} ${form.getValues().startTime}`
  //   );
  //   const newEndTime = currentStartTime.add(
  //     newJobType == "Installation" ? 8 : 2,
  //     "hours"
  //   );

  //   form.setValues({
  //     endDate: newEndTime,
  //     endTime: newEndTime.format("HH:mm"),
  //     jobType: newJobType,
  //   });
  // };
  const combineDateAndTime = (date, time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };

  const changingStartTime = (newTime) => {
    form.setFieldValue('startTime', newTime);
    const startDateTime = combineDateAndTime(form.values.startDate, newTime);
    const adjustedEndDateTime = new Date(startDateTime.getTime() + endDateHourAdd * 60 * 60 * 1000);
    form.setFieldValue('endDate', adjustedEndDateTime);
    form.setFieldValue('endTime', formatTime(adjustedEndDateTime));
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Stack gap="sm">
          <Flex gap="md" justify="flex-start" align="center" wrap="nowrap">
            <IconBuildingFactory height={18} />
            <Select
              style={{ flexGrow: 1 }}
              {...form.getInputProps("landfills")}
              key={form.key("landfills")}
              placeholder="Choose landfill"
              data={landfills.map((user) => {
                return { value: user.id, label: user.name };
              })}
              searchable
              clearable
            />
          </Flex>
          <Flex gap="md" justify="flex-start" align="center" wrap="nowrap">
            <IconBriefcase2 height={18} />
            <Select
              {...form.getInputProps("jobType")}
              key={form.key("jobType")}
              style={{ flexGrow: 1 }}
              placeholder="Choose job type"
              data={["Service", "Installation"]}
              // onChange={changeJobType}
              clearable
              searchable
            />
          </Flex>
          <Flex gap="md" justify="flex-start" align="center" wrap="nowrap">
            <IconUsers height={18} />
            <MultiSelect
              {...form.getInputProps("technicians")}
              key={form.key("technicians")}
              style={{ flexGrow: 1 }}
              placeholder="Choose technicians"
              clearable
              hidePickedOptions
              data={
                users &&
                users.map((user) => {
                  return { value: user.Username, label: user.FullName };
                })
              }
              searchable
            />
          </Flex>
          {isMobile ? (
            <Flex gap="md" justify="flex-start" align="center" wrap="nowrap">
              <IconClock height={18} />

              <Flex direction="column" gap="0.25rem">
                <Flex>
                  <DateInput
                    variant="unstyled"
                    {...form.getInputProps("startDate")}
                    key={form.key("startDate")}
                    placeholder="Start Date"
                  />
                  <Select
                    variant="unstyled"
                    rightSection={<></>}
                    {...form.getInputProps("startTime")}
                    key={form.key("startTime")}
                    data={timeArray}
                    onChange={changingStartTime}
                  />
                </Flex>

                <Flex>
                  <DateInput
                    variant="unstyled"
                    placeholder="End Date"
                    {...form.getInputProps("endDate")}
                    key={form.key("endDate")}
                  />
                  <Select
                    {...form.getInputProps("endTime")}
                    key={form.key("endTime")}
                    variant="unstyled"
                    ta="center"
                    rightSection={<></>}
                    data={timeArray}
                  />
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Flex gap="md" justify="flex-start" align="center" wrap="nowrap">
              <IconClock height={18} />
              <DateInput
                variant="unstyled"
                {...form.getInputProps("startDate")}
                key={form.key("startDate")}
                placeholder="Start Date"
              />
              <Select
                variant="unstyled"
                rightSection={<></>}
                {...form.getInputProps("startTime")}
                key={form.key("startTime")}
                data={timeArray}
                // onChange={changingStartTime}
              />
              -
              <DateInput
                display={
                  moment(form.getValues().startDate).format("YYYY-MM-DD") ==
                  moment(form.getValues().endDate).format("YYYY-MM-DD")
                    ? "none"
                    : ""
                }
                variant="unstyled"
                placeholder="End Date"
                {...form.getInputProps("endDate")}
                key={form.key("endDate")}
              />
              <Select
                {...form.getInputProps("endTime")}
                key={form.key("endTime")}
                variant="unstyled"
                ta="center"
                rightSection={<></>}
                data={timeArray}
              />
            </Flex>
          )}

          <Flex gap="md" justify="flex-start" align="flex-start" wrap="nowrap">
            <IconAlignJustified height={18} />
            <Textarea
              {...form.getInputProps("summary")}
              key={form.key("summary")}
              autosize
              style={{ flexGrow: 1 }}
              minRows={3}
              maxRows={5}
            />
          </Flex>
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">{"Add New Job"}</Button>
        </Group>
      </form>
    </Box>
  );
};

export default AddJob;
