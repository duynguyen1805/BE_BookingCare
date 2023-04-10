import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: {
          roleId: "R2",
        },
        order: [["createdAt" /*, "DESC" */]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEN", "valueVI"],
          },
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEN", "valueVI"],
          },
          {
            model: db.Doctor_Infor,
            attributes: {
              exclude: ["id"],
            },
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
        // include: [
        //   {
        //     model: db.Doctor_Infor,
        //     attributes: {
        //       exclude: ["id"],
        //     },
        //     include: [
        //       {
        //         model: db.Specialty,
        //         as: "specialtyData",
        //         attributes: ["name"],
        //       },
        //     ],
        //   },
        // ],
      });
      return resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctorsforHomePage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
        include: [
          {
            model: db.Doctor_Infor,
            attributes: {
              exclude: ["id"],
            },
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
            ],
          },
        ],
      });
      return resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// let checkRequiredFields = (inputData) => {
//     let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice',
//         'note', 'specialtyId' ]

//     let isValid = true;
//     let element = '';
//     for(let i=0 ; i < arrFields.length; i++){
//         if(!inputData[arrFields[i]]){
//             isValid = false;
//             element =  arrFields[i];
//             break;
//         }
//     }

//     return{
//         isValid: isValid,
//         element: element,
//     }
// }

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.note ||
        !inputData.selectedSpecialty
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        //update-insert table markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updateAt = new Date();

            await doctorMarkdown.save();
          }
        }

        //update-insert table doctor_infor
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.selectedSpecialty;
          doctorInfor.clinicId = inputData.selectedClinic;

          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            addressClinic: inputData.addressClinic,
            nameClinic: inputData.nameClinic,
            note: inputData.note,
            specialtyId: inputData.selectedSpecialty,
            clinicId: inputData.selectedClinic,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: id,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },

            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEN", "valueVI"],
            },

            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEN", "valueVI"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEN", "valueVI"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEN", "valueVI"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resovle({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item, index) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        // console.log("check maxNumber:", schedule);

        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        // console.log("check schedule create: ", schedule); //send int
        // console.log("check existing: ", existing); //db >>> String
        // >>> format schedule ben REACT

        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //console.log("check toCreate: ", toCreate);

        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resovle({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!doctorId || !date) {
        resovle({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEN", "valueVI"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!dataSchedule) dataSchedule = [];

        resovle({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getMoreInforDoctorById = (doctorId) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!doctorId) {
        resovle({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEN", "valueVI"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEN", "valueVI"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEN", "valueVI"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = [];

        resovle({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!doctorId) {
        resovle({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEN", "valueVI"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEN", "valueVI"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEN", "valueVI"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEN", "valueVI"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = [];

        resovle({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resovle, reject) => {
    try {
      if (!doctorId || !date) {
        resovle({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataSchedule = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEN", "valueVI"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEN", "valueVI"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!dataSchedule) dataSchedule = [];

        resovle({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let confirmArrived = (data) => {
  return new Promise(async (resolve, reject) => {
    if (
      !data.email ||
      !data.doctorId ||
      !data.patientId ||
      !data.timeType ||
      !data.imgBase64
    ) {
      resolve({
        errCode: 1,
        errMessage: "Missing required parameters",
      });
    } else {
      let appointment = await db.Booking.findOne({
        where: {
          doctorId: data.doctorId,
          patientId: data.patientId,
          timeType: data.timeType,
          statusId: "S2",
        },
        raw: false,
      });

      if (appointment) {
        await db.Booking.destroy({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
        });
      }

      if (appointment) {
        await db.History.create({
          doctorId: data.doctorId,
          patientId: data.patientId,
          fullname: data.fullname,
          phonenumber: data.phonenumber,
          address: data.address,
          gender: data.gender,
          reason: data.reason,
          statusId: "S3",
        });
      }

      await emailService.sentAttachment(data);

      resolve({
        errCode: 0,
        errMessage: "Ok",
      });
    }
  });
};

let getAllSchedule = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = db.Schedule.findAll({
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEN", "valueVI"],
            },
          ],
          order: [
            ["date", "ASC"],
            ["timeType", "ASC"],
          ],
          raw: false,
          nest: true,
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.Schedule.findAll({
          where: { doctorId: userId },
          order: [
            ["date", "ASC"],
            ["timeType", "ASC"],
          ],
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEN", "valueVI"],
            },
          ],

          raw: false,
          nest: true,
        });
      }

      if (!users) users = {};
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let handleDeleteSchedule = async (userId) => {
  return new Promise(async (resolve, reject) => {
    let schedule = await db.Schedule.findOne({
      where: { id: userId },
    });

    if (!schedule) {
      resolve({
        errCode: 2,
        errMessage: ` schedule isn't exist`,
      });
    }

    await db.Schedule.destroy({
      where: { id: userId },
    });

    resolve({
      errCode: 0,
      message: "schedule is delete",
    });
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
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
};
