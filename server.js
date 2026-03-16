import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Register API
app.post("/api/register", (req, res) => {
  const data = req.body;

  console.log(data);

  res.json({
    message: "User registered successfully",
    data: data
  });
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
