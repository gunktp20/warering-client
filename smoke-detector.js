import mqtt from "mqtt";
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "ตรวจจับฝุ่น",
  username: "smoke-detector",
  password: "za123456",
  protocol: "ws",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง server แล้ว ✔️ `);
  setInterval(() => {
    const smoke_val = Math.floor(Math.random() * 5001);

    client.publish(
      "665e1d8d8c80d27112e47fa8/smoke-detector/publish",
      JSON.stringify({
        smoke_val: Number(smoke_val),
      }),
      {
        qos: 0,
        retain: true,
      }
    );
  }, 1000);

  setInterval(() => {
    client.subscribe(
      "665e1d8d8c80d27112e47fa8/smoke-detector/subscribe",
      {
        qos: 0,
        retain: true,
      },

      (err, granted) => {
        if (err) {
          console.log("Error: " + err);
        }
        // console.log(`${granted} was subscribed`);
      }
    );
  }, 1000);
});

const test = {
  led: 0,
};

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload);
  if (payload.water === 0) {
    console.log("ฉีดน้ำ ✔️");
  }
  if (payload.water === 1) {
    console.log("ปิดน้ำ ❌");
  }
});

client.on("disconnect", function (topic, message) {
  console.log("อุปกรณ์ Disconnect");
});

client.on("reconnect", function (topic, message) {
  console.log("อุปกรณ์ reconnect");
});

const map = (x, in_min, in_max, out_min, out_max) => {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
