const axios = require('axios');
const BACKEND_URL = 'http://localhost:5000/api/ingest';

const sensors = [
  { sensor_id: 'FURNACE_01', unit: 'kWh', department: 'Melting', base_value: 100, variance: 50 },
  { sensor_id: 'FURNACE_02', unit: 'kWh', department: 'Melting', base_value: 120, variance: 40 },
  { sensor_id: 'CNC_MACHINE_10', unit: 'kWh', department: 'Machining', base_value: 10, variance: 5 },
  { sensor_id: 'CNC_MACHINE_12', unit: 'kWh', department: 'Machining', base_value: 12, variance: 6 },
  { sensor_id: 'BACKUP_GENSET', unit: 'liter_diesel', department: 'Utilities', base_value: 2, variance: 5 },
];

const getRandomValue = (sensor) => sensor.base_value + (Math.random() * sensor.variance);

const sendData = async () => {
  const sensor = sensors[Math.floor(Math.random() * sensors.length)];
  const payload = {
    sensor_id: sensor.sensor_id,
    value: getRandomValue(sensor),
    unit: sensor.unit,
    department: sensor.department,
  };

  try {
    const res = await axios.post(BACKEND_URL, payload);
    console.log(`[OK] Sent ${payload.department} data: ${payload.value.toFixed(2)} ${payload.unit}. Response: ${res.status}`);
  } catch (error) {
    console.error(`[FAIL] Error for ${payload.sensor_id}:`, error.message);
  }
};

console.log('Sensor simulator starting... Sending data every 3 seconds.');
setInterval(sendData, 3000);