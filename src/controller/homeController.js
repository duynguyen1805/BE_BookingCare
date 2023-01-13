import db from "../models/index";

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

    return res.render("index.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHomepage,
};
