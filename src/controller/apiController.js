import pool from "../configs/connectDB";

let getAllUser = async (req, res) => {
  //http status
  //200 404 501
  // chuan json(object)
  const [rows, fields] = await pool.execute("SELECT * FROM `users` ");
  //execute tra 2 phantu rows(mang data voi ptu la object),fields
  return res.status(200).json({
    message: "ok",
    data: rows,
  });
};

let createNewUser = async (req, res) => {
  let { firstName, lastName, email, address } = req.body; //req.body => 1 object
  if (!firstName || !lastName || !email || !address) {
    return res.status(200).json({
      message: "missing req params",
    });
  }

  await pool.execute(
    "insert into users(firstName, lastName, email, address) values(?,?,?,?)",
    [firstName, lastName, email, address]
  );

  return res.status(200).json({
    message: "ok",
  });
};

let updateUser = async (req, res) => {
  let { firstName, lastName, email, address, id } = req.body;
  if (!firstName || !lastName || !email || !address || !id) {
    return res.status(200).json({
      message: "missing req params",
    });
  }
  await pool.execute(
    "update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?",
    [firstName, lastName, email, address, id]
  );

  return res.status(200).json({
    message: "ok",
  });
};

let deleteUser = async (req, res) => {
  let userId = req.params.id;
  if (!userId) {
    return res.status(200).json({
      message: "missing req params",
    });
  }
  await pool.execute("delete from users where id = ?", [userId]);

  return res.status(200).json({
    message: "ok",
  });
};

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};
