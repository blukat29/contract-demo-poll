import { useState } from "react";
import { Container, Form } from "react-bootstrap";

import AppProvider from "./AppProvider";
import Nav from "./Nav";
import Home from "../pages/Home";
import { User } from "../type/common";

function App() {
  const [user, setUser] = useState<User>();

  return (
    <AppProvider>
      <Container style={{ maxWidth: 800 }}>
        <Nav user={user} setUser={setUser} />
        <div style={{ paddingTop: 60 }}>
          {user ? <Home user={user} /> : <Form.Text style={{ fontSize: 24 }}>Please connect wallet</Form.Text>}
        </div>
      </Container>
    </AppProvider>
  );
}

export default App;
