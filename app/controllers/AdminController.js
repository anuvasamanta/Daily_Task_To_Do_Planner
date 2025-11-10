const StatusCode = require("../helper/statusCode")
class AdminController {

    async checkAuthAdmin(req, res, next) {
        try {
            if (req.admin) {
                next()
            } else {
                res.redirect('/login/user')
            }

        } catch (error) {
            console.log(error);

        }

    }

    // logout Admin
    async logoutAdmin(req, res) {
        try {
            res.clearCookie('adminToken')
            return res.status(StatusCode.CREATED).json({
                message: "Admin Logout Successfully!"
            })

        } catch (error) {
            return res.status(401).json({ message: "Internal Server Error" })
        }
    }

}


module.exports = new AdminController()