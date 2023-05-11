/* eslint-disable no-return-await */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { QuestionApi } from '../../actions/questionAction';
import { dispatch } from '../store';

export const fetchForumQuestion = createAsyncThunk('question/fetchForumQuestion', async () => {
  try {
    const result = await QuestionApi.getAnsweredQuestions();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
});
export const fetchNutritionistForumQuestion = createAsyncThunk('question/fetchNutritionistForumQuestion', async () => {
  try {
    const result = await QuestionApi.getUnansweredQuestions();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
});

const initialState = {
  questions: [],
  detailQuestion: null,
  error: null,
  loading: false,
};
const questionSlice = createSlice(
  {
    name: 'question',
    initialState,
    reducers: {
      createQuestionList: (state, action) => {
        state.questions.push(action.payload);
        state.loading = false;
      },

      setDetailQuestion: (state, action) => {
        state.detailQuestion = action.payload;
        state.loading = false;
      },

      updateQuestionFromList: (state, action) => {
        state.questions = state.questions.map((item) => {
          item._id === action.payload._id ? action.payload : item;
        });
      },
      removeQuestionFromList: (state, action) => {
        state.questions = state.questions.filter((item) => item._id !== action.payload._id);
      },
      // START LOADING
      startLoading(state) {
        state.loading = true;
      },

      // HAS ERROR
      hasError(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchForumQuestion.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchForumQuestion.fulfilled, (state, action) => {
          state.questions = action.payload;
          state.loading = false;
        })
        .addCase(fetchForumQuestion.rejected, (state, action) => {
          state.error = action.error.message;
        })
        .addCase(fetchNutritionistForumQuestion.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchNutritionistForumQuestion.fulfilled, (state, action) => {
          state.questions = action.payload;
          state.loading = false;
        })
        .addCase(fetchNutritionistForumQuestion.rejected, (state, action) => {
          state.error = action.error.message;
        });
    },
  },
  { immer: true }
);

export const { createQuestionList, updateQuestionFromList, removeQuestionFromList } = questionSlice.actions;
export default questionSlice.reducer;

// ----------------------------------------------------------------------

export function createQuestion(newQ) {
  return async () => {
    dispatch(questionSlice.actions.startLoading());
    try {
      const response = await QuestionApi.createQuestion(newQ);
      // dispatch(questionSlice.actions.createQuestionList(response));
    } catch (error) {
      dispatch(questionSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getQuestionById(id) {
  return async () => {
    dispatch(questionSlice.actions.startLoading());
    try {
      const response = await QuestionApi.getQuestionById(id);
      dispatch(questionSlice.actions.setDetailQuestion(response));
    } catch (error) {
      dispatch(questionSlice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function AnswerQuestion(id, answer) {
  return async () => {
    dispatch(questionSlice.actions.startLoading());
    try {
      const response = await QuestionApi.answerQuestion(id, answer);
      dispatch(questionSlice.actions.setDetailQuestion(response));
    } catch (error) {
      dispatch(questionSlice.actions.hasError(error));
    }
  };
}
