const express = require('express')
const http = require('http')
const path = require('path')
const chalk = require('chalk')
let app = express()

let server = http.createServer(app)
const io = require('socket.io', {origins: 'mglrtc2.herokuapp.com:* https://mglrtc2.herokuapp.com:* https://www.mglrtc2.herokuapp.com/:*'})(server)
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
    console.log(`sending message to ${data.to} of type ${data.action}`)
    data.from = socket.id
    socket.to(data.to).emit('message', data)
  })

  socket.on('dataChannelOpened', () => {
    socket.emit('dataChannelOpen')
    socket.broadcast.emit('dataChannelOpen')
  })

  socket.on('login', user => {
    console.log('login')
    if (addedUser) return
    // socket.emit('clients', {
    //   clients: io.sockets.clients()
    // })
    ++usersCount
    addedUser = true
    users.push({id: socket.id})
    socket.broadcast.emit('loginPlayer', {
      new: true,
      x: user.x,
      y: user.y,
      id: socket.id,
      users
    })
    socket.emit('loginPlayer', {
      id: socket.id,
      users
    })

    socket.emit('makeLogin', {
      id: socket.id,
      users: users,
      usersCount: usersCount
    })

    socket.broadcast.emit('userJoined', {
      id: socket.id,
      usersCount: usersCount
    })

    socket.on('disconnect', () => {
      if (addedUser) {
        --usersCount
        users.splice(users.indexOf(socket.id), 1)
        socket.broadcast.emit('userLeft', {
          usersCount: usersCount
        })
      }
    })
  })
})
