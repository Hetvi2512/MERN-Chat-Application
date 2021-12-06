import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";

function SignUp() {
  const history = useHistory();
  const toast = useToast();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    pic: "",
  });

  const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);
  const postImage = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const img = new FormData();
      img.append("file", pics);
      img.append("upload_preset", "chat-app");
      img.append("cloud_name", "dpjziuhh8");
      fetch("https://api.cloudinary.com/v1_1/dpjziuhh8/image/upload", {
        method: "post",
        body: img,
      })
        .then((res) => res.json())
        .then((datas) => {
          setData({ ...data, pic: datas.url.toString() });
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  const submitHandler = () => {
    setPicLoading(true);
    if (!data.name || !data.email || !data.password || !data.confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (data.password !== data.confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    axios
      .post(
        "/api/user/register",
        { data },
        {
          "Content-type": "application/json",
        }
      )
      .then((res) => {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setPicLoading(false);
        setData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
          pic: "",
        });
        history.push("/chats");
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
      });
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  return (
    <VStack spacing="15px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter Your Name" onChange={handleChange}></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter Your Email" onChange={handleChange}></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postImage(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
