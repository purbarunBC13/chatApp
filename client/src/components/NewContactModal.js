import React, { useRef } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { useContacts } from "../contexts/ContactsProvider";

const NewContactModal = ({ closeModal }) => {
  const idRef = useRef();
  const NameRef = useRef();
  const { createContact } = useContacts();

  const handleSubmit = (e) => {
    e.preventDefault();
    createContact(idRef.current.value, NameRef.current.value);
    closeModal();
  };

  return (
    <>
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </FormGroup>
          <FormGroup className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={NameRef} required />
          </FormGroup>
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewContactModal;
