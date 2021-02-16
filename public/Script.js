/** @format */

const socket = io()
const chatForm = document.getElementById("chat-form")
const chatInput = document.getElementById("chat-input")
const userForm = document.getElementById("user-form")
const userInput = document.getElementById("user-input")
const validate = document.getElementById("validate")

chatForm.addEventListener("submit", function (e) {
	e.preventDefault()
	if (chatInput.value) {
		socket.emit("send message", chatInput.value)
		chatInput.value = ""
	}
})

chatInput.addEventListener("focusin", () => {
	socket.emit("new type")
})
chatInput.addEventListener("focusout", () => {
	socket.emit("stop type")
})

userForm.addEventListener("submit", function (e) {
	e.preventDefault()
	if (userInput.value) {
		socket.emit("new user", userInput.value)
		userInput.value = ""
		socket.on("user exists", (data) => {
			validate.style.display = "block"
			validate.textContent = "the username " + data + " has already been used"
		})
		socket.on("user added", () => {
			document.getElementById("user-div").style.display = "none"
			document.getElementById("chat-container").style.display = "flex"
		})
	}
})

socket.on("new message", function (data) {
	const item = document.createElement("li")
	const text = document.createElement("h4")
	id = data.id
	text.textContent =
		id === socket.id
			? data.message
			: data.username.toUpperCase() + ": " + data.message
	text.style.maxWidth = "50%"
	text.style.display = "flex"
	text.style.justifyContent = id === socket.id ? "flex-end" : ""
	text.style.padding = "5px"
	text.style.borderRadius = "5px"
	item.append(text)
	text.style.background =
		"linear-gradient(250deg, rgb(99, 22, 22), rgb(148, 107, 168))"
	text.style.color = "#fff"
	item.style.justifyContent = id === socket.id ? "flex-end" : ""
	messages.append(item)
	const typing = document.getElementById("typing")
	typing.remove()
	window.scrollTo(0, document.body.scrollHeight)
})

socket.on("typing", (data) => {
	const text = document.createElement("h6")
	text.setAttribute("id", "typing")
	text.style.fontSize = "12px"
	text.style.fontStyle = "italic"
	text.textContent = data + " is typing"
	messages.appendChild(text)
})
socket.on("stopped typing", (data) => {
	const text = document.getElementById("typing")
	text.remove()
})
