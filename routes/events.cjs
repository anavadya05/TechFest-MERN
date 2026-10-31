const express = require("express");
const Event = require("../models/event.cjs");

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
  try {
    const { name, category, fee, seats, date } = req.body;

    // Validate required fields
    if (!name || !category || !date) {
      return res.status(400).json({
        message: "Name, category and date are required"
      });
    }

    // Validate numeric fields
    if (
      (fee !== undefined && (typeof fee !== "number" || fee < 0)) ||
      (seats !== undefined && (!Number.isInteger(seats) || seats < 0))
    ) {
      return res.status(400).json({
        message: "Invalid fee or seats value"
      });
    }

    // Validate date
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        message: "Invalid date"
      });
    }

    const event = await Event.create({
      name,
      category,
      fee,
      seats,
      date
    });

    res.status(201).json(event);

  } catch (error) {
    console.error("Create event error:", error.message);
    res.status(500).json({ message: "Unable to create event" });
  }
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