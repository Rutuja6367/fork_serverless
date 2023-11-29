const AWS = require('aws-sdk');
const axios = require('axios');
const dotenv = require('dotenv')

exports.handler = async (event, context) => {
    dotenv.config()
    const formData = require('form-data');
    const Mailgun = require('mailgun.js');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', 
    key: process.env.MAILGUN_API_KEY ,
    domain: process.env.doaminName,
   
});

    mg.messages.create('sandbox-123.mailgun.org', {
        from: "Excited User <mailgun@sandbox-123.mailgun.org>",
        to: ["test@example.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>"
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); 
    console.log("Lambda function invoked with event:", JSON.stringify(event, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Lambda function executed successfully" }),
    };
};