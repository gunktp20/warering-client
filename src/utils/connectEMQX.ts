import mqtt from "mqtt";

const connectEMQX = async (usernameDevice: string, password_law: string) => {
  const client = await mqtt.connect(import.meta.env.VITE_EMQX_DOMAIN, {
    protocol: import.meta.env.VITE_EMQX_PROTOCAL,
    host: import.meta.env.VITE_EMQX_HOST,
    clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
    username: usernameDevice,
    password: password_law,
  });
  return client;
};

export default connectEMQX;
