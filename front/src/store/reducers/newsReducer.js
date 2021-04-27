const { FETCH_NEWS_SUCCESS } = require("../actions/newsAction");

const initialState = {
  news: []
};

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEWS_SUCCESS:
      return { ...state, news: action.news };
    default:
      return { ...state };
  }
};

export default newsReducer;