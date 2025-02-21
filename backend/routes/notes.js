const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");

// ROUTE 1: fetch all notes using GET "/api/notes", doesn't require authentication

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server error" });
  }
});

// ROUTE 2: add notes using POST "/api/notes", doesn't require authentication

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body(
      "description",
      "Password must have a minimum of 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savednotes = await notes.save();

      res.json(savednotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Server error" });
    }
  }
);
// ROUTE 3: update notes using PUT  "/api/notes", doesn't require authentication

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  // craete new note
  const newnote = {};
  if (title) {
    newnote.title = title;
  }
  if (description) {
    newnote.description = description;
  }
  if (tag) {
    newnote.tag = tag;
  }

  // find the note to be updated and update it

  let note = await Notes.findById(req.params.id);
  if (!note) return res.status(404).send("not found");

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newnote },
    { new: true }
  );
  res.json(note);
});

// ROUTE 4: delete notes using DELETE "/api/notes", doesn't require authentication

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  // find the note to be updated and update it

  let note = await Notes.findById(req.params.id);
  if (!note) return res.status(404).send("not found");

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ success: "note has been deletedd", note: note });
});

module.exports = router;
