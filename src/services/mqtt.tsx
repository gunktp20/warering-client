import mqtt, { MqttClient } from "mqtt";

class ConnectMQTT {
  private static instance: ConnectMQTT;
  public _mqtt: MqttClient;

  private constructor(usernameDevice: string, password: string) {
    this._mqtt = mqtt.connect(import.meta.env.VITE_EMQX_DOMAIN, {
      protocol: "ws",
      host: "localhost",
      clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
      // port: 8083,
      username: usernameDevice,
      password: password,
    });
  }

  static getInstance(usernameDevice: string, password: string) {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ConnectMQTT(usernameDevice, password);
    return this.instance;
  }
}

export default ConnectMQTT;
