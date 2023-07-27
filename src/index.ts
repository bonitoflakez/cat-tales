import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes";

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
