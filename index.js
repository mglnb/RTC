const express = require('express')
const http = require('http')
const path = require('path')
const os = require('os')
const fs = require('fs')
const chalk = require('chalk')
let app = express()
// let options = {
//   key: fs.readFileSync('./key.pem'), 
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: '91533266'
// }
let server = http.createServer(app)
const io = require('socket.io')(server)
let ip = os.networkInterfaces()['Ethernet'][1].address
let port = process.env.PORT || 3030
server.listen(port, ip, function () {
  console.log('Server is listen on ' + port)
})

app.use(express.static(path.join(__dirname, 'public')))

let usersCount = 0
let users = []

io.on('connection', socket => {
  let addedUser = false
  socket.on('ping', function () {
    socket.emit('pong')
  })

  socket.on('message', data => {
    console.log('message')
    socket.broadcast.emit('message', {
      username: socket.username,
      message: data
    })
  })
  socket.on('messageRtc', data => {
    console.log(chalk.red('messageRtc', JSON.stringify(data.username)))
    console.log(chalk.yellow('messageRtc', JSON.stringify(data.caller)))
    socket.to(data.username).emit('messageRtcClient', data)
    socket.to(data.caller).emit('messageRtcClient', data)
  })
  socket.on('new-ice-candidate', data => {
    console.log(chalk.blue('new-ice-candidate', JSON.stringify(data.username)))
    console.log(chalk.green('new-ice-candidate', JSON.stringify(data.caller)))
    socket.to(data.username).emit('new-ice-candidate-client', data)
    socket.to(data.caller).emit('new-ice-candidate-client', data)
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
    users.push({ id: socket.id, username: username })
    socket.emit('makeLogin', {
      id: socket.id,
      user: socket.username,
      users: users,
      usersCount: usersCount
    })

    socket.broadcast.emit('userJoined', {
      id: socket.id,
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
