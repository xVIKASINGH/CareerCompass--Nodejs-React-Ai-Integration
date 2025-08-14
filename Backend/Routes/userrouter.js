const Router = require("router");
const { registeruser, login } = require("../Controllers/Authentication");

const router = Router();

router.get("/", (req, res) => {
    res.end("<h1>Welcome to the User Dashboard</h1>");
});

router.post("/register", registeruser); 
router.post("/login", login); 

module.exports = router;
