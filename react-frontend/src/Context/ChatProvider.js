import { createContext, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState();

  //State to maintain selected chat out of the list chats
  const [selectedChat, setSelectedChat] = useState();

  //List of chats (Includes all the users and group chats)
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("USER IN CONTEXT", userInfo);
    setUser(userInfo);
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
