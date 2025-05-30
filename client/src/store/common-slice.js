// common-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/lib/axiosInstance"; // Your Axios instance

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (imageUrl) => {
    const response = await instance.post("/feature-images", {
      image: imageUrl,
    });
    return response.data;
  }
);

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const response = await instance.get("/feature-images");
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState: {
    featureImageList: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeatureImages.fulfilled, (state, action) => {
      state.featureImageList = action.payload.data || [];
    });
  },
});

export default commonSlice.reducer;
