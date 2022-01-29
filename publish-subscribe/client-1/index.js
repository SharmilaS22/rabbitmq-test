const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());


const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', (err0, connection) => {
    if (err0) throw err0

    connection.createChannel((err1, channel) => {
        if (err1) throw err1

        const exchange_name = 'test-exchange';
        const exchange_type = 'fanout';
        
        channel.assertExchange(exchange_name, exchange_type, {
            durable: false
        });

        channel.assertQueue(
            '', //queue name
            { exclusive: true },
            (err2, q ) => {
                if (err2) throw err2

                console.log("Waiting for messages....");

                // binding the queue
                channel.bindQueue(q.queue, exchange_name, '');

                channel.consume(
                    q.queue, 
                    (msg) => {
                        if (msg.content)
                            console.log(msg.content.toString())
                    },
                    {
                        noAck: true
                    }
                )
            }
        )
            
    })
})




app.listen(PORT, () => console.log("Server running at port " + PORT));