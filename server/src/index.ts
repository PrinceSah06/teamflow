import express from "express";
import cors from "cors";
import cookieParser  from 'cookie-parser'
import { db } from "./db";
import { users as usersTable } from "./db/schema";
import userRoute from "./routes/userRoutes";
const app = express();

interface registerUser{
  email:string,
  password:string
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())



app.use("/",userRoute)




const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
