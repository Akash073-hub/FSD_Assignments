import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Nav, Navbar, Row, Spinner } from 'react-bootstrap';

const API_URL = 'http://localhost:3004/api';
const categoryOptions = ['All categories', 'IDs & Wallets', 'Electronics', 'Bags & Apparel', 'Books & Stationery'];

function App() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load the registry.');
        return response.json();
      })
      .then(setItems)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const searchable = `${item.title} ${item.category} ${item.location} ${item.description}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (category === 'All categories' || item.category === category);
  }), [items, query, category]);

  const submitReport = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch(`${API_URL}/report`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="app-shell">
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="portal-nav"><Container><Navbar.Brand href="#home" className="brand-mark"><span>FH</span> FindHub</Navbar.Brand><Navbar.Toggle aria-controls="findhub-navigation" /><Navbar.Collapse id="findhub-navigation"><Nav className="me-auto"><Nav.Link href="#home">Home</Nav.Link><Nav.Link href="#registry">Registry</Nav.Link><Nav.Link href="#about">About</Nav.Link></Nav><Button variant="outline-light" className="report-nav-button" onClick={() => setShowReport(true)}>Report an item</Button></Navbar.Collapse></Container></Navbar>
      <main>
        <section id="home" className="hero-section"><Container><Row className="align-items-end gy-4"><Col lg={7}><Badge className="eyebrow">RIVER VALLEY UNIVERSITY</Badge><h1>Find what matters.<br /><em>Return what’s found.</em></h1><p className="hero-copy">Search the campus registry for lost items, or help reunite something you found with its owner.</p></Col><Col lg={5}><div className="search-panel"><Form.Label htmlFor="search" className="search-label">Search the registry</Form.Label><Form.Control id="search" size="lg" placeholder="Try “wallet” or “library”" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="filter-row"><Form.Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</Form.Select><span className="result-count">{filteredItems.length} listings</span></div></div></Col></Row></Container></section>
        <section id="registry" className="registry-section"><Container><div className="section-heading"><div><p className="section-kicker">LIVE REGISTRY</p><h2>Recently reported</h2></div><span className="section-note">Updated throughout the day</span></div>{error && <Alert variant="warning">{error} Make sure the Express server is running on port 3004.</Alert>}{loading ? <div className="loading-state"><Spinner animation="border" /> <span>Loading the registry...</span></div> : <Row className="g-4">{filteredItems.map((item) => <Col md={6} lg={4} key={item.id}><Card className="item-card h-100"><Card.Body><div className={`item-icon ${item.tone}`}>{item.icon === 'headphones' ? '◉' : item.icon === 'key' ? '⚿' : item.icon === 'book' ? '▤' : item.icon === 'backpack' ? '▣' : '▥'}</div><div className="item-meta"><span>{item.id}</span><Badge bg="light" text="dark">{item.status}</Badge></div><Card.Title>{item.title}</Card.Title><Card.Text>{item.description}</Card.Text><div className="item-location"><span>⌖</span> {item.location}<span className="item-date">{item.date}</span></div></Card.Body><Card.Footer><span>{item.category}</span><Button variant="link" className="claim-link">This is mine <span>→</span></Button></Card.Footer></Card></Col>)}</Row>}{!loading && !filteredItems.length && <div className="empty-state">No items match that search. Try a broader phrase.</div>}</Container></section>
      </main>
      <Modal show={showReport} onHide={() => { setShowReport(false); setSubmitted(false); }} centered><Modal.Header closeButton><Modal.Title>Report an item</Modal.Title></Modal.Header><Modal.Body>{submitted ? <Alert variant="success">Thanks. Your report is now with the campus team.</Alert> : <Form onSubmit={submitReport}><Form.Group className="mb-3"><Form.Label>Item name</Form.Label><Form.Control name="title" required placeholder="e.g. Blue water bottle" /></Form.Group><Form.Group className="mb-3"><Form.Label>Where did you find it?</Form.Label><Form.Control name="location" required placeholder="e.g. Student Center" /></Form.Group><Form.Group className="mb-3"><Form.Label>Short description</Form.Label><Form.Control name="description" as="textarea" rows={3} required /></Form.Group><Button type="submit" className="submit-button">Submit report</Button></Form>}</Modal.Body></Modal>
    </div>
  );
}

export default App;
