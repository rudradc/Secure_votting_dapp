import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Alert, Modal, Form, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, ShieldCheck, FileDigit, Activity, User, Search, Info, Fingerprint } from 'lucide-react';

const Vote = ({ candidates, castVote, user, updateUser, electionActive, deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [confirmationMeta, setConfirmationMeta] = useState(null); // { show: bool, id: null }
  const [isCasting, setIsCasting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ title: 'Transaction Validated', body: 'Vote Successful ✅' });
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', city: '', region: '', pincode: '' });
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [isSimulatingFraud, setIsSimulatingFraud] = useState(false);
  const [fraudAlert, setFraudAlert] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const simulateRapidVotes = () => {
    setIsSimulatingFraud(true);
    setFraudAlert(false);
    
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (attempts === 5) {
        clearInterval(interval);
        setFraudAlert(true);
        setIsSimulatingFraud(false);
      }
    }, 200);
  };

  const handleVerifyIdentity = () => {
    setShowBiometric(true);
    setScanSuccess(false);
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        setShowBiometric(false);
        if (pendingUpdate) {
          updateUser && updateUser(editForm);
          setIsEditing(false);
          setPendingUpdate(false);
          setToastMsg({ title: 'Profile Updated', body: 'Changes cryptographically signed and saved. ✅' });
          setShowToast(true);
        } else {
          setIsIdentityVerified(true);
        }
      }, 1000);
    }, 2500);
  };

  const handleInitiateUpdate = () => {
    setPendingUpdate(true);
    setShowBiometric(true);
    setScanSuccess(false);
  };

  useEffect(() => {
    const updateTime = () => {
      const diff = deadline - new Date();
      if (diff <= 0) {
        setTimeLeft('Voting Closed');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h}h ${m}m ${s}s remaining`);
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, [deadline]);

  const handleVote = () => {
    if (!confirmationMeta) return;
    setIsCasting(true);
    
    setTimeout(() => {
      const digitalSignature = `SIG-${user.id}-${user.aadhaar?.slice(-4)}`;
      const result = castVote(confirmationMeta.id, digitalSignature);
      
      setIsCasting(false);
      setConfirmationMeta(null);
      if (result?.success) {
        setToastMsg({ title: 'Vote Encrypted & Propagated', body: 'End-to-End Encrypted Vote Successful 🔒' });
        setShowToast(true);
      } else {
        setToastMsg({ title: 'Verification Failed', body: result?.error || 'Signature dropped.' });
        setShowToast(true);
      }
    }, 2800);
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // The early return if (user.hasVoted) was removed to support locking UI

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header info */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 glass-card">
        <div>
          <h3 className="text-white fw-bold m-0 text-center text-md-start">Voter Dashboard</h3>
          <p className="text-light opacity-75 small m-0 d-flex align-items-center justify-content-center justify-content-md-start gap-1 mt-1">
            <ShieldAlert size={14} className="text-success"/> Secure Connection Verified
          </p>
        </div>
        <div className="text-center text-md-end mt-3 mt-md-0">
          <Badge bg={electionActive ? "danger" : "secondary"} className="p-2 fs-6 mb-1 rounded-pill">
            <Clock size={14} className="me-1 mb-1" /> {timeLeft}
          </Badge>
          {!electionActive && <div className="text-danger small mt-1">Election has been paused.</div>}
        </div>
      </div>

      <Row className="g-4">
        {/* Left Side: Voter Info & Stats */}
        <Col lg={4}>
          <Card className="glass-card mb-4 border-0">
            <Card.Header className="bg-transparent border-bottom border-secondary border-opacity-25 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white d-flex align-items-center gap-2"><User size={18} /> Voter Profile</h5>
              {!isEditing ? (
                <Button variant="link" className="p-0 text-info text-decoration-none small" onClick={() => { setIsEditing(true); setEditForm({ phone: user.phone, city: user.city, region: user.region, pincode: user.pincode }); }}>Edit</Button>
              ) : (
                <Button variant="link" className="p-0 text-secondary text-decoration-none small" onClick={() => { setIsEditing(false); setPendingUpdate(false); }}>Cancel</Button>
              )}
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small">Name</span>
                <span className="text-white fw-bold text-end text-break ms-2">{user.name || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small min-w-max pe-2">City</span>
                {isEditing ? <Form.Control size="sm" className="bg-dark text-white border-secondary text-end w-50" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} /> : <span className="text-white fw-bold">{user.city || 'N/A'}</span>}
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small min-w-max pe-2">Region</span>
                {isEditing ? <Form.Control size="sm" className="bg-dark text-white border-secondary text-end w-50" value={editForm.region} onChange={e => setEditForm({...editForm, region: e.target.value})} /> : <span className="text-white fw-bold">{user.region || 'N/A'}</span>}
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small min-w-max pe-2">PIN Code</span>
                {isEditing ? <Form.Control size="sm" className="bg-dark text-white border-secondary text-end w-50" value={editForm.pincode} onChange={e => setEditForm({...editForm, pincode: e.target.value})} /> : <span className="text-white fw-bold">{user.pincode || 'N/A'}</span>}
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small min-w-max pe-2">Phone</span>
                {isEditing ? <Form.Control size="sm" className="bg-dark text-white border-secondary text-end w-50" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /> : <span className="text-white fw-bold">{user.phone || 'N/A'}</span>}
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small">Voter ID</span>
                <span className="text-white fw-bold font-monospace">{user.id}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-2">
                <span className="text-light opacity-75 small">Aadhaar (Masked)</span>
                <span className="text-white fw-bold font-monospace">********{user.aadhaar?.slice(-4) || '****'}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-light opacity-75 small">Status</span>
                {!electionActive || timeLeft === 'Voting Closed' ? (
                  <Badge bg="danger" className="text-white">🔴 Voting Closed</Badge>
                ) : user.hasVoted ? (
                  <Badge bg="success" className="text-white">🟢 Voted</Badge>
                ) : (
                  <Badge bg="warning" className="text-dark">🟡 Pending</Badge>
                )}
              </div>
              
              <AnimatePresence>
                {isEditing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3">
                    <Button variant="info" className="w-100 py-2 rounded-3 fw-bold" onClick={handleInitiateUpdate}>
                      Sign & Apply Changes
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Body>
          </Card>

          <Card className="glass-card border-0 mb-4">
            <Card.Header className="bg-transparent border-bottom border-secondary border-opacity-25 py-3">
              <h5 className="mb-0 text-white d-flex align-items-center gap-2"><Activity size={18} /> Network Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Badge bg="success" className="rounded-circle p-2 me-2"><span className="visually-hidden">Healthy</span></Badge>
                <span className="text-white small">Mainnet Connected</span>
              </div>
              <div className="small text-light opacity-75 mb-2">
                <strong>Current Block:</strong> <span className="font-monospace text-primary">#{(Math.floor(Math.random() * 100000) + 900000)}</span>
              </div>
              <div className="small text-light opacity-75">
                <strong>Active Nodes:</strong> 12 / 12
              </div>
            </Card.Body>
          </Card>

          <Card className="glass-card border-0 mb-4 border-danger border-opacity-25">
            <Card.Header className="bg-transparent border-bottom border-danger border-opacity-25 py-3">
              <h5 className="mb-0 text-danger d-flex align-items-center gap-2"><ShieldAlert size={18} /> AI Fraud Detection</h5>
            </Card.Header>
            <Card.Body>
              <p className="small text-light opacity-75 mb-3">
                Monitor for anomalous behavior such as rapid transaction flooding.
              </p>
              <AnimatePresence>
                {fraudAlert && (
                  <motion.div initial={{ opacity: 0, height: 0, overflow: 'hidden' }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-3">
                    <Alert variant="danger" className="bg-danger bg-opacity-25 text-danger border-danger mb-0 py-2 small fw-bold text-center">
                      <ShieldAlert size={14} className="me-1 mb-1" /> Suspicious activity detected
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="w-100"
                onClick={simulateRapidVotes}
                disabled={isSimulatingFraud}
              >
                {isSimulatingFraud ? 'Injecting packets...' : 'Simulate Multiple Rapid Votes'}
              </Button>
            </Card.Body>
          </Card>
          
          <Alert variant="info" className="bg-dark text-info border-info border-opacity-50 small mb-4">
            <Info size={16} className="me-2 mb-1"/>
            <strong>Guidelines:</strong> You may only cast ONE vote. This action is irreversible. Review your choice carefully.
          </Alert>

          {!user.hasVoted && (
            <Card className="glass-card border-0 mb-4 text-center py-4 px-3">
              {isIdentityVerified ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <CheckCircle size={48} className="text-success mb-3 mx-auto" />
                  <h5 className="text-white fw-bold">Identity Verified</h5>
                  <p className="small text-light opacity-75 mb-0">Biometric authentication complete. You may now cast your vote.</p>
                </motion.div>
              ) : (
                <motion.div>
                  <Fingerprint size={48} className="text-warning mb-3 mx-auto opacity-75" />
                  <h5 className="text-white fw-bold">Verification Required</h5>
                  <p className="small text-light opacity-75 mb-4">Please simulate biometric Aadhaar verification to unlock your voting terminal.</p>
                  <Button 
                    variant="warning" 
                    className="w-100 py-2 rounded-pill fw-bold"
                    onClick={handleVerifyIdentity}
                  >
                    Authenticate Terminal
                  </Button>
                </motion.div>
              )}
            </Card>
          )}
        </Col>

        {/* Right Side: Candidates */}
        <Col lg={8}>
          <AnimatePresence>
            {user.hasVoted && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Alert variant="success" className="bg-success bg-opacity-10 text-success border-success border-opacity-50 mb-3 glass-card">
                  <h5 className="mb-2 d-flex align-items-center gap-2"><CheckCircle size={20}/> Vote Recorded Successfully!</h5>
                  <div className="bg-dark p-2 rounded font-monospace small text-white-50 text-break mb-1">
                    Tx Hash: <span className="text-white">{user.txHash}</span>
                  </div>
                  <div className="small">Your vote is immutably stored on the blockchain and cannot be altered.</div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-white m-0">Candidates List</h4>
            <div style={{ width: '250px' }}>
              <InputGroup>
                <InputGroup.Text className="bg-dark border-secondary text-light opacity-75"><Search size={16}/></InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Search candidates..." 
                  className="bg-dark text-white border-secondary border-start-0 ps-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
              </InputGroup>
            </div>
          </div>
          
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-5 text-light opacity-75 glass-card rounded">
              <User size={48} className="mb-3 opacity-50"/>
              <h5>No candidates found</h5>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <Row className="g-3">
              {filteredCandidates.map((c) => (
                <Col md={6} key={c.id}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="h-100">
                    <Card className="glass-card h-100 border-0">
                    <div className="text-center pt-4 pb-2">
                      <img src={c.image} alt={c.name} className="rounded-circle border border-2 border-primary" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                    </div>
                    <Card.Body className="text-center d-flex flex-column pt-0">
                      <h5 className="fw-bold text-white mt-2 mb-1">{c.name}</h5>
                      <p className="text-light opacity-75 small mb-2">{c.party}</p>
                      {c.ipfsHash && (
                        <div className="bg-dark bg-opacity-50 p-2 rounded-3 mb-3 mx-2 border border-secondary border-opacity-25" title="Decentralized IPFS Asset Hash">
                          <div className="text-success small d-flex align-items-center justify-content-center gap-1 mb-1">
                            <ShieldAlert size={12}/> IPFS Asset Pinned
                          </div>
                          <div className="font-monospace text-light opacity-50 small text-truncate" style={{ fontSize: '0.75rem' }}>
                            {c.ipfsHash}
                          </div>
                        </div>
                      )}
                      <div className="mt-auto">
                        {user.hasVoted ? (
                          <Button 
                            variant={user.votedCandidateId === c.id ? "success" : "secondary"}
                            className={`w-100 py-2 rounded-pill fw-medium rounded-3 ${user.votedCandidateId !== c.id ? 'opacity-50' : ''}`}
                            disabled
                          >
                            {user.votedCandidateId === c.id ? "Vote Submitted ✅" : "Voting Locked"}
                          </Button>
                        ) : (
                          <Button 
                            className="btn-gradient w-100 py-2 rounded-pill fw-medium rounded-3"
                            disabled={!electionActive || timeLeft === 'Voting Closed' || !isIdentityVerified}
                            onClick={() => setConfirmationMeta({ show: true, id: c.id, name: c.name })}
                          >
                            {(!electionActive || timeLeft === 'Voting Closed') 
                              ? 'Voting Closed' 
                              : !isIdentityVerified 
                                ? 'Verify ID to Vote' 
                                : 'Cast Vote'}
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      <Modal show={confirmationMeta?.show} onHide={() => setConfirmationMeta(null)} centered contentClassName="glass-card text-light">
        <Modal.Header border="0" className="border-secondary border-opacity-25" closeVariant="white" closeButton>
          <Modal.Title><ShieldAlert size={20} className="me-2 text-warning mb-1"/> Confirm Vote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-center py-4">
          {!isCasting ? (
            <>
              <p className="mb-2 text-white">Are you sure you want to vote for <strong>{confirmationMeta?.name}</strong>?</p>
              <p className="small text-danger font-monospace bg-danger bg-opacity-10 py-2 px-3 rounded mt-3 d-inline-block">Warning: Smart contract will execute immutably.</p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
              <FileDigit size={48} className="text-warning mb-3 opacity-75 mx-auto" />
              <h5 className="text-white fw-bold">Applying End-to-End Encryption</h5>
              <p className="small text-light opacity-75 mb-3">Wrapping packet in irreversible AES-256 cyphertext...</p>
              <div className="font-monospace text-success small text-break bg-black p-3 rounded" style={{border: '1px solid #198754'}}>
                 0x{(Math.random() + 1).toString(36).substring(2)}{(Math.random() + 1).toString(36).substring(2)}aFb34B9cE1...
              </div>
              <div className="mt-3 text-info small fw-bold d-flex align-items-center justify-content-center gap-1">
                 <ShieldCheck size={14} /> Identity Signature: SIG-{user.id}-{user.aadhaar?.slice(-4)}
              </div>
            </motion.div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary border-opacity-25">
          <Button variant="outline-secondary" onClick={() => setConfirmationMeta(null)} disabled={isCasting}>Cancel</Button>
          <Button variant="primary" className="btn-gradient px-4" onClick={handleVote} disabled={isCasting}>
            {isCasting ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Encrypting...</> : 'Confirm & Sign'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-4 position-fixed" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide className="glass-card border-success border-opacity-50 text-white bg-dark">
          <Toast.Header className="bg-success text-white border-0" closeVariant="white">
            <CheckCircle size={16} className="me-2" />
            <strong className="me-auto">{toastMsg.title}</strong>
          </Toast.Header>
          <Toast.Body className="fw-medium text-success fs-6">{toastMsg.body}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showBiometric} onHide={() => !isScanning && setShowBiometric(false)} centered contentClassName="glass-card border-0 text-white">
        <Modal.Header className="border-secondary border-opacity-25" closeButton={!isScanning} closeVariant="white">
          <Modal.Title className="fs-5 d-flex align-items-center">
            <Fingerprint className="me-2 text-primary" size={20} />
            Terminal Unlock Authorized
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4 d-flex flex-column align-items-center w-100">
          {scanSuccess ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
              <CheckCircle size={64} className="text-success mb-3" />
              <h5 className="text-white fw-bold">Live Identity Verified</h5>
              <p className="text-light opacity-75 small">Biometric hash authenticated for UID <span className="font-monospace ms-1">{user.aadhaar?.slice(0,4)}********</span>.</p>
            </motion.div>
          ) : (
            <div className="d-flex flex-column align-items-center w-100">
              <motion.div 
                animate={isScanning ? { scale: [1, 1.1, 1], opacity: [1, 0.5, 1] } : {}} 
                transition={isScanning ? { repeat: Infinity, duration: 1.5 } : {}}
              >
                <Fingerprint size={80} className={`${isScanning ? 'text-info' : 'text-primary opacity-50'} mb-3`} />
              </motion.div>
              
              
              <h5 className="fw-bold mb-2">{isScanning ? `Processing Proof of Identity...` : 'Secondary Biometric Required'}</h5>
              <p className="small text-light opacity-75 mb-4 px-2">
                As a mandatory security protocol, please scan your primary biometric marker to {pendingUpdate ? 'authorize updating your permanent profile records.' : 'unlock the execution terminal.'}
              </p>
              
              <Button 
                variant={isScanning ? "outline-info" : "primary"} 
                className={`rounded-pill px-4 py-2 ${!isScanning && 'btn-gradient'}`}
                onClick={handleBiometricScan}
                disabled={isScanning}
              >
                {isScanning ? 'Verifying Hash...' : `Scan Biometric to ${pendingUpdate ? 'Apply' : 'Unlock'}`}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </motion.div>
  );
};

export default Vote;
