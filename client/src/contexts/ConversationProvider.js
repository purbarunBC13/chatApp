import React, { useCallback, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

const ConverstationsContext = React.createContext();

export const useConversations = () => {
  return useContext(ConverstationsContext);
};

const ConverstationProvider = ({id, children }) => {
  const [conversations, setConversations] = useLocalStorage("conversations",[]);

  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

  const { contacts } = useContacts();

  const socket = useSocket()

  const createConversation = (recipients) => {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, message: [] }];
    });
  };

  const addMessageToConversation = useCallback(({ recipients, text,sender }) => {
    setConversations((prevConversations) => {
      let madeChange = false;
      const newMessage = { sender, text };
      const newConversations = prevConversations.map((conversation) => {
        if(arrayEquality(conversation.recipients, recipients)){
          madeChange = true;
          return {
            ...conversation,
            message: [...conversation.message, newMessage],
          };
        }
        return conversation;
      });
      if(madeChange){
        return newConversations;
      }
      else{
        return [...prevConversations, { recipients, message: [newMessage] }];
      }
    });
  },[setConversations])

  useEffect(()=>{
    if (socket == null) return 
    socket.on('receive-message',addMessageToConversation);
    return ()=> socket.off('recieve-message')
  },[socket,addMessageToConversation])

  const sendMessage = (recipients, text) => {

    socket.emit('send-message',{recipients,text})
    addMessageToConversation({ recipients, text, sender: id });
  }
  const formattedConversatons = conversations.map((conversation,index) => {
    const recipients = conversation.recipients.map((receipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === receipient;
      });
      const name = (contact && contact.name) || receipient;
      return { id: receipient, name };
    });

    const messages = conversation.message.map((message) => {
      const contact = contacts.find((contact) => {
        return contact.id === message.sender;
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    } );

    const selected = index === selectedConversationIndex;
    return { ...conversation,messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversatons,
    selectedConversation: formattedConversatons[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
  };

  return (
    <ConverstationsContext.Provider value={value}>
      {children}
    </ConverstationsContext.Provider>
  );
};

export default ConverstationProvider;

function arrayEquality(a, b) {
  if(a.length !== b.length) return false;
  a.sort();
  b.sort();
  return a.every((element, index) => {
    return element === b[index];
  });
}