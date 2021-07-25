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
        return u.room === room && u.userName === name
    })

    // validate user name
    if(exsistingUser){
        return {
            error:'user name exsits'
        }
    }

    // store user
    const u = { id, userName, room}
    user.push(u)
    return { user } 

}

addUser({
    id:69,
    userName:'john',
    room:'123'
})

console.log(user)

// remove user

// get user

// get user in a room