const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const params = {
    UserPoolId: 'us-east-1_xWuXFvELQ',
    Limit: 60
  };

  try {
    const data = await cognito.listUsers(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ Users: data.Users })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};