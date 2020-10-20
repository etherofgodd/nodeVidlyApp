const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { Genre, validationSchema } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.status(200).send(genres);
  })
);

router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send("Genres with the given ID was not found");

    res.status(200).send(genre);
  })
);

router.put(
  "/:id",
  validateObjectId,
  auth,

  asyncMiddleware(async (req, res) => {
    const { error } = validationSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!genre)
      return res.status(404).send("Genres with the given ID was not found");

    res.send(genre);
  })
);

router.delete(
  "/:id",
  validateObjectId,
  auth,

  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
      return res.status(404).send("Genres with the given ID was not found");

    res.send(genre);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validationSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
      name: req.body.name,
    });

    genre = await genre.save();

    res.send(genre);
  })
);

module.exports = router;
