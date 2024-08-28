
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
function BoostrapModal({ show, handleClose, children }) {

    // const [modalShow, setModalShow] = useState(false);
    // const handleClose = () => setModalShow(false);

    // useEffect(() => {
    //  setModalShow(show);
    // }, [show])
    
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BoostrapModal;
