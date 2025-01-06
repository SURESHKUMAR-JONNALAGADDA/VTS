import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import customMarker from './loc.png';
// Fix default icon issue
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [25, 41], // Adjust size as needed
  iconAnchor: [12, 41], // Adjust anchor point as needed
  popupAnchor: [1, -34], // Adjust popup position as needed
  shadowUrl: markerShadow,
  shadowSize: [41, 41], // Default shadow size
});


function App() {
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState('');

  const fetchVehicleLocation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/vehicle-location/${vehicleId}`
      );
      setVehicleData(response.data);
      setError('');
    } catch (err) {
      setError('Vehicle not found or an error occurred.');
      setVehicleData(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Vehicle Tracking System</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
        />
        <button onClick={fetchVehicleLocation}>Track Vehicle</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {vehicleData && (
        <div>
          <h2>Vehicle ID: {vehicleData.vehicleId}</h2>
          <p>Latitude: {vehicleData.latitude}</p>
          <p>Longitude: {vehicleData.longitude}</p>
          <p>Speed: {vehicleData.speed} km/h</p>
          <p>Last Updated: {new Date(vehicleData.lastUpdated).toLocaleString()}</p>
          <MapContainer
            center={[vehicleData.latitude, vehicleData.longitude]}
            zoom={13}
            style={{ height: '400px', width: '80%', margin: '20px auto' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[vehicleData.latitude, vehicleData.longitude]} icon={customIcon}>
              <Popup>
                Vehicle ID: {vehicleData.vehicleId}<br />
                Speed: {vehicleData.speed} km/h
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;
