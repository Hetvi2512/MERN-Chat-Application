import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  Input,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { Box, Text } from "@chakra-ui/layout";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./Modals/ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "./Users/UserListItem";

function SideDrawer() {
  const history = useHistory();
  const toast = useToast();
  //const { setUser } = ChatState();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Searching for a person
  const handleSearch = () => {
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      axios
        .get(`/api/user?search=${search}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setSearchResult(response.data);
        });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Something went wrong",
        description: "Failed to load the search results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  //After searching on click it will create chat with that person if it does not exists
  const accessChat = (id) => {
    try {
      setLoadingChat(true);
      axios
        .post(
          "/api/chat",
          { userId: id },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          if (!chats.find((c) => c._id === response.data._id)) {
            //If the chat with that person is new then we add to chats list
            setChats([response.data, ...chats]);
          }
          setLoadingChat(false);
          setSelectedChat(response.data);
          onClose();
        });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to load the chat",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    //  setUser();
    history.push("/");
  };
  return (
    <>
      {/* Header */}
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Tiny Talks
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* The Drawer with search box */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box d="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <>
                  <ChatLoading />
                </>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default SideDrawer;
