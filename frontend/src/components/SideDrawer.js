import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { ChatState } from '../context/contextProvider';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';

const SideDrawer = () => {

    const [loadingChat, setLoadingChat] = useState(false);
    const [searchResult , setSearchResult] = useState([]);

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };
    
    const { isOpen , onOpen , onClose } = useDisclosure();
    const [search , setSearch] = useState("");
    const [loading , setLoading] = useState(false);
    const {user ,setSelectedChat,chats , setChats} = ChatState();
    const toast = useToast();

    const handleSearch = async() => {
        if (!search) {
            toast({
              title: "Please Enter something in search",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top-left",
            });
            return;
          }

          try{
            setLoading(true);
            const res = await fetch(`http://localhost:4000/api/user/searchUser?search=${search}` , {
                method:"GET",
                headers:{
                "Authorization":`Bearer ${user.token}`
                },
            });
            const resp = await res.json();
            // console.log(resp);
            setSearchResult(resp.data);
            setLoading(false);
          }
          catch(error){
            console.log("error searching");
          }
    }

    const accessChat = async(userId) => {
        try{
            // const 
            const UserId = {
                userId:userId,
            };
            // console.log(JSON.stringify(userId));
            setLoadingChat(true);
            const res = await fetch(`http://localhost:4000/api/chat` , {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                "Authorization":`Bearer ${user.token}`
                },
                body:JSON.stringify(UserId),
            });

            const resp = await res.json();
            // console.log(resp);

            if(!chats.find( (c) => c._id===resp._id)) setChats([resp , ...chats]);

            setSelectedChat(resp);
            // console.log("Chats: " , chats);

            setLoadingChat(false);
            // set
        }
        catch(error){
            console.log(error);
        }
    }

  return (
    <>
        <Flex
            d="flex"
            
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >

        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            {/* <i className="fas fa-search"></i> */}
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
        <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon></ChevronDownIcon>}>
                Menu
                {/* can be used for profile pics but me not using profile pics */}
                {/* <Avatar size={'sm'}></Avatar> */}
            </MenuButton>
            <MenuList>
            {/* OpenModal , Modals can be used for making Profile Button Floating ones */}
                <ProfileModal user={user}>
                    <MenuItem>
                        Profile
                    </MenuItem>
                </ProfileModal>
                    <MenuDivider/>
                <MenuItem onClick={logoutHandler}>
                    Logout
                </MenuItem>
            </MenuList>
          </Menu>
        </div>
        </Flex>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
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
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
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
      </Drawer>
    </>
  )
}

export default SideDrawer