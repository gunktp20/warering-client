import mqtt from "mqtt";
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "smart-home7",
  username: "smart-home7",
  password: "smart-home6",
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
    let Test7 = (Math.random() * 100).toFixed(2);
    Test7 = map(Test7, 0, 100, 23, 26).toFixed(2);
    let speed_val = (Math.random() * 100).toFixed(2);
    speed_val= map(speed_val, 0, 10000, 2000, 2500).toFixed(0);
    let brightness_val = (Math.random() * 10000).toFixed(0);
     brightness_val = map(brightness_val, 0, 10000, 500, 1200).toFixed(0);

    client.publish(
      "65e2e2e1946718f317756f47/smart-home7/publish",
      JSON.stringify({
        Test7,
        speed_val,
        brightness_val,
      }),
      {
        qos: 0,
        retain: true,
      }
    );
  }, 1000);

  setInterval(() => {
    client.subscribe(
      "65e2e2e1946718f317756f47/smart-home7/subscribe",
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
  led : 0
}

// Receive messages
client.on("message", function (topic, message) {
  const payload = JSON.parse(message.toString());
  console.log(payload)
  if (payload.led === 1) {
    console.log("ไฟกลางห้องถูกเปิด ✔️");
    
  }
  if (payload.led === 0) {
    console.log("ไฟกลางห้องถูกปิด ❌");
    
  }
  if (payload["brightness-bedroom"] > 0) {
    console.log("ความสว่างไฟหัวเตียง ", payload["brightness-bedroom"], "%");
    
  }
  if (payload["brightness-bedroom"] < 1) {
    console.log("ความสว่างในห้อง 0 %");
    
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
