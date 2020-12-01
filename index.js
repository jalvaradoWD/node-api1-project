const express = require("express");
const shortid = require("shortid");
const server = express();
const port = 3000;

let users = [];

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

    const userFound = users.filter((user) => id === user.id)[0];
    return userFound
      ? res.status(200).json(userFound)
      : res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
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

/**
 * @METHOD - delete
 * @DESCRIPTION - Deleting a user from the database with a givin ID.
 */

server.delete("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;

    const userFound = users.filter((user) => id === user.id)[0];

    if (userFound) {
      users = users.filter((user) => user.id !== userFound.id);

      return res
        .status(200)
        .json({ message: `User "${userFound.name}" Deleted`, user: userFound });
    } else {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "The user could not be removed." });
  }
});

server.put("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    let userFound = users.filter((user) => id === user.id)[0];

    if (userFound) {
      if (!name || !bio) {
        return res
          .status(400)
          .json({ message: "Please provide name and bio for the user." });
      }
      const updatedUserInfo = { ...userFound, name, bio };

      users = users.map((user) => {
        if (user.id === updatedUserInfo.id) {
          return updatedUserInfo;
        } else {
          return user;
        }
      });

      return res.status(200).json({ updatedUserInfo });
    } else {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});

server.listen(port, () => console.log(`Server is on http://localhost:${port}`));
