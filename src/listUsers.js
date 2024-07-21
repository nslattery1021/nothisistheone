const AWS = require('aws-sdk');

// Set the region (if not set in config file)
AWS.config.update({ region: 'us-east-1' });
// AWS.config.region = 'us-east-1'; // Replace with your region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:b6377013-6776-40ea-a866-b1621ce402c6' // Replace with your Identity Pool ID
// });

const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const listUsers = async () => {
    const params = {
        UserPoolId: 'us-east-1_xWuXFvELQ', // Replace with your Cognito User Pool ID
        Limit: 10 // Adjust the limit as needed
    };

    try {
        const data = await cognito.listUsers(params).promise();
        console.log('Users:', data.Users);
        return data.Users;
    } catch (err) {
        console.error('Error listing users:', err);
    }
};

module.exports = { listUsers };