const Question = require("../models/question");
const mongoose = require("mongoose");
// Get all questions
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
    const question = await Question.findById(req.params.id);
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
    const { client, nutritionist, question } = req.body;
    const newQuestion = new Question({ client, nutritionist, question });
    const questionSaved = await newQuestion.save();
    res.json(questionSaved);
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
    const { client, nutritionist, question: newQuestion } = req.body;
    question.client = client;
    question.nutritionist = nutritionist;
    question.question = newQuestion;
    await question.save();
    res.json(question);
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
    const answeredQuestions = await Question.find({ status: "answered" });
    res.json(answeredQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
  const { answer } = req.body;

  try {
    let question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    if (question.status === "answered") {
      return res.status(400).json({ msg: "Question already answered" });
    }

    question.answer = answer;
    question.status = "answered";

    await question.save();

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
