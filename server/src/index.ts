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
import { env } from "./env"

const app = express()

app.use(
  cors({
    origin: env.CORS_ORIGINS,
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
    origin: env.CORS_ORIGINS
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
server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})

export  {io}
