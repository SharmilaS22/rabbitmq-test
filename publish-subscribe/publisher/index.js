const express = require("express")

const app = express()
const PORT = process.env.PORT || 4000;

app.use(express.json())


const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', (err0, connection) => {
    if (err0) {
        throw err0;
    } 

    connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        const exchange = 'test-exchange';
        const exchange_type = 'fanout';

        const message = "Hello World!";

        channel.assertExchange(exchange, exchange_type, {
            durable: false
        })

        channel.publish(exchange, '', Buffer.from(message));
        console.log("Message sent to the exchange");

        setTimeout(() => {
            connection.close();
        }, 500)
    })
})


app.listen(PORT, () => console.log("Server listening at port " + PORT))