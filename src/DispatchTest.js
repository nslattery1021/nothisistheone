import React, { useState, useEffect } from 'react';
import AppointmentsList from './AppointmentsList';
import JobTechsList from './JobTechsList';

import { generateClient } from "aws-amplify/api";
import { listLandfills } from "./graphql/queries";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import

const DispatchTest = () => {
  const [users, setUsers] = useState([]);
  const [landfills, setLandfills] = useState([]);
  const [usersSchedule, setUsersSchedule] = useState([]);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const clientUser = new CognitoIdentityProviderClient({
    region: process.env.REACT_APP_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    },
  });
  const client = generateClient();

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
  return (
    <div>
      <AppointmentsList setFilteredAppointments={setFilteredAppointments} />
      <JobTechsList usersSchedule={usersSchedule} users={users} filteredAppointments={filteredAppointments} />
    </div>
  );
};

export default DispatchTest;