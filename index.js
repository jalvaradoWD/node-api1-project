const express = require("express");
const shortid = require("shortid");
const server = express();
const port = 3000;

const users = [];

server.get("/api/users", (req, res) => {
  res.json(users);
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.json(users.filter((user) => id === user.id)[0]);
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  const newUser = {
    id: shortid.generate(),
    name,
    bio,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

server.listen(port, () => console.log(`Server is on http://localhost:${port}`));
