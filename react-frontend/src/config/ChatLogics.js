// TO display the name of the person with whom logged in user has chatted
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderDetails = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
