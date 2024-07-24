import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from "./context/contextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  
  <BrowserRouter>
  <ChatProvider>
  <ChakraProvider>
    <App />
    </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
