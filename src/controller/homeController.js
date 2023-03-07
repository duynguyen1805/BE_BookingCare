import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomepage = async (req, res) => {
  //logic
  //let data = [];
  // connection.query("SELECT * FROM `users` ", function (err, results, fields) {
  //   // console.log("check mysql: >>> ");
  //   // console.log(results); // results contains rows returned by server
  //   results.map((row) => {
  //     data.push({
  //       id: row.id,
  //       firstName: row.firstName,
  //       lastName: row.lastName,
  //       email: row.email,
  //       address: row.address,
  //     });
  //   });

  //   //console.log("check data inside: >>>", typeof data, JSON.stringify(data)); //data type: object, -> co data
  //   //return res.render("index.ejs", { dataUser: data }); //truyen data qua "viewengine"
  // });

  //console.log("check data: >>>", typeof data, JSON.stringify(data)); //data type: object, -> khong co data
  // return res.render("index.ejs", { dataUser: JSON.stringify(data) }); //chuyen vao ben trong function co data
  try {
    let data = await db.User.findAll();

    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

let getCrudpage = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  //req.body lấy tham số client gửi lên
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("post data");
};

let displayGetCRUD =async (req, res) => {
  let data = await CRUDService.getAllUser();

  return res.render("displayCRUD.ejs", {
    datatable: data,
  });
}

let getEditCRUD = async (req, res) => {
  let userId = req.query.id; //id tren duong link
  if(userId){
    let userData = await CRUDService.getUserInfobyId(userId);
    //check userData not found
    console.log("data edit page >>>>>>>");
    console.log(userData);
    return res.render("editCRUD.ejs", {user: userData});
  }else{
    return res.send("User not found !")
  }
}

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDService.updateUserdata(data);
  
  return res.render("displayCRUD.ejs", {datatable: allUser})
}

let deleteCRUD = async (req, res) => {
  let userId = req.query.id; //id tren duong link
  if (userId) {
    let allUser = await CRUDService.deleteUserbyId(userId);
    return res.render("displayCRUD.ejs", {datatable: allUser});
  } else {
    return res.send("User not found !")
  }
}

module.exports = {
  getHomepage,
  getCrudpage,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
