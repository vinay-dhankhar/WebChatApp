import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/contextProvider'
import { Box, Text } from "@chakra-ui/layout";
import { FormControl, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, Spacer } from '@chakra-ui/react'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
var socket , selectedChatCompare;

const SingleChat = ({fetchAgain , setFetchAgain}) => {

    const [messages , setMessages ] = useState([]);
    const [loading , setLoading] = useState(false);
    const [newMsg , setNewMsg] = useState('');
    const toast = useToast();
    const [socketConnected , setSocketConnected] = useState(false);

    const {user , selectedChat , setSelectedChat} = ChatState();

    useEffect( ()=> {
      socket = io(ENDPOINT);
      // .on creates a socket 
      // emit something from here in the setup socket;
      socket.emit("setup" , user);
      socket.on('connection' , () => {
        setSocketConnected(true);
      })
    } , []);
    
    useEffect( () => {
      socket.on('message received' , (newMessageReceived) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
          // give notification
        }
        else{
          setMessages([...messages , newMessageReceived]);
        }
      })
      // run every time state updates so remove [];
    });

    // useEffect(() => {
    //   socket.emit('disconnectUser' ,user);
    // },[user]);

    const fetchMessages = async() => {
      if(!selectedChat){
        return;
      }

      try {
        setLoading(true);
        const resp = await fetch(`http://localhost:4000/api/message/${selectedChat._id}` , {
          method:"GET",
          headers:{
            "Authorization":`Bearer ${user.token}`
          }
        });
        const respjson = await resp.json();
        const data = await respjson.data;
        setMessages(data);
        setLoading(false);

        // join the room with this is 
        socket.emit('join chat' , selectedChat._id);
        // console.log( "Data here is :" , data);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=> {
      fetchMessages();
      selectedChatCompare = selectedChat;
      // to keep a backup of messages already shared
    } , [selectedChat]);

    const sendMessage = async(event) => {
      if(event.key === "Enter" && newMsg){
        try {
          setNewMsg("");
          const resp = await fetch(`http://localhost:4000/api/message` , {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${user.token}`
            },
            body:JSON.stringify({
              content:newMsg,
              chatId:selectedChat._id
            })
          });
          // console.log(resp);
          const respjson = await resp.json();
          const data = await respjson.data;

          socket.emit('new message' , data);

          setMessages([...messages , data] )

          // console.log(data);
          // console.log(messages);
          
        } catch (error) {
          console.log(error);
          toast({
            title:"Error occurred!",
            status:"error",
            duration:5000,
            isClosable:true,
          })
        }
      }
    }

    const typingHandler = (e) => {
      setNewMsg(e.target.value)
      // console.log(newMsg);
    }

  return (
    <>
        {
            selectedChat? ( <>
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

            { !selectedChat.isGroupChat ? (
              <>
                {selectedChat.users[0]._id === user._id ? selectedChat.users[1].name : selectedChat.users[0].name}
              </>
            ) : (
              <> {selectedChat.chatName.toUpperCase()} </>
            )}
              </Text>
              <Flex
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="90%"
              borderRadius="lg"
              overflowY="hidden"
          >
            {/* Messages here */}
            {loading ? 
            (<Spinner
              size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                ml={"360px"}
                mt={"200px"}
            />) : 
            (<Flex flexDir={"column"} overflowY={"scroll"} scrollBehavior={'smooth'} style={{
              scrollbarWidth:'none'
            }} >
              <ScrollableChat messages={messages} />
            </Flex>)}

            <FormControl onKeyDown={sendMessage} isRequired mt={3} >
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder='Enter message'
                onChange={typingHandler}
                value={newMsg} />
            </FormControl>
          </Flex>
            </> ) : <p> Click on User to chat</p> 
        }
    </>
  )
}

export default SingleChat;