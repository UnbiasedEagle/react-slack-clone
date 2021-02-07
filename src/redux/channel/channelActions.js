import channelActionTypes from "./types";

export const setCurrentChannel = (channel) => {
  return {
    type: channelActionTypes.SET_CURRENT_CHANNEL,
    payload: channel,
  };
};

export const setPrivateChannel = (isPrivateChannel) => {
  return {
    type: channelActionTypes.SET_PRIVATE_CHANNEL,
    payload: isPrivateChannel,
  };
};
