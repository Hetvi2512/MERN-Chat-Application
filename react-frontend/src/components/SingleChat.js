import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import React from "react";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./Modals/ProfileModal";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModal";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, setSelectedChat, selectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {" "}
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            Messages
          </Box>
        </>
      ) : (
        <>
          <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
}

export default SingleChat;
