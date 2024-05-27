import React from "react";
import Login from "./Login";
import useLocalStorage from "../hooks/useLocalStorage";
import Dashboard from "./Dashboard";
import ContactsProvider from "../contexts/ContactsProvider";
import ConversationProvider from "../contexts/ConversationProvider";
import {SocketProvider} from "../contexts/SocketProvider";
const App = () => {
  const [id, setId] = useLocalStorage("id");

  return (
    <>
      {id ? (
        <SocketProvider id={id}>
          <ContactsProvider>
            <ConversationProvider id={id}>
              <Dashboard id={id} />
            </ConversationProvider>
          </ContactsProvider>
        </SocketProvider>
      ) : (
        <Login onIdSubmit={setId} />
      )}
    </>
  );
};

export default App;
