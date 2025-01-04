const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { sequelize, ExamTypeList } = require("../models");
const { needLoggedIn, needNotLoggedIn } = require("./middlerware");
const User = require("../models/user");
const ExamPaper = require("../models/examPaper");
const ExamPaperList = require("../models/examPaperList");
const { createHash } = require("crypto");
const router = express.Router();

router.post("/signup", needNotLoggedIn, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    const exUser = await User.findOne({ where: { email: email } });

    if (exUser) {
      return res.status(403).send("이미 사용중인 이메일 입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      nickname,
      password: hashedPassword,
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", needNotLoggedIn, async (req, res, next) => {
  try {
    // 로그인이 되었는지 확인해야함 =>passport.local
    passport.authenticate("local", (error, user, info) => {
      if (error) {
        console.error(error);
        return next(error);
      }
      if (info) {
        console.log(info);
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.status(200).json(
          await User.findOne({
            where: { id: user.id },
            attributes: ["id", "nickname", "email"],
          })
        );
      });
    })(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(404).send("에러");
  }
});

router.post("/main/createExamType", needLoggedIn, async (req, res, next) => {
  try {
    const { newTypeName } = req.body;
    const newExamType = ExamTypeList.create({
      title: newTypeName,
      UserId: req.user.id,
    });
    console.log(newExamType);
    return res.status(201).json(newExamType);
  } catch (error) {
    console.error(error);
  }
});

router.get(
  "/examPaperList/:examTypeListId",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examTypeListId } = req.params;
      const examPaper = await ExamPaperList.findAll({
        where: { ExamTypeListId: examTypeListId },
      });
      console.log(examPaper);
      return res.status(201).json(examPaper);
    } catch (error) {
      console.error(error);
      res.status(404).send("ExamTypeList를 가져오지 못 하였습니다.");
    }
  }
);

router.post(
  "/examPaperList/:examTypeListId/create/paperName",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examTypeListId } = req.params;
      const { newExamPaperName } = req.body;
      await ExamPaperList.create({
        title: newExamPaperName,
        ExamTypeListId: examTypeListId,
      }).then((response) => res.status(201).json(response));
    } catch (error) {
      console.error(error);
      res.status(401).send("시험지를 생성하지 못 하였습니다.");
    }
  }
);

router.get(
  "/examTypeList/:examTypeListId",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examTypeListId } = req.params;
      await ExamTypeList.findByPk(examTypeListId).then((response) =>
        res.status(201).json(response)
      );
    } catch (error) {
      console.error(error);
      res.status(401).send("데이터를 가져오지 못 하였습니다.");
    }
  }
);

router.get(
  "/examPaper/:examPaperListId/modify",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examPaperListId } = req.params;
      const examPaper = await ExamPaper.findAll({
        where: { ExamPaperListId: examPaperListId },
      });
      console.log(examPaper);
      return res.status(201).json(examPaper);
    } catch (error) {
      console.error(error);
      res.status(401).send("데이터를 조회할 수 없습니다.");
    }
  }
);

router.post(
  "/examPaper/:examPaperListId/create",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examPaperListId } = req.params;
      const { title, answer, choices } = req.body;
      const parsedChoices = JSON.stringify(choices);

      const examProblem = await ExamPaper.create({
        title,
        correct: answer,
        choice: parsedChoices,
        ExamPaperListId: examPaperListId,
      });
      return res.status(201).json(examProblem);
    } catch (error) {
      console.error(error);
      res.status(401).send("문제를 생성하지 못 하였습니다.");
    }
  }
);

router.put(
  "/examPaper/:examPaperListId/create",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examPaperListId } = req.params;
      const { title, answer, choices } = req.body;
      const parsedChoices = JSON.stringify(choices);

      const examProblem = await ExamPaper.update(
        {
          title,
          correct: answer,
          choice: parsedChoices,
        },
        {
          where: {
            ExamPaperListId: examPaperListId,
          },
        }
      );
      return res.status(201).json(examProblem);
    } catch (error) {
      console.error(error);
      res.status(401).send("문제를 생성하지 못 하였습니다.");
    }
  }
);

router.delete(
  "/examProblem/:problemId/delete",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { problemId } = req.params;
      await ExamPaper.destroy({ where: { id: problemId } }).then(() =>
        res.status(202).send("데이터가 삭제되었습니다.")
      );
    } catch (error) {
      console.error(error);
      res.status(401).send("데이터가 삭제되지 않았습니다.");
    }
  }
);

router.delete(
  "/examPaper/:examPaperId/delete",
  needLoggedIn,
  async (req, res, next) => {
    try {
      const { examPaperId } = req.params;
      await ExamPaperList.destroy({ where: { id: examPaperId } });
      return res.status(201).send("데이터가 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      res.status(401).send("데이터가 삭제되지 않았습니다.");
    }
  }
);

router.get("/user", (req, res, next) => {
  return res.json(req.user || false);
});

router.post("/user/logout", needLoggedIn, (req, res, next) => {
  req.logout(() => {
    res.send("logout");
  });
});

module.exports = router;
