import React, { useState, useEffect } from "react";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
function ChatPage() {
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, [setUser]);

  return (
    <div style={{ width: "100%" }}>
      {/* Side Drawer for searching */}
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        padding="10px"
      >
        {/* MyChats where list of all the chats is shown*/}
        {user && <MyChats fetchAgain={fetchAgain} />}

        {/* ChatBox where the chat with selected person is shown */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
