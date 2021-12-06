import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../Users/UserBadgeItem";
import axios from "axios";
import UserListItem from "../Users/UserListItem";
function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();
  const handleAddUser = (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log(selectedChat.groupAdmin._id);
    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("INSIDE");
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    axios
      .put(
        "/api/chat/personadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
    setGroupChatName("");
  };
  const handleDelete = (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    axios
      .put(
        "/api/chat/removeperson",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        user1._id === user._id
          ? setSelectedChat()
          : setSelectedChat(response.data);

        setFetchAgain(!fetchAgain);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
  };
  const handleSearch = (query) => {
    if (!query) {
      return;
    }
    try {
      setSearch(query);
      setLoading(true);
      axios
        .get(`/api/user?search=${search}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          console.log(response.data);
          setSearchResult(response.data);
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleRename = () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    axios
      .put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      });
    setGroupChatName("");
  };
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handleDelete(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
