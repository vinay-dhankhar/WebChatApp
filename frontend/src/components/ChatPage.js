import React, { useState } from 'react';
import {ChatState} from '../context/contextProvider';
import { Box, Flex } from '@chakra-ui/react';
import SideDrawer from './SideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';

const ChatPage = () => {

    const [fetchAgain, setFetchAgain] = useState(false);
    const {user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </div>
  )
}

export default ChatPage