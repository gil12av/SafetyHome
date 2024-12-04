const express = require('express');
const User = require('../models/User');
const ScannedDevice = require("../models/ScannedDevices");
const router = express.Router();

// fetch a new user or exiting user.
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Add new scanned device for a user
router.post("/devices", async (req, res) => {
    const { userId, deviceName, ipAddress, macAddress } = req.body;
    try {
      const device = new ScannedDevice({ userId, deviceName, ipAddress, macAddress });
      await device.save();
      res.status(201).json({ message: "Device added successfully", device });
    } catch (error) {
      res.status(500).json({ error: "Failed to add device" });
    }
  });

// Get devices for a user
router.get("/devices/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const devices = await ScannedDevice.find({ userId });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch devices" });
    }
  });


module.exports = router;
