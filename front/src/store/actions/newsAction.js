import axiosApi from "../../axiosApi";

export const FETCH_NEWS_SUCCESS = "FETCH_NEWS_SUCCESS";
export const CREATE_NEWS_SUCCESS = "CREATE_NEWS_SUCCESS";
export const FETCH_STATUS_SUCCESS = "FETCH_STATUS_SUCCESS";

export const fetchNewsSuccess = (news) => {
    return { type: FETCH_NEWS_SUCCESS, news };
};
export const createNewsItemSuccess = (newsItem) => {
    return { type: FETCH_NEWS_SUCCESS, newsItem };
};
export const fetchStatusSuccess = (newsItem) => {
  return { type: FETCH_STATUS_SUCCESS, newsItem }
};

export const fetchNews = () => {
    return async (dispatch) => {
      try {
        const response = await axiosApi.get("/news");
        dispatch(fetchNewsSuccess(response.data));
      } catch (e) {
        console.error(e);
      }
    };
  };
export const createNewsItem = (newsItem) => {
    return async (dispatch) => {
      try {
        await axiosApi.post("/news", newsItem);
      } catch (e) {
        console.error(e);
      }
    };
};
export const fetchChangeStatus = (id, status) => {
  return async dispatch => {
    try {
      const response = await axiosApi.get('/news/' + id + '/' + status);
      dispatch(fetchStatusSuccess(response.data));
    } catch (e) {
      console.error(e);
    }
  }
}