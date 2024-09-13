import mqtt from "mqtt";
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "บ้านอัจฉริยะ",
  username: "smart-home",
  password: "smh-1",
  protocol: "ws",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt-smart-home สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง server แล้ว ✔️ `);

  setInterval(() => {
    const tem_val = Math.floor(Math.random() * (36 - 26 + 1)) + 26

    client.publish(
      "66d5f29f12bc1206279c63b5/smh-1/publish",
      JSON.stringify({
        tem_val: Number(tem_val)
      }),
      {
        qos: 0,
        retain: true,
      }
    );
  }, 2000);

  setInterval(() => {
    client.subscribe(
      "66d5f29f12bc1206279c63b5/smh-1/subscribe",
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

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload);
  if (payload.led === 0) {
    console.log("ไฟกลางห้องถูกเปิด ✔️");
  }
  if (payload.led === 1) {
    console.log("ไฟกลางห้องถูกปิด ❌");
  }
  if (payload["brightness-bedroom"] > 0) {
    console.log("ความสว่างไฟในห้อง ", payload["brightness-bedroom"], "%");
  }
  if (payload["brightness-bedroom"] < 1) {
    console.log("ความสว่างไฟในห้อง 0 %");
  }
  console.log("--------------------------------");
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
