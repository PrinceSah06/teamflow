import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"

import { Server } from "socket.io"

import userRoute from "./routes/userRoutes"
import orgRoute from "./routes/orgRoutes"
import notesRoute from "./routes/notes.routes"

import {
  errorHandler,
  notFoundHandler
} from "./middleware/errorMiddleware"

const app = express()

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://teamflow-git-main-prince-s-projects-717f0a10.vercel.app"
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())

app.use("/", userRoute)
app.use("/", orgRoute)
app.use("/", notesRoute)

app.use(notFoundHandler)
app.use(errorHandler)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: allowedOrigins
  }
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  io.emit('Welcome' ,'Welcome to teamflow')

   socket.on("join-room", (roomId) => {
  socket.join(roomId)

  console.log(`Socket joined room: ${roomId}`)
})

io.emit('message','hello to all users')
  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export  {io}
