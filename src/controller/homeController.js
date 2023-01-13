import multer from "multer";
import pool from "../configs/connectDB";
import connection from "../configs/connectDB";

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

  const [rows, fields] = await pool.execute("SELECT * FROM `users` "); //execute tra 2 phantu rows(mang data voi ptu la object),fields

  return res.render("index.ejs", { dataUser: rows }); //truyen data qua "viewengine"
};

let getDetailPage = async (req, res) => {
  //logic
  let id = req.params.userId; //req.params -> object --> .userId de lay data
  let [user] = await pool.execute("SELECT * FROM `users` WHERE id = ?", [id]);

  return res.send(JSON.stringify(user));
};

let createNewUser = async (req, res) => {
  console.log("check req: ", req.body);
  let { firstName, lastName, email, address } = req.body; //req.body => 1 object
  await pool.execute(
    "insert into users(firstName, lastName, email, address) values(?,?,?,?)",
    [firstName, lastName, email, address]
  );
  return res.redirect("/"); //load lai trang home
};

let deleteUser = async (req, res) => {
  console.log("check req deleteUser: ", req.body);
  let userId = req.body.userId;
  await pool.execute("delete from users where id = ?", [userId]);
  return res.redirect("/");
};

let getEditPage = async (req, res) => {
  console.log("check req editUser: ", req.params);
  let id = req.params.userId;
  const [user] = await pool.execute("select * from users where id = ?", [id]);

  return res.render("update.ejs", { dataUser: user[0] });
};

let postUpdateUser = async (req, res) => {
  console.log("check req: ", req.body);
  let { firstName, lastName, email, address, id } = req.body;
  await pool.execute(
    "update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?",
    [firstName, lastName, email, address, id]
  );

  return res.redirect("/");
};

let getUploadFilePage = async (req, res) => {
  return res.render("uploadFile.ejs");
};

//'fileupload_pic' is the name of our file input field in the HTML form
const upload = multer().single("fileupload_pic");

let handleUploadFile = async (req, res) => {
  console.log(req.file);
  upload(req, res, function (err) {
    //req.file contains information of uploaded file
    //req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return req.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return req.send(err);
    }

    //display uploaded image for user validation
    res.send(
      `you have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`
    );
  });
};

module.exports = {
  getHomepage,
  getDetailPage,
  createNewUser,
  deleteUser,
  getEditPage,
  postUpdateUser,
  getUploadFilePage,
  handleUploadFile,
};
