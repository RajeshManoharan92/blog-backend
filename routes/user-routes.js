const express = require("express") ;
const { getAllUser, login, signup, getuserid, setnewpassword, emailverification } = require("../controllers/user-controller") ;

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/userid", getuserid);
router.post("/setnewpassword", setnewpassword)
router.post("/verification", emailverification)

module.exports = router;