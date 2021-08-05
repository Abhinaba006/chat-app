const user = []

// add user
const addUser = ({id, userName, room})=>{
    //clean the data
    userName = userName.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!userName || !room){
        return {
            error:'User name and room name are required'
        }
    }

    // check for existing user
    const exsistingUser = user.find((u)=>{
        return u.room === room && u.userName === userName
    })

    // validate user name
    if(exsistingUser){

        // console.log('error find')
        return {
            error:'user name exsits'
        }
    }

    // store user
    const u = { id, userName, room}
    user.push(u)
    return { u } 

}

// remove user
const removeUser = (id)=>{
    const idx = user.findIndex((u)=> u.id===id)

    if(idx!==-1){
        return user.splice(idx, 1)[0]
    }
}

// get user

const getUser = (id)=>{

    const u = user.find((u)=>u.id===id)

    if(!u)
        return {error:'user not found'}

    return u
}

// get user in a room

const getUserinRoom = (room)=>{
    const res = user.filter((u)=> u.room==room)

    if(!res)    return  {error:'user not found'}

    return res

}

addUser({
    id:69,
    userName:' JOhn',
    room:'123'
})


const res = addUser({
        id:33,
        userName:'joaaaaaaaaaaaaaaaan',
        room:'123z'
    })

// console.log(res)

// const removedUser = removeUser(69)

// console.log(removedUser)
// console.log(user)

// console.log(getUser(69))

console.log(getUserinRoom('123'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserinRoom
}