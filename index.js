const AWS = require('aws-sdk');
const axios = require('axios');
const dotenv = require('dotenv')
const formData = require('form-data');
const { Storage } = require('@google-cloud/storage');
/* const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec); */

dotenv.config();

exports.handler = async (event, context) => {
     
        const Message = event.Records[0].Sns.Message;
        console.log(event.Records);
        // Check if the record has the expected Sns property
         const parsedMessage = JSON.parse(Message);
        console.log('Parsed Message:', parsedMessage);
      
  // Generate a unique ID using timestamp and a random component
  const timestamp = new Date().getTime();
  const randomComponent = Math.floor(Math.random() * 1000);
  const uniqueId = `${timestamp}-${randomComponent}`;
   

  const params = {
    TableName: process.env.dynamoTable,
    
    Item: {
      id: uniqueId, 
      Email: `${Message.userEmail}`,
      Repository: `${Message.submission_url}`,
      Timestamp: new Date().toISOString(),
    },
  };
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    await dynamoDB.put(params).promise();
    const key = process.env.GOOGLE_ACCESS_KEY;
    const decodedKey = key.replace(/\\n/g, '\n');
    
    const storage = new Storage({
      projectId: 'dev-webapp-project-405903',
      credentials: {
        client_email: 'patil.rut@northeastern.edu',
        private_key: decodedKey,
      },
    });


    // Specify the name of your Google Cloud Storage Bucket
    const bucketName = "bucket-rutuja-new";

    // Define the destination object name in the bucket
     const objectName = `${Message.assignment_id}/${Message.id}/release.zip`;

    const mailgun = require('mailgun-js')({

    apiKey: "9ecbc2c13f81dda8a18a978aaf752429-30b58138-709bce3b" ,
    domain: "dev.cloudcsye.me",
   
});
//console.log("Lambda function invoked with event:", JSON.stringify(event, null, 2));

const data = {
  from: "checkmail@dev.cloudcsye.me",
  to: "patil.rut@northeastern.edu",
  subject: "Hello",
  html: `<h1>Submission Done</h1><h1>Please find the code</h1><h1>${objectName}</h1>`,
};

    try {
      const body = await mailgun.messages().send(data);
      console.log("Email sent successfully:", body);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  
}
//handler()