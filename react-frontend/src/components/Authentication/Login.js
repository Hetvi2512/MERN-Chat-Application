import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";
function Login() {
  const history = useHistory();

  const toast = useToast();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const submitHandler = () => {
    setLoading(true);
    if (!data.email || !data.password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    axios
      .post(
        "/api/user/login",
        { data },
        {
          "Content-type": "application/json",
        }
      )
      .then((res) => {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setLoading(false);

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
        setLoading(false);
      });
  };
  return (
    <div>
      <VStack spacing="5px">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Your Email"
            value={data.email}
            onChange={handleChange}
          ></Input>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={handleChange}
              value={data.password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          colorScheme="red"
          variant="solid"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={() => {
            setData({ email: "guest@example.com", password: "123456" });
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </div>
  );
}

export default Login;
