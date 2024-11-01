import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Modal, Button, Card } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { doc, addDoc, collection, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [addDocument, setAddDocument] = useState('');
  const [fetchData, setFetchData] = useState([]);
  const [editContent, setEditContent] = useState('');
  const [editId, setEditId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => setEditShow(false);
  const handleEditShow = (data) => {
    setEditContent(data.paragraph || '');  
    setEditId(data.id);
    setEditShow(true);
  };

  const dbref = collection(db, 'DocApp');

  const handleAdd = async () => {
    const addData = await addDoc(dbref, { title: addDocument, paragraph: '' });
    if (addData) {
      // alert("Data added successfully");
      fetch(); // Instead of reloading, fetch data again
      handleClose(); // Close modal
    } else {
      alert("Error occurred!");
    }
  };

  const fetch = async () => {
    const fetchItem = await getDocs(dbref);
    const fetchDatas = fetchItem.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFetchData(fetchDatas);
    console.log(fetchDatas);
  };

  useEffect(() => {
    fetch();
  }, []);

  const delDoc = async (id) => {
    const delref = doc(dbref, id);
    try {
      await deleteDoc(delref);
      // alert("Deleted successfully!");
      fetch(); // Fetch data again to update the UI
    } catch (err) {
      alert(err);
    }
  };

  const handleSave = async () => {
    if (!editId) return;
    const editRef = doc(dbref, editId);
    try {
      await updateDoc(editRef, { paragraph: editContent });
      // alert("Document updated successfully!");
      setEditShow(false);
      fetch(); // Fetch data again to update the UI
    } catch (err) {
      // alert("Error updating document: ", err);
    }
  };

  return (
    <Router>
      <div className="container text-center">
        <h1 className="fw-bolder text-primary mt-5">DOCUMENT APP</h1>
        <button onClick={handleShow} className="btn btn-outline-primary fw-bolder mt-3">
          ADD DOCUMENT <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="container mt-5">
        <div className="row gx-4 gx-lg-5 row-cols-2 gap-4 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {fetchData.map((data) => (
            <Card key={data.id} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title className="text-primary fw-bolder">{data.title}</Card.Title>
                <hr />
                <Card.Text dangerouslySetInnerHTML={{ __html: data.paragraph }} />
                <Button onClick={() => handleEditShow(data)} className="ms-2" variant="success">
                  EDIT <i className="fa-solid fa-edit"></i>
                </Button>
                <Button onClick={() => delDoc(data.id)} className="ms-4" variant="danger">
                  DELETE
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Document Modal */}
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">ADD YOUR DOCUMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <TextField
              onChange={(e) => setAddDocument(e.target.value)}
              value={addDocument}
              className="w-100"
              variant="outlined"
              label="ADD DOCUMENT TITLE"
              type="text"
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            ADD DOCUMENT
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Document Modal with React Quill */}
      <Modal centered show={editShow} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">EDIT DOCUMENT PARAGRAPH</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactQuill theme="snow" value={editContent} onChange={setEditContent} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleSave}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal>
    </Router>
  );
}

export default App;
