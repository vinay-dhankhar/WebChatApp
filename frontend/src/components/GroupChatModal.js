import {  Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../context/contextProvider';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({children}) => {
    const [groupChatName , setGroupChatName] = useState("");
    const [selectedUsers , setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure()


    const handleSearch = async (query) => {
        setSearch(query);
        if(!query){
            return;
        }

        try{
            setLoading(true);

            const res = await fetch(`http://localhost:4000/api/user/searchUser?search=${search}` , {
                method:"GET",
                headers:{
                    "Authorization": `Bearer ${user.token}`,
                }
            } )

            const resp = await res.json();
            // console.log(resp);
            setLoading(false);
            setSearchResult(resp.data);
        }
        catch(err){
            console.log(err);
            toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
        }
    }

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
          toast({
            title: "Please Enter all details",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
          });
          return;
        }

        try {
          const dataToSend = {
            name : groupChatName,
            users: JSON.stringify(selectedUsers)
          }
          const res = await fetch(`http://localhost:4000/api/chat/group` , {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearers ${user.token}`
            },
            body: JSON.stringify(dataToSend)
          })

          const resp = await res.json();
          // console.log(resp);
          setChats([resp , ...chats]);
          onClose();
        } catch (error) {
          console.log(error);
        }

    }

    const handleDelete = (user) => {
      if(selectedUsers.includes(user)){
        setSelectedUsers(selectedUsers.filter( (u) => u._id !== user._id ))
      }
    }

    const handleGroup = (user) => {
      if(selectedUsers.includes(user)){
        toast({
          title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
        return;
      }
      setSelectedUsers([...selectedUsers , user]);
    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir={"column"} alignItems={"center"} >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {
              selectedUsers.map( (u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)}/>
              ) )
            }

            {loading? <div>Loading</div> : 
                searchResult.slice(0,4).map( (user) => (
                  <UserListItem key={user._id}  user={user} handleFunction={()=> handleGroup(user)} />
                )
                )}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal