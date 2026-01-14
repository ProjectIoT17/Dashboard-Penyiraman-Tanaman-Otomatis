window.addEventListener("load", () => {

  const mqttStatus = document.getElementById("mqttStatus");
  const soil = document.getElementById("soil");
  const volt = document.getElementById("volt");
  const current = document.getElementById("current");
  const power = document.getElementById("power");
  const mode = document.getElementById("mode");
  const pump = document.getElementById("pump");
  const threshold = document.getElementById("threshold");

  const client = mqtt.connect(
    "wss://446ae662e1794c52a764bff380d64cfe.s1.eu.hivemq.cloud:8884",
    {
      username: "ESP32",
      password: "Project18116*",
      reconnectPeriod: 3000,
      clean: true
    }
  );

  client.on("connect", () => {
    mqttStatus.textContent = "CONNECTED";
    mqttStatus.className = "online";
    client.subscribe("irrigation/#");
  });

  client.on("offline", () => {
    mqttStatus.textContent = "OFFLINE";
    mqttStatus.className = "offline";
  });

  client.on("reconnect", () => {
    mqttStatus.textContent = "RECONNECTING...";
    mqttStatus.className = "offline";
  });

  client.on("message", (topic, message) => {
    const data = message.toString();

    if (topic === "irrigation/soil") soil.textContent = data;
    if (topic === "irrigation/voltage") volt.textContent = data;
    if (topic === "irrigation/current") current.textContent = data;
    if (topic === "irrigation/power") power.textContent = data;
    if (topic === "irrigation/mode") mode.textContent = data === "1" ? "OTOMATIS" : "MANUAL";
    if (topic === "irrigation/pump") pump.textContent = data === "1" ? "ON" : "OFF";
    if (topic === "irrigation/threshold") threshold.value = data;
  });

  // ===== CONTROL =====
  window.toggleMode = () => {
    client.publish("irrigation/cmd/mode", "TOGGLE");
  };

  window.pumpOn = () => {
    client.publish("irrigation/cmd/pump", "ON");
  };

  window.pumpOff = () => {
    client.publish("irrigation/cmd/pump", "OFF");
  };

  window.setThreshold = () => {
    client.publish("irrigation/cmd/threshold", threshold.value);
  };
});
