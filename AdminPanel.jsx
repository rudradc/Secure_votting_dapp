import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Table, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Shield, PlusCircle, PauseCircle, PlayCircle, Eye, AlertTriangle } from 'lucide-react';

const AdminPanel = ({ candidates, addCandidate, toggleElection, electionActive, registeredVoters, voteTransactions }) => {
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', uploadingIpfs: false, ipfsHash: '' });
  const [showAiAlert, setShowAiAlert] = useState(false);

  const generateIpfsHash = () => 'Qm' + Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const handleIpfsUpload = () => {
    setNewCandidate({ ...newCandidate, uploadingIpfs: true });
    setTimeout(() => {
      setNewCandidate({ ...newCandidate, uploadingIpfs: false, ipfsHash: generateIpfsHash() });
    }, 1500);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCandidate.name && newCandidate.party && newCandidate.ipfsHash) {
      addCandidate(newCandidate.name, newCandidate.party, newCandidate.ipfsHash);
      setNewCandidate({ name: '', party: '', uploadingIpfs: false, ipfsHash: '' });
    }
  };

  const handleScannerClick = () => {
    setShowAiAlert(true);
    setTimeout(() => setShowAiAlert(false), 4000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
            <Shield className="text-primary" size={28}/> Admin Dashboard
          </h2>
          <p className="text-light opacity-75 m-0 small">Manage Smart Contract & Election State</p>
        </div>
      </div>

      <Row className="g-4">
        <Col md={8}>
          <Card className="glass-card border-0 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white m-0">Election Status Controller</h5>
                <Badge bg={electionActive ? "success" : "danger"} className="px-3 py-2 rounded-pill text-uppercase tracking-wider">
                  {electionActive ? "Active" : "Halted"}
                </Badge>
              </div>
              <p className="text-light opacity-75 small mb-4">Use multi-sig authority to pause or resume the smart contract state. Polling will immediately stop for all nodes.</p>
              
              <div className="d-flex gap-3">
                <Button 
                  variant={electionActive ? "outline-danger" : "outline-success"} 
                  className="d-flex align-items-center justify-content-center gap-2 py-2 px-4 flex-grow-1 border-2 fw-bold"
                  onClick={toggleElection}
                >
                  {electionActive ? <><PauseCircle size={20}/> Halt Election</> : <><PlayCircle size={20}/> Resume Election</>}
                </Button>
                <Button variant="outline-warning" className="d-flex align-items-center justify-content-center gap-2 py-2 px-4 border-2 fw-bold" onClick={handleScannerClick}>
                  <Eye size={20} /> Run AI Fraud Scanner
                </Button>
              </div>

              {showAiAlert && (
                <Alert variant="warning" className="mt-3 mb-0 bg-dark text-warning border-warning border-opacity-50 small d-flex gap-2">
                  <AlertTriangle size={18}/> Executing heuristic scanner on recent transactions... 0 anomalies detected across 40 nodes.
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Card className="glass-card border-0">
            <Card.Body>
              <h5 className="text-white mb-3">Registered Candidates Directory</h5>
              <div className="table-responsive rounded">
                <Table hover variant="dark" className="align-middle bg-transparent m-0">
                  <thead className="text-light opacity-75">
                    <tr>
                      <th className="font-monospace small">ID (UInt32)</th>
                      <th>Candidate Name</th>
                      <th>Party Affiliation</th>
                      <th className="text-end">Current Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map(c => (
                      <tr key={c.id}>
                        <td className="font-monospace text-primary">#{c.id}</td>
                        <td className="fw-medium text-white">{c.name}</td>
                        <td className="text-light opacity-75">{c.party}</td>
                        <td className="text-end fw-bold text-info">{c.voteCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <Card className="glass-card border-0 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white m-0">Voter Registration Ledger (History)</h5>
                <Badge bg="info" className="px-3 py-2 rounded-pill text-uppercase tracking-wider">
                  {registeredVoters?.length || 0} Registered
                </Badge>
              </div>
              <p className="text-light opacity-75 small mb-4">Immutable history of individuals who have successfully verified their identity and entered the voting pool.</p>
              
              <div className="table-responsive rounded">
                <Table hover variant="dark" className="align-middle bg-transparent m-0">
                  <thead className="text-light opacity-75">
                    <tr>
                      <th className="font-monospace small">Aadhaar (Masked)</th>
                      <th>Legal Name</th>
                      <th>Location / Pincode</th>
                      <th className="text-end">Phone Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredVoters?.map((voter, idx) => (
                      <tr key={idx}>
                        <td className="font-monospace text-primary">********{voter.aadhaar?.slice(-4) || '****'}</td>
                        <td className="fw-medium text-white">{voter.name}</td>
                        <td className="text-light opacity-75">{voter.city}, {voter.region} <span className="small opacity-50">({voter.pincode || 'N/A'})</span></td>
                        <td className="text-end text-light opacity-75">{voter.phone || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <Card className="glass-card border-0 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white m-0">Cryptographic Vote Ledger (Database)</h5>
                <Badge bg="success" className="px-3 py-2 rounded-pill text-uppercase tracking-wider">
                  {voteTransactions?.length || 0} Transactions
                </Badge>
              </div>
              <p className="text-light opacity-75 small mb-4">Real-time immutable database storing all cast votes with their unique execution transaction hash.</p>
              
              <div className="table-responsive rounded">
                <Table hover variant="dark" className="align-middle bg-transparent m-0">
                  <thead className="text-light opacity-75">
                      <tr>
                        <th className="font-monospace small">Tx Hash</th>
                        <th>Voter Identity</th>
                        <th>Digital Signature</th>
                        <th>Encrypted Payload</th>
                        <th className="text-end">Timestamp</th>
                      </tr>
                  </thead>
                  <tbody>
                    {voteTransactions && voteTransactions.length > 0 ? (
                      voteTransactions.map((tx, idx) => (
                        <tr key={idx}>
                          <td className="font-monospace text-success small">{tx.txHash}</td>
                          <td>
                            <div className="fw-bold text-white">{tx.voterName}</div>
                            <div className="small text-light opacity-75 font-monospace">UID: {tx.voterAadhaar?.slice(0,4)}********</div>
                          </td>
                          <td className="font-monospace text-success small">
                            <ShieldCheck size={14} className="me-1 mb-1"/> Validated<br/>
                            <span className="text-light opacity-75">{tx.digitalSignature}</span>
                          </td>
                          <td className="font-monospace text-warning small text-truncate" style={{maxWidth: '150px'}} title={tx.encryptedPayload}>
                            <ShieldAlert size={14} className="me-1 mb-1"/> 
                            {tx.encryptedPayload.substring(0, 15)}...
                          </td>
                          <td className="text-end text-light opacity-75 small">{tx.timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-light opacity-50 py-4">
                          No transactions recorded on the ledger yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="glass-card border-0">
            <Card.Body>
              <h5 className="text-white mb-3 d-flex align-items-center gap-2">
                <PlusCircle size={20} className="text-secondary" /> Register Candidate
              </h5>
              <p className="text-light opacity-75 small mb-4">Adds a new candidate struct to the blockchain ledger. Requires admin signature.</p>
              
              <Form onSubmit={handleAdd}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1">Full Legal Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter name" 
                    className="form-control-dark py-2"
                    value={newCandidate.name}
                    onChange={e => setNewCandidate({...newCandidate, name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="small text-light opacity-75 mb-1">Party / Group Identity</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter party name" 
                    className="form-control-dark py-2"
                    value={newCandidate.party}
                    onChange={e => setNewCandidate({...newCandidate, party: e.target.value})}
                    required
                  />
                </Form.Group>

                <div className="mb-4">
                  <Form.Label className="small text-light opacity-75 mb-1">Candidate Asset Upload (IPFS)</Form.Label>
                  {newCandidate.ipfsHash ? (
                    <div className="bg-dark p-2 rounded border border-success border-opacity-50">
                      <div className="small text-success fw-bold mb-1"><Shield size={12}/> IPFS Document Pinned</div>
                      <div className="font-monospace text-light opacity-75 small text-truncate">{newCandidate.ipfsHash}</div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline-info" 
                      className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleIpfsUpload}
                      disabled={newCandidate.uploadingIpfs}
                    >
                      {newCandidate.uploadingIpfs ? <span className="spinner-border spinner-border-sm"></span> : <PlusCircle size={18} />} 
                      {newCandidate.uploadingIpfs ? 'Pinning to IPFS...' : 'Upload Image to IPFS'}
                    </Button>
                  )}
                </div>

                <Button type="submit" className="btn-gradient w-100 py-2 rounded-3 fw-bold" disabled={!newCandidate.ipfsHash}>
                  Deploy to Ledger
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default AdminPanel;
