import doctorService from "../services/doctorService";

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ....'
        })
    }
}

module.exports = {
    getTopDoctor: getTopDoctor
}