const Question = require("../models/question");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
// Get all questions

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ebioapplication2222@gmail.com",
    pass: "lzdgsvffzhpvldlu",
  },
});

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("client")
      .populate("nutritionist");
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get questions by client ID
// get all the questions related to a specific client

exports.getQuestionsByClient = async (req, res) => {
  try {
    const questions = await Question.find({ client: req.params.clientId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Search questions by title
/*const searchQuestionsByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const questions = await Question.find({
      question: { $regex: title, $options: "i" },
    });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};*/

// Create question
exports.createQuestion = async (req, res) => {
  try {
    const { client, question, title } = req.body;
    const newQuestion = new Question({ client, question, title });
    const questionSaved = await newQuestion.save();
    const populatedQuestion = await Question.findById(
      questionSaved._id
    ).populate("client");
    res.json(populatedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Edit question
exports.editQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }
    if (question.status === "answered") {
      return res.status(400).json({ msg: "Cannot edit answered question" });
    }
    const { client, nutritionist, question: newQuestion, title } = req.body;
    question.client = client;
    question.nutritionist = nutritionist;
    question.question = newQuestion;
    question.title = title;
    await question.save();
    const populatedQuestion = await Question.findById(question._id)
      .populate("client")
      .populate("nutritionist");
    res.json(populatedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }
    if (question.status === "answered") {
      return res.status(400).json({ msg: "Cannot delete answered question" });
    }
    await question.remove();
    res.json({ msg: "Question removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get unanswered questions for nutritionist
exports.getUnansweredQuestions = async (req, res) => {
  try {
    console.log("aaaaa");
    const unansweredQuestions = await Question.find({
      status: "pending",
    }).populate("client");
    res.json(unansweredQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all answered questions for clients
exports.getAnsweredQuestions = async (req, res) => {
  try {
    console.log("bbbbbbbb");
    const answeredQuestions = await Question.find({ status: "answered" })
      .populate("client")
      .populate("nutritionist");
    res.json(answeredQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
  const { answer, nutritionist } = req.body;

  try {
    let question = await Question.findById(req.params.questionId).populate(
      "client"
    );

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    if (question.status === "answered") {
      return res.status(400).json({ msg: "Question already answered" });
    }

    question.answer = answer;
    question.status = "answered";
    question.nutritionist = nutritionist;

    await question.save();

    let populatedquestion = await Question.findById(req.params.questionId)
      .populate("client")
      .populate("nutritionist");
    sendQuestionAnswered(
      populatedquestion.client.firstName +
        " " +
        populatedquestion.client.lastName,
      populatedquestion.nutritionist.firstName +
        " " +
        populatedquestion.nutritionist.lastName,
      populatedquestion.title,
      populatedquestion.answer,
      populatedquestion.client.email,
      transporter
    );
    res.json(populatedquestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const sendQuestionAnswered = (
  clientFullName,
  nutritionistFullName,
  title,
  answer,
  email,
  transporter
) => {
  var mailOptions = {
    from: "ebioapplication2222@gmail.com",
    to: email,
    subject: "eBio! Question Answered",
    html:
      "<!DOCTYPE html>" +
      "<html><head><title>Question Answered</title>" +
      "</head><body><div>" +
      "<p>Dear Hello dear customer " +
      clientFullName +
      ",</p> <br />" +
      "<p>We are pleased to inform you that the nutritionist " +
      nutritionistFullName +
      " has answered your question</p> <br />" +
      "<p>Question : " +
      title +
      "</p> <br />" +
      "<p>Answer : " +
      answer +
      "</p> <br />" +
      "<p>Regards,</p>" +
      "<p>eBio support</p>" +
      "</div></body></html>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
