const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get('/signup', authController.getSignup());

router.get('/signup', authController.getSignup());

router.get('/login', authController.getLogin());

router.get('/login', authController.getLogin());

router.post('/login', authController.userLogin());