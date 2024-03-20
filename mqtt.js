// const mqtt = require("mqtt");
import mqtt from "mqtt";
console.log("started");
/***
 * Browser
 * This document explains how to use MQTT over WebSocket with the ws and wss protocols.
 * EMQX's default port for ws connection is 8083 and for wss connection is 8084.
 * Note that you need to add a path after the connection address, such as /mqtt.
 */
const url = "mqtt://localhost:1883";
/***
 * Node.js
 * This document explains how to use MQTT over TCP with both mqtt and mqtts protocols.
 * EMQX's default port for mqtt connections is 1883, while for mqtts it is 8883.
 */
// const url = 'mqtt://broker.emqx.io:1883'

// Create an MQTT client instance
const options = {
  // Clean session
  // clean: true,
  connectTimeout: 4000,
  // Authentication
  clientId: "TestMQTT1",
  username: "TestMQTT1",
  password: "TestMQTT1",
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("Connected");
  setInterval(() => {
    console.log("publish");
    client.publish(
      "65fa7d160a66331e55eb483c/TestMQTT1/publish",
      JSON.stringify({
        tem_val: (Math.random() * 100).toFixed(2),
        speed_val: (Math.random() * 100).toFixed(2),
      }),
      {
        qos: 0,
        retain: true,
      }
    );
  }, 500);
});

// Receive messages
client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  // client.end();
});
