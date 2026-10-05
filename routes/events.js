const express = require("express");
const Event = require("../models/event");

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// GET event by ID
router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  res.json(event);
});

// POST create event
router.post("/", async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

// PUT update event
router.put("/:id", async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  res.json(event);
});

// DELETE event
router.delete("/:id", async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event)
    return res.status(404).json({ message: "Event not found" });

  res.json({ message: "Event deleted" });
});

module.exports = router;