const express = require('express')
const http = require('http')
const path = require('path')
let app = express()
let server = http.createServer(app)
const io = require('socket.io')(server)

let port = process.env.PORT || 3030
server.listen(port, function () {
  console.log('Server is listen on ' + port)
})

app.use(express.static(path.join(__dirname, 'public')))

let usersCount = 0
let users = []
io.on('connection', socket => {
  let addedUser = false

  socket.on('message', data => {
    console.log('message')
    socket.broadcast.emit('message', {
      username: socket.username,
      message: data
    })
  })

  socket.on('login', username => {
    console.log('login')
    if (addedUser) return
    // socket.emit('clients', {
    //   clients: io.sockets.clients()
    // })
    socket.username = username
    ++usersCount
    addedUser = true
    users.push(username)
    socket.emit('makeLogin', {
      users: users,
      usersCount: usersCount
    })

    socket.broadcast.emit('userJoined', {
      username: socket.username,
      usersCount: usersCount
    })

    socket.on('disconnect', () => {
      if (addedUser) {
        --usersCount
        users.splice(users.indexOf(socket.username), 1)
        socket.broadcast.emit('userLeft', {
          username: socket.username,
          usersCount: usersCount
        })
      }
    })
  })
})
