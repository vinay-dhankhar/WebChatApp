import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [show, setShow] =  useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleClick = () => (setShow(!show));

    const submitHandler = async () => {
      
      const data = {
        name:name,
        email:email,
        password:password
      };

      // console.log(data);

      // console.log(JSON.stringify(data));

      const resp = await fetch(`http://localhost:4000/api/user/signup`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
      })
      // console.log(resp);
      const finalData = await resp.json();
      // console.log(finalData);

      if(resp.ok){
        // window.location.href('/api/chat');
        localStorage.setItem("userInfo" , JSON.stringify(finalData));
        navigate('/chat');
      }
      else{
        alert("Incorrect credentials");
      }

    }

  return (
    <VStack spacing={'5px'} >
        <FormControl id="firstName" isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input placeholder='Enter Name' onChange={(e) => setName(e.target.value) } ></Input>
        </FormControl>
        <FormControl id="emailS" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="passwordS" isRequired>
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
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup;