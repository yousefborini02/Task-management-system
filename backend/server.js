const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userroutes");
const taskRoutes = require("./routes/taskroutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4024;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
