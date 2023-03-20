import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initialState = {
  username: null,
  messages: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_USERNAME":
      return { ...state, username: action.username };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk));
export default store;
