import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
function ScrollableChat({ messages }) {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages?.map((message, index) => (
        <div style={{ display: "flex" }} key={message._id}>
          {(isSameSender(messages, message, index, user._id) ||
            isLastMessage(messages, index, user._id)) && (
            <Tooltip
              label={message.sender.name}
              placement="bottom-start"
              hasArrow
            >
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={message.sender.name}
                src={message.sender.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: isSameSenderMargin(
                messages,
                message,
                index,
                user._id
              ),
              marginTop: isSameUser(messages, message, index, user._id)
                ? 3
                : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
