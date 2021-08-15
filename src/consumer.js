require('dotenv').config();
const amqp = require('amqplib');
const Listener = require('./Listener');
const NotesService = require('./NotesService');
const MailSender = require('./MailSender');

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:notes', {
    durable: true,
  });

  channel.consume('export:notes', listener.listen, {
    noAck: true,
  });
};

init();
