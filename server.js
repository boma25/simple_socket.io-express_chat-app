/** @format */

const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
require("dotenv").config()

app.use(express.static("public"))

port = process.env.PORT || 3000
const users = []
io.on("connection", (socket) => {
	socket.on("send message", (data) => {
		io.sockets.emit("new message", {
			message: data,
			username: socket.username,
			id: socket.id,
		})
	})
	socket.on("new user", (data) => {
		if (users.includes(data)) {
			io.sockets.emit("user exists", data)
		} else {
			socket.username = data
			users.push(data)
			io.sockets.emit("user added")
		}
	})
	socket.on("new type", () => {
		socket.broadcast.emit("typing", socket.username)
	})
	socket.on("stop type", () => {
		socket.broadcast.emit("stopped typing")
	})
	socket.on("disconnect", () => {
		if (users.length > -1) {
			const index = users.indexOf(socket.username)
			users.splice(index, 1)
		}
	})
})

http.listen(port, () => {
	console.log(`listening on *:${port}`)
})
