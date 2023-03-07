//handleData từ Controller
import { resolve } from "app-root-path";
import bcrypt from "bcryptjs"; //hashpassword
import db from "../models/index";


const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordfromBcrypt = await hashUserpwd(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordfromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === '1' ? true : false, //gender type boolean
        roleId: data.roleId,
      }) //db.MODELS

      resolve("Tạo người dùng thành công.")

    } catch (e) {
      reject(e);
    }
  })
};

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

let getAllUser = () => {
  return new Promise(async(resolve, reject) => {
    try {
      let users = await db.User.findAll({ //trả mảng object
        raw: true,
      });//db.MODELS
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfobyId = (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      let user = await db.User.findOne({ //trả object or null
        where: {id : userId},
        raw: true,
      });
      if (user) {
        resolve(user)
      } else {
        resolve({})
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  })
}

//sequenlize update
let updateUserdata = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //id  xac dinh user
      let user = await db.User.findOne({
        where: {id: data.id},
        //raw: true
      })
      if(user){
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phonenumber;

        await user.save();

        let allUser = await db.User.findAll();
        resolve(allUser);
      }else{
        reject();
      }
    } catch (e) {
      console.log(e);
    }
  })
};

let deleteUserbyId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {id: userId},
      })
      if(user){
        await user.destroy();
        let allUser = await db.User.findAll();
        resolve(allUser);
      }else{
        reject();
      }
    } catch (e) {
      console.log(e);
    }
  })
}

module.exports = {
  createNewUser,
  hashUserpwd,
  getAllUser,
  getUserInfobyId,
  updateUserdata,
  deleteUserbyId,
};
