import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] =  useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleClick = () => (setShow(!show));

    const submitHandler = async () => {
      
      const data = {
        email: email,
        password:password
      };

      // console.log(data);

      // console.log(JSON.stringify(data));

      const resp = await fetch(`http://localhost:4000/api/user/login`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
      })

      const finalData = await resp.json();
      // console.log(finalData);
      if(resp.ok){
        localStorage.setItem("userInfo" , JSON.stringify(finalData));
        navigate('/chat');
      }
      else{
        alert("Incorrect credentials");
      }

    }

  return (
    <VStack spacing={'5px'} >
        <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
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
        // isLoading={picLoading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login;