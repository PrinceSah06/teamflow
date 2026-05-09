import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes";
import orgRoute from "./routes/orgRoutes";
import notesRoute from "./routes/notes.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoute);
app.use("/", orgRoute);
app.use("/", notesRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
