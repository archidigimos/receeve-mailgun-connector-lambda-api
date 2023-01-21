const API_KEY = '95f82492ce03039eac0d6dbc97227773-f7d687c0-50af170f';
const DOMAIN = 'sandboxbd19c99b15754db8aac2ac1d698c92c0.mailgun.org';

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

const messageData = {
    from: 'archismansarkar@sandboxbd19c99b15754db8aac2ac1d698c92c0.mailgun.org',
    to: 'archidehex@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!'
};

client.messages.create(DOMAIN, messageData)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.error(err);
    });