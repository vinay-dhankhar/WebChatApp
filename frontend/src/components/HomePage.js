import React, { useEffect } from 'react'
import { Box, Container , Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from './Login';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    useEffect(()=> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if(userInfo){
            navigate('/chats');
        }
    } , [navigate]);

  return (
    <Container maxW={'xl'} centerContent>
        <Box d="flex" justifyContent={'center'} p={3} bg={'grey'} w={'100%'} m={"40px 0 15px 0"} borderRadius={"1g"} borderWidth={"1px"} centerContent>
            <Text fontSize={'4xl'} color={'white'} centerContent>
                Chat APP
            </Text>
        </Box>
        <Box bg={'grey'} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
            <Tabs isFitted variant={"soft-rounded"}>
                <TabList mb={"1em"}>
                    <Tab>Login</Tab>
                    <Tab>Signup</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login/>
                    </TabPanel>
                    <TabPanel>
                        <Signup/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
  )
}

export default HomePage