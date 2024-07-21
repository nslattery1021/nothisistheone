// src/App.js
import React, { useState, useEffect } from "react";
import { Flex, Button, Table } from "@mantine/core";
import { getCurrentUser } from "aws-amplify/auth";
import { signOut } from "aws-amplify/auth";
import { get } from "aws-amplify/api";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import

import {
  IconPlus,
  IconXboxXFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
// import 'dotenv/config'
async function handleSignOut() {
  try {
    await signOut({ global: true });
  } catch (error) {
    console.log("error signing out: ", error);
  }
}

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = new CognitoIdentityProviderClient({
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
      const response = await client.send(command);

      const organizeUserAttributes = (attributes) => {
        console.log("attributes", attributes);
        return attributes?.reduce((acc, attr) => {
          acc[attr.Name] = attr.Value;
          return acc;
        }, {});
      };

      const transformedUsers = response.Users.map((user) => {
        const organizedAttributes = organizeUserAttributes(user.Attributes);
        console.log("organizedAttributes", organizedAttributes);
        return {
          Username: user.Username,
          given_name: organizedAttributes.given_name,
          family_name: organizedAttributes.family_name,
          email: organizedAttributes.email,
          phone_number: organizedAttributes.phone_number,
          phone_number_verified: organizedAttributes.phone_number_verified,
          email_verified: organizedAttributes.email_verified,
        };
      });
      setUsers(transformedUsers);
    };

    listUsers();
  }, []);

  // if (loading) {
  //     return <div>Loading...</div>;
  // }
  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phoneNumberString;
  };
  const rows = users.map((user) => (
    <Table.Tr key={user.Username}>
      <Table.Td>
        {user.given_name} {user.family_name}
      </Table.Td>
      <Table.Td>
        <Flex align="center" gap="5">
          {user.email}
          {verifiedIcon(user.email_verified)}
        </Flex>
      </Table.Td>
      <Table.Td>
        <Flex align="center" gap="5">
          {formatPhoneNumber(user.phone_number)}
          {verifiedIcon(user.phone_number_verified)}
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  function verifiedIcon(isVerified) {
    return isVerified == "true" ? (
      <IconRosetteDiscountCheckFilled
        style={{ width: "1.3rem", height: "1.3rem" }}
        stroke={3}
        color="#21ba45"
      />
    ) : (
      <IconXboxXFilled
        style={{ width: "1.3rem", height: "1.3rem" }}
        stroke={3}
        color="red"
      />
    );
  }

  return (
    <div>
      {/* <Modal opened={opened} onClose={close} title="Add Landfill">
       <AddLandfill />
    </Modal> */}
      <Flex
        mih={50}
        gap="sm"
        justify="flex-end"
        align="center"
        direction="row"
        wrap="nowrap"
      >
        {/* <Button leftSection={<IconPlus size={14} />} onClick={open}>Add New</Button> */}
      </Flex>

      <h3>Users</h3>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default Users;
