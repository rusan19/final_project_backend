const User = require("../models/user");
const Lesson = require("../models/lesson");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const saltRounds = 10;

exports.loginUser = (req, res) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) {
      res.status(500).send(error);
    } else {
      if (!user) {
        res.status(404).send("Kullanici bulunamadi.");
      } else {
        // const isValid = bcrypt.compare(req.body.password, user.password);
        if (req.body.password === user.password) {
          const secretKey = "5596f5fhgjg6";
          const token = jwt.sign(
            { id: user._id, email: user.email, status: user.status },
            secretKey
          );
          res.status(200).json({ token, user });
        } else {
          res.status(401).send("Şifre hatali");
        }
      }
    }
  });
};

exports.getHomePage = (req, res, next) => {
  res.send("Home Page");
};
exports.postAddUser = (req, res, next) => {
  User.findOne({ number: req.body.number }, (err, user) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (user) {
      res.status(409).json({ error: "Kullanici kayitli" });
    } else {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
          res.status(500).json({ error: err });
        } else if (user) {
          res.status(409).json({ error: "e-mail zaten kayitli" });
        } else {
          if (req.body.number) {
            req.body.status = "öğrenci";
          } else {
            req.body.status = "akademisyen";
            let randomNumber = Math.floor(Math.random() * 1000000);
            req.body.number = randomNumber;
          }
          const newUser = new User(req.body);
          newUser.save((error) => {
            if (error) {
              res.status(500).json({ error });
            } else {
              res.status(201).json({ message: "Kullanici basariyla eklendi" });
            }
          });
        }
      });
    }
  });
};

exports.postAddLesson = async (req, res, next) => {
  try {
    const newLesson = new Lesson({
      name: req.body.name,
      code: req.body.code,
      owner: req.body.userId,
    });
    await newLesson.save();
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.postAddMemberToLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({ code: req.body.code });
    if (!lesson) throw new Error("Ders bulunamadi");
    const user = await User.findOne({ number: req.body.number }).lean();
    if (!user) throw new Error("Öğrenci Bulunamadı");
    const isExist = await Lesson.findOne({
      code: req.body.code,
      student: user._id,
    }).lean();
    if (isExist) throw new Error("Öğrenci zaten kayıtlı");
    const newLesson = new Lesson({
      name: lesson.name,
      code: req.body.code,
      student: user._id,
    });
    await newLesson.save();

    return res.send("Derse öğrenci eklendi");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
exports.postGetLesson = async (req, res, next) => {
  const user = await User.findById(req.body.userId).lean();
  try {
    let lessons = [];
    if (user.status === "akademisyen") {
      lessons = await Lesson.find({ owner: req.body.userId }).lean();
    } else {
      lessons = await Lesson.find({ student: req.body.userId }).lean();
    }

    return res.send(lessons);
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.getStudent = async () => {
  const getStudents = async () => {
    try {
      const students = await User.find({ status: "öğrenci" });
      return students;
    } catch (error) {
      console.error("Kullanıcıları çekerken bir hata oluştu:", error);
      throw error;
    }
  };
  getStudents()
    .then((students) => {
      console.log("Öğrenciler:", students);
    })
    .catch((error) => {
      console.error("İşlem sırasında bir hata oluştu:", error);
    });
};
exports.postGetStudentByLesson = async (req, res) => {
  try {
    const { code } = req.body;

    const lessons = await Lesson.find({ code });

    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ error: "Ders bulunamadı" });
    }

    const studentIds = lessons.map((lesson) => lesson.student);

    const students = await User.find({ _id: { $in: studentIds } });

    res.json({ students });
  } catch (error) {
    console.error("Öğrencileri çekerken bir hata oluştu:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
