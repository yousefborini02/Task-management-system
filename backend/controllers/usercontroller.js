const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { JWT_SECRET } = require("../config/jwtconfig");

exports.signup = async (req, res) => {
  try {
    const { username, password, first_name, last_name, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO USERS (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, EMAIL) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, hashedPassword, first_name, last_name, email]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM USERS WHERE USERNAME = $1", [
      username,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.user_id, username: user.username },
          JWT_SECRET
        );
        res.json({ token });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
