import { IconButton } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import "./styles.css";
import React, { useEffect, useState } from "react";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./Modals/ProfileModal";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, setSelectedChat, selectedChat } = ChatState();
  useEffect(() => {
    fetchMessage();
  }, [selectedChat]);

  const fetchMessage = () => {
    if (!selectedChat) return;

    setLoading(true);
    axios
      .get(`/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMessages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error Occured !",
          description: "Failed to load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const sendMessage = (event) => {
    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      axios
        .post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);

          setMessages([...messages, response.data]);
        })
        .catch((error) => {
          console.log("error", error);
          toast({
            title: "Error Occured !",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
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
                  fetchMessage={fetchMessage}
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
            {loading ? (
              <>
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              </>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />{" "}
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
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
