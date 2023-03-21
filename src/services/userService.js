const { resolve } = require("app-root-path")
import db from "../models/index";
import bcrypt, { hash } from "bcryptjs"; //hashpassword


const salt = bcrypt.genSaltSync(10);

let hashUserpwd = (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        let hashpassword = await bcrypt.hashSync(password, salt);
        resolve(hashpassword);
        //luu hash password trong db
      } catch (e) {
        reject(e);
      }
    });
  };


let handleUserLogin = (useremail, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userdata = {};
            let isExist = await checkUserEmail(useremail);
            if(isExist){
                //user ton tai >>> true
                //compare password
                let user = await db.User.findOne({ //get duoc alldata user
                    attributes: ["email", "roleId", "firstName", "lastName", "password"], //get data can thiet
                    where: {email: useremail},
                    raw: true
                })
                if(user){
                    let check = await bcrypt.compareSync(password, user.password); //false
                    if(check){
                        userdata.errCode = 0;
                        userdata.errMessage = "ok",
                        delete user.password,
                        userdata.user = user
                    }else{
                        userdata.errCode = 3;
                        userdata.errMessage = "Wrong password";
                    }
                }else{
                    userdata.errCode = 2;
                    userdata.errMessage = `User not found. Try again.`
                }
            }else{
                //return err
                userdata.errCode = 1;
                userdata.errMessage = `Email not found. Try again`
            } 

            resolve(userdata)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if(user){
                resolve(true) //TRUE: co user trong db
            }else{
                resolve(false) // FALSE: khong tim thay user
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if(userId === "ALL"){
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== "ALL"){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            //check email is exist ???
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    errMessage: 'Email is already in used'
                })
            }else{
                let hashPasswordfromBcrypt = await hashUserpwd(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordfromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender, //gender type boolean
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                }) //db.MODELS

                resolve({
                    errCode: 0,
                    message: "ok"
                })
            }


            // let hashPasswordfromBcrypt = await hashUserpwd(data.password);
            // await db.User.create({
            //     email: data.email,
            //     password: hashPasswordfromBcrypt,
            //     firstName: data.firstName,
            //     lastName: data.lastName,
            //     address: data.address,
            //     phonenumber: data.phonenumber,
            //     gender: data.gender === '1' ? true : false, //gender type boolean
            //     roleId: data.roleId,
            // }) //db.MODELS

            // resolve({
            //     errCode: 0,
            //     message: "ok"
            // })

        } catch (e) {
            reject(e)
        }
    })
}

let EditUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameter"
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
              })
              if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.image = data.avatar;


                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                //     phonenumber: data.phonenumber,
                // });
        
                resolve({
                    errCode: 0,
                    message: "Update user succeeds"
                });
              }else{
                reject({
                    errCode: 1,
                    errMessage: "User not found"
                });
              }
        } catch (e) {
            reject(e)
        }
    })
}

let DeleteUser = async (userId) => {
    return new Promise(async(resolve, reject) => {
        let user = await db.User.findOne({
            where: {id: userId}
        })

        if(!user){
            resolve({
                errCode: 2,
                errMessage: ` user isn't exist`
            })
        }

        await db.User.destroy({
            where: {id: userId}
        });

        resolve({
            errCode: 0,
            message: "user is delete"
        })
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                }); 
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers, getAllUsers,
    createNewUser: createNewUser,
    EditUser: EditUser,
    DeleteUser: DeleteUser,
    getAllCodeService: getAllCodeService
}