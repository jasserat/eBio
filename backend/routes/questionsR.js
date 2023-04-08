const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  getQuestionsByClient,
  //searchQuestionsByTitle,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getUnansweredQuestions,
  getAnsweredQuestions,
  answerQuestion,
} = require("../services/questionS");

// Get unanswered questions for nutritionist
router.get("/unanswered", getUnansweredQuestions);

// Get all answered questions for clients
router.get("/answered", getAnsweredQuestions);

// Get all questions
router.get("/getall", getQuestions);

// Get question by ID
router.get("/:id", getQuestionById);

// Get questions by client ID
router.get("/client/:clientId", getQuestionsByClient);

// Search questions by title
//router.get("/search", searchQuestionsByTitle);

// Create question
router.post("/", createQuestion);

// Edit question
router.put("/:id", editQuestion);

// Delete question
router.delete("/:id", deleteQuestion);

// Answer a question
router.post("/:questionId/answer/", answerQuestion);

module.exports = router;
