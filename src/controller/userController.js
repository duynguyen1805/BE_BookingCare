import userService from "../services/userService"



let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: "Missing input"
        })
    }

    let userdata = await userService.handleUserLogin(email, password)
    console.log(userdata);
    //check email exist
    //compare password
    //return userInfor
    //accept_token: validate user: JWT: json web token
    return res.status(200).json({
        errCode: userdata.errCode,
        message: userdata.errMessage,
        user: userdata.user ? userdata.user : {}
    })


}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //get all or id

    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: "missing require parameters",
            users: []
        })
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.EditUser(data);
  
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            message: "missing require parameter",
        })
    }
    let message = await userService.DeleteUser(req.body.id);
    console.log(message);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        let data = await  userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log("Get allcode error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error connection"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode
}