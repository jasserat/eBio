import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CxpApi } from '../../actions/cxpAction';


export const fetchUsersList = createAsyncThunk('cxpForm/listForms', async () => {
  const result = await CxpApi.getCxp();
  return result;
});




const cxpSlice = createSlice({
  name: "reviews",
  initialState: { reviews: [] }
  ,

  reducers: {

    fetchReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      const { note, userId, data } = action.payload
      state.reviews.push({
        note,
        userId,
        data
      })
    }, deleteReview: (state, action) => {
      const { reviewId } = action.payload;
      const index = state.reviews.findIndex((review) => review._id === reviewId);
      if (index !== -1) {
        state.reviews.splice(index, 1);
      }
      


    }
  }
});

export const { fetchReviews, addReview,deleteReview } = cxpSlice.actions;

export default cxpSlice.reducer;