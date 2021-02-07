import { combineReducers } from "redux";
import { channelReducer } from "./channel/channelReducers";
import { userReducer } from "./user/userReducers";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
});

export default rootReducer;
