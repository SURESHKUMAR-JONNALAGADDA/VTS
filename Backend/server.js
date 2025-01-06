const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// API to update vehicle location
app.post('/update-location', async (req, res) => {
  const { vehicleId, latitude, longitude, speed } = req.body;

  try {
    let vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle) {
      vehicle = new Vehicle({ vehicleId, latitude, longitude, speed });
    } else {
      vehicle.latitude = latitude;
      vehicle.longitude = longitude;
      vehicle.speed = speed;
      vehicle.lastUpdated = Date.now();
    }

    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating vehicle location', error: err });
  }
});

// API to get vehicle location
app.get('/vehicle-location/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const vehicle = await Vehicle.findOne({ vehicleId });
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching vehicle data', error: err });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Tracking API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
