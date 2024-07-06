import { verifyJWT } from "../middleware/auth.middleware.js";
import { Note } from "../models/notes.models.js";
import { Router } from "express";

const useNotesRouter = Router();

useNotesRouter.route("/fetchAllNotes").get(verifyJWT, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    return res.status(201).json(notes);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
useNotesRouter.route("/addNotes").post(verifyJWT, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    if (!title || !description || !tag) {
      return res.status(400).json("Missing fields");
    }
    let note = await Note.create({
      title,
      description,
      tag,
      userId: req.user._id,
    });

    return res.json({ note });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
useNotesRouter.route("/updateNote/:id").put(verifyJWT, async (req, res) => {
  const { title, description, tag } = req.body;

  const id = req.params.id;

  const note = await Note.findByIdAndUpdate(
    id,
    { title, description, tag },
    { new: true }
  );
  if (!note) return res.status(404).send("No note with this id was found.");
  if (note.userId.toString() !== req.user._id.toString())
    return res
      .status(403)
      .send("You are not authorized to perform this action");
  res.send(note);
});
useNotesRouter.route("/deleteNote/:id").delete(verifyJWT, async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note)
    return res.status(400).send("The note with the given ID was not found.");
  if (note.userId.toString() !== req.user._id.toString())
    return res
      .status(403)
      .send("You are not authorized to perform this action");

  res.send("Deleted Successfully");
});
export default useNotesRouter;
