const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')

const { addUser, removeUser, getUser, getUserinRoom } = require('./utils/users')
const { genMsg, genLoc } = require('./utils/messages')

const app = express()
const server = http.createServer(app) // express does this behind the secne
// new instant
const io = socketio(server) // expected to be called with raw http server, so we created our own

const port = process.env.PORT || 3000
const public_path = path.join('./public')

app.use(express.static(public_path));

// let count = 0
let msg = "Welcome"


io.on('connection', (socket) => { // socket is an obj about the connection
    console.log('new web socket connection')
    // io.emit('newMsg', msg)
    // socket.emit('countUpdated', count)  // emitingthe event || event name, arg
    // socket.on('increment', ()=>{
    //     count++
    //     // socket.emit('countUpdated', count) emitting to one socket

    //     io.emit('countUpdated', count)

    // })
    socket.on('Locmsg', (coords, callback) => {
        console.log('hi')
        io.emit('Locmsg', genLoc(`https://google.com/maps?q=${coords.lat},${coords.lon}`))
        callback()
    })

    // socket.emit, io.emit, socket.broadcast.emit -> u know these already
    //io.to.emit socket.broadcas.to.emit -> these for room

    socket.on('join', ({ userName, room }, callback) => {
        const { error, u } = addUser({ id: socket.id, userName, room })

        if (error) {
            return callback(error)
        }


        console.log(u)
        socket.join(u.room) // socket.id comes with socket, it is unique
        // console.log(room)
        socket.emit('msg', genMsg('Welcome!'))
        socket.broadcast.to(room).emit('msg', genMsg(` ${u.userName} has joined`))

        io.to(u.room).emit('roomdata', {
            room:u.room,
            user:getUserinRoom(u.room),
        })

        callback()
    })

    socket.broadcast.emit('msg', genMsg(`Welcome`))
    socket.on('newMsg', (msg, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('khisti ka k dichhis bara? ')
        }
        

        io.to(user.room).emit('msg', genMsg(msg, user.userName))
        callback() // this acknowledgement is helpful for 
        // validation like filtering offensive word
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log(user)
        if (user) {
            io.to(user.room).emit("msg", genMsg(`${user.userName} has left`))
            io.to(user.room).emit('roomdata', {
                room:user.room,
                user:getUserinRoom(user.room),
            })
        }

    })

})

server.listen(port, () => { // server instead of app
    console.log('App is live at port ' + port)
})

// created express server outside express library
// need to load client side