const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const validator = require("validator");

const JWT_SECRET = "superkey128976";

const createToken = (userId) => {
  const payload = {
    id: userId,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const registerUser = (req, resp) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    if (!name || !email || !password)
      return resp.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return resp.status(400).json({ message: "Not a valid email" });

    // if (!validator.isStrongPassword(password))
    //     return resp.status(400).json({ message: 'Password should be strong' });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        return resp.status(500).json({
          message: "Database error",
          error: err,
        });
      }
      if (result.length > 0) {
        return resp.status(400).json({
          message: "User already exists",
        });
      }

      // Hashing the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert the new user into the database
      db.query(
        "INSERT INTO users(name, email, password) VALUES(?,?,?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            return resp.status(500).json({
              message: "Database error",
              error: err,
            });
          }

          // Get the newly created user's ID
          const userId = result.insertId;

          // Generate the JWT token with the new user's ID
          const token = createToken(userId);

          // Respond with the user information and the token
          resp.status(201).json({
            id: userId,
            name,
            email,
            token,
            message: "User Registered Successfully",
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal Server Error", error });
  }
};

const userLogin = (req, resp) => {
  try {
    const { email, password } = req.body;
    db.query("select * from users where email = ?", [email], (err, result) => {
      if (err) return resp.status(400).json({ message: "Database error" });
      if (result.length === 0)
        return resp.status(400).json({ message: "Invalid email or password" });
      else {
        const user = result[0];
        const isValidPassword = bcrypt.compare(password, user.password);
        if (!isValidPassword)
          return resp.status(400).json({ message: "Password does not match " });
        const token = createToken(user.id);
        resp.status(200).json({ id: user.id, name: user.name, email, token });
      }
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json(error);
  }
};

const findUser = (req, resp) => {
  try {
    const userId = req.params.userId;
    db.query("select * from users where id = ?", [userId], (err, result) => {
      if (err) return resp.status(400).json("Database error");
      if (result.length === 0)
        return resp.status(400).json("User do not exists");
      resp.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json(error);
  }
};

const getUser = (req, resp) => {
  try {
    db.query("select * from users", (err, result) => {
      if (err) return resp.status(400).json("Database error");
      resp.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    resp.status(400).json(error);
  }
};

const updateName = (req, resp) => {
  const userId = req.params.userId;
  const newName = req.body.name;
  const query = `update users set name="${newName}" where id=?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log("Database error", err);
      resp.status(400).json({ message: "Database error", error: err });
    } else {
      console.log("Name updated successfully");
      resp
        .status(200)
        .json({
          message: "Name updated successfully",
          response: result,
          updateName: newName,
        });
    }
  });
};

const updateMail = (req, resp) => {
  const userId = req.params.userId;
  const newMail = req.body.email;
  const query = `update users set email="${newMail}" where id=?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log("Database error", err);
      resp.status(400).json({ message: "Database error", error: err });
    } else {
      console.log("Email updated successfully");
      resp
        .status(200)
        .json({ message: "Email updated successfully", response: result });
    }
  });
};

const updatePhone = (req, resp) => {
  const userId = req.params.userId;
  const newPhone = req.body.phone;
  const query = `update users set email="${newPhone}" where id=?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log("Database error", err);
      resp.status(400).json({ message: "Database error", error: err });
    } else {
      console.log("Phone updated successfully");
      resp
        .status(200)
        .json({ message: "Phone updated successfully", response: result });
    }
  });
};

const updateDob = (req, resp) => {
  const userId = req.params.userId;
  const newDob = req.body.dob;
  const query = `update users set email="${newDob}" where id=?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log("Database error", err);
      resp.status(400).json({ message: "Database error", error: err });
    } else {
      console.log("Dob updated successfully");
      resp
        .status(200)
        .json({ message: "Dob updated successfully", response: result });
    }
  });
};


module.exports = {
  registerUser,
  userLogin,
  findUser,
  getUser,
  updateName,
  updateMail,
  updatePhone,
  updateDob,
};
