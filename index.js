const express = require("express");
const shortid = require("shortid");
const server = express();
const port = 3000;

const users = [];

server.use(express.json());

/**
 * @METHOD - get
 * @DESCRIPTION - Receiving all users from the server.
 */
server.get("/api/users", (req, res) => {
  res.json(users);
});

/**
 * @METHOD - get
 * @DESCRIPTION - Receiving the information of a specific user given the id of the user.
 */
server.get("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json(users.filter((user) => id === user.id)[0]);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The user with the specified ID does not exist." });
  }
});

/**
 * @METHOD - post
 * @DESCRIPTION - Creating use providing the information of the a name and a bio.
 */
server.post("/api/users", (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database.",
    });
  }
});

server.listen(port, () => console.log(`Server is on http://localhost:${port}`));
