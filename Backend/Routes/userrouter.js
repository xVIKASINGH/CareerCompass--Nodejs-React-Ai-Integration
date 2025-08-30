const Router = require("router");
const { registeruser, login, isLoggedIn, logout } = require("../Controllers/Authentication");
const verifyToken=require("../Middlewares/VerifyToken");
const router = Router();

router.get("/", (req, res) => {
    res.end("<h1>Welcome to the User Dashboard</h1>");
});

router.post("/register", registeruser); 
router.post("/login", login); 
router.get("/auth",verifyToken,isLoggedIn);
router.get("/logout",verifyToken,logout);
module.exports = router;
