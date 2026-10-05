const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/event");
const auth = require("../middleware/auth");

const router = express.Router();

// Register for an event
router.post("/", auth, async (req, res) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  if (event.seats <= 0)
    return res.status(400).json({ message: "No seats available" });

  const existing = await Registration.findOne({
    user: req.user.id,
    event: eventId
  });

  if (existing)
    return res.status(400).json({ message: "Already registered" });

  const registration = await Registration.create({
    user: req.user.id,
    event: eventId
  });

  event.seats -= 1;
  await event.save();

  res.status(201).json({
    message: "Registered successfully",
    registration
  });
});
// Get my registrations
router.get("/my", auth, async (req, res) => {
  const registrations = await Registration.find({
    user: req.user.id
  }).populate("event");

  res.json(registrations);
});
module.exports = router;