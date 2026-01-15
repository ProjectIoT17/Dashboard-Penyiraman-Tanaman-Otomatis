window.addEventListener("load", () => {

  const mqttStatus = document.getElementById("mqttStatus");

  const client = mqtt.connect(
    "wss://446ae662e1794c52a764bff380d64cfe.s1.eu.hivemq.cloud:8884/mqtt",
    {
      username: "ESP32",
      password: "Project18116*",
      reconnectPeriod: 3000
    }
  );

  client.on("connect", () => {
    mqttStatus.textContent = "CONNECTED";
    mqttStatus.className = "online";
    client.subscribe("irrigation/#");
  });

  client.on("reconnect", () => {
    mqttStatus.textContent = "RECONNECTING...";
    mqttStatus.className = "offline";
  });

  client.on("offline", () => {
    mqttStatus.textContent = "OFFLINE";
    mqttStatus.className = "offline";
  });

  client.on("message", (topic, message) => {
    const data = message.toString();

    if (topic === "irrigation/soil") soil.textContent = data;
    if (topic === "irrigation/voltage") volt.textContent = data;
    if (topic === "irrigation/current") current.textContent = data;
    if (topic === "irrigation/power") power.textContent = data;
    if (topic === "irrigation/mode") mode.textContent = data;
    if (topic === "irrigation/pump") pump.textContent = data;
    if (topic === "irrigation/setpoint_low") setLow.value = data;
    if (topic === "irrigation/setpoint_high") setHigh.value = data;
  });

  // ===== CONTROL =====
  window.setAuto = () => {
    client.publish("irrigation/cmd/mode", "AUTO");
  };

  window.setManual = () => {
    client.publish("irrigation/cmd/mode", "MANUAL");
  };

  window.pumpOn = () => {
    client.publish("irrigation/cmd/pump", "ON");
  };

  window.pumpOff = () => {
    client.publish("irrigation/cmd/pump", "OFF");
  };

  window.updateSetpoint = () => {
    client.publish("irrigation/cmd/setpoint_low", setLow.value);
    client.publish("irrigation/cmd/setpoint_high", setHigh.value);
  };
});
