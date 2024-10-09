const mqtt = require("mqtt");
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  clientId: "mqtt-present",
  // TODO change  username and password
  username: "mqtt-present",
  password: "mqtt-present",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง Broker แล้ว ✔️ `);
  let i = 0;
  setInterval(() => {
    client.publish(
      // TODO change topic
      "66db28fbe5816c419067409f/mqtt-present-topic/publish",
      JSON.stringify({
        number: Math.random() * 100,
      }),
      // TODO uncomment
      {
        qos: 0,
        retain: false,
      }
    );
    i += 1;
  }, 1000);

  // Subscribe
  setInterval(() => {
    client.subscribe(
      // TODO change topic
      "66db28fbe5816c419067409f/mqtt-present-topic/subscribe",
      // TODO uncomment
      {
        // qos: 0,
        // retain: true,
      },

      (err, granted) => {
        if (err) {
          console.log("Error: " + err);
        }
      }
    );
  }, 1000);
});

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload);
  console.log("--------------------------------");
});

client.on("disconnect", function (topic, message) {
  console.log("อุปกรณ์ Disconnect");
});

client.on("reconnect", function (topic, message) {
  console.log("อุปกรณ์ reconnect", topic, message);
});
