import React, {useRef} from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import {v4 as uuidV4} from 'uuid'

const Login = ({onIdSubmit}) => {
  const idref = useRef()

  const handleSubmit = (e) =>{
    e.preventDefault();
    onIdSubmit(idref.current.value);
  }

  const createNewId = () =>{
    onIdSubmit(uuidV4());
  }

  return (
    <Container className="align-items-center d-flex"c style={{height: '100vh'}}>
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group className='mb-2'>
            <Form.Label>Enter Your ID</Form.Label>
            <Form.Control type="text" ref={idref} />
        </Form.Group>
        <Button type="submit" className='me-2' >Login</Button>
        <Button onClick={createNewId} variant="secondary">Create New ID</Button>
      </Form>
    </Container>
  )
}

export default Login