const express = require("express");
const router = express.Router();
const userService = require("../services/userServices");

router.get("/", userService.getHomePage);

router.post("/login", userService.loginUser);

router.post("/register", userService.postAddUser);
router.get("/getstudent", userService.getStudent);
router.post("/addlesson", userService.postAddLesson);
router.post("/getlesson", userService.postGetLesson);
router.post("/getstudentbylesson", userService.postGetStudentByLesson);
router.post("/membertolesson", userService.postAddMemberToLesson);

module.exports = router;
