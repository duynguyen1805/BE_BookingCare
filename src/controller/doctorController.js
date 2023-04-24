import doctorService from "../services/doctorService";

let getTopDoctor = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let doctors = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ....",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllDoctorsforHomePage = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctorsforHomePage();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let postInforDoctors = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    // if(!req.query.id){
    //     return res.status(200).json({
    //         errCode: 3,
    //         errMessage: 'Missing req.query.id'
    //     })
    // }
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let infor = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let infor = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getMoreInforDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getMoreInforDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let infor = await doctorService.getListPatientForDoctor(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let confirmArrived = async (req, res) => {
  try {
    let infor = await doctorService.confirmArrived(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllSchedule = async (req, res) => {
  let id = req.query.id; //get all or id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "missing require parameters",
      users: [],
    });
  }

  let users = await doctorService.getAllSchedule(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "ok",
    users,
  });
};

let handleDeleteSchedule = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "missing require parameter",
    });
  }
  let message = await doctorService.handleDeleteSchedule(req.body.id);
  console.log(message);
  return res.status(200).json(message);
};

let handleDeleteAllSchedule = async (req, res) => {
  if (!req.body.date) {
    return res.status(200).json({
      errCode: 1,
      message: "missing require parameter",
    });
  }
  let message = await doctorService.handleDeleteAllSchedule(req.body.date);
  console.log(message);
  return res.status(200).json(message);
};

let handleDeletePatient = async (req, res) => {
  if (!req.body) {
    return res.status(200).json({
      errCode: 1,
      message: "missing require parameter",
    });
  }
  let message = await doctorService.handleDeletePatient(req.body);
  console.log(message);
  return res.status(200).json(message);
};

module.exports = {
  getTopDoctor: getTopDoctor,
  getAllDoctors: getAllDoctors,
  postInforDoctors: postInforDoctors,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getMoreInforDoctorById: getMoreInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  confirmArrived: confirmArrived,
  getAllSchedule: getAllSchedule,
  handleDeleteSchedule: handleDeleteSchedule,
  getAllDoctorsforHomePage: getAllDoctorsforHomePage,
  handleDeleteAllSchedule: handleDeleteAllSchedule,
  handleDeletePatient: handleDeletePatient,
};
