const mqtt = require("mqtt");
const dotenv = require("dotenv");

dotenv.config();

console.log("MQTT CONNECTION TEST");
console.log("========================");
console.log(`Server: ${process.env.MQTTSERVER}`);
console.log(`Username: ${process.env.MQTT_USERNAME}`);
console.log(`ClientID: ${process.env.CLIENTID}`);
console.log(`Password: ${process.env.PASSWORD_MQ ? "[DEFINED]" : "[MISSING]"}`);
console.log("========================");

console.log("========================");

const client = mqtt.connect(process.env.MQTTSERVER, {
  username: process.env.MQTT_USERNAME,
  password: process.env.PASSWORD_MQ,
  clientId: process.env.CLIENTID,
  keepalive: 60,
  reconnectPeriod: 1000,
  connectTimeout: 10000,
});

// Connection test
client.on("connect", () => {
  console.log("Connection OK!");
  console.log("Credentials are correct");

  // Test subscription to a simple topic
  client.subscribe("Extensometer/get", (err) => {
    if (!err) {
      console.log("Subscribed to topic Extensometer/get");
    }
  });
});

// Test message reception
client.on("message", (topic, message) => {
  console.log(`Message received on ${topic}: ${message.toString()}`);
});

client.on("error", (error) => {
  console.error("❌ CONNECTION ERROR!");
  console.error("Details:", error.message);

  if (error.code === 4) {
    console.error("Credentials rejected (incorrect username/password)");
  } else if (error.code === 5) {
    console.error("Connection not authorized");
  } else {
    console.error("Network error or server inaccessible");
  }
});

client.on("offline", () => {
  console.warn("Client offline");
});

console.log("Attempting to connect...");
