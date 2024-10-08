const mqtt = require('mqtt')
console.log("เริ่มต้น mqtt client");

const url = "ws://localhost:8083/mqtt";

const options = {
  connectTimeout: 4000,
  clientId: "เครื่องตรวจจับควันชั้นที่ 3",
  username: "smoke-detector-f3",
  password: "smdtt-f3",
  protocol: "ws",
  clean: true,
  reconnectPeriod: 5000,
};
const client = mqtt.connect(url, options);

const statusList = [
  "ตรวจพบควัน 🔴",
  "ไม่พบควัน",
  "ไม่พบควัน"
]

client.on("connect", function () {
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log("เชื่อมต่อ mqtt สำเร็จ");
  console.log(`ส่งข้อมูลจากอุปกรณ์ ไปยัง server แล้ว ✔️ `);
  setInterval(() => {

    const smoke_val_f3 = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const tem_val_f3 = Math.floor(Math.random() * (100 - 60 + 1)) + 60
    const status_f3 = Math.floor(Math.random() * 3) + 0;
    // const status_f3 = 1

    client.publish(
      "66db28fbe5816c419067409f/smdtt-f3/publish",
      JSON.stringify({
        // รายงานควันจากชั้นที่ 3
        smoke_val_f3: statusList[Number(status_f3)] == statusList[1] || statusList[Number(status_f3)] == statusList[2] ? 5 : Number(smoke_val_f3),
        tem_val_f3: statusList[Number(status_f3)] == statusList[1] ? 30 : Number(tem_val_f3) ,
        status_f3: statusList[Number(status_f3)] ? "ไม่พบควัน 🔴" : "ตรวจพบควัน 🟢",
      }),
      {
        qos: 0,
        retain: true,
      }
    );
  }, 2500);

  setInterval(() => {
    client.subscribe(
      "66db28fbe5816c419067409f/smdtt-f3/subscribe",
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
  if (payload.action_f3 === 0) {
    console.log('ฉีดน้ำ ✔️');
  } else if (payload.action_f3 === 1) {
    console.log('ปิดน้ำ ❌');
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
