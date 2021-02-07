import channelActionTypes from "./types";

const INITIAL_STATE = {
  currentChannel: null,
  isPrivateChannel: false,
};

export const channelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case channelActionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case channelActionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload,
      };
    default:
      return state;
  }
};
