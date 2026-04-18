import React from 'react';
import { Card, Badge, Col, Row } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Clock, Hash } from 'lucide-react';

const RegistrationHistory = ({ registeredVoters, voteTransactions }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="container p-0 text-light mt-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 glass-card p-4 rounded-4">
        <div>
          <h2 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
            <Activity className="text-primary" size={28} /> Voter History <span className="opacity-50 ms-2 fs-5">(Privacy-Safe)</span>
          </h2>
          <p className="text-light opacity-75 m-0 small mt-2">
            Public ledger of anonymous executions. Active votes are decoupled from user identities to ensure privacy.
          </p>
        </div>
        <div className="mt-3 mt-md-0 text-center text-md-end">
          <Badge bg="primary" className="px-4 py-3 rounded-pill fs-5 d-flex align-items-center gap-2 shadow-sm mb-2">
            <ShieldCheck size={20} /> Registered Nodes: {registeredVoters?.length || 0}
          </Badge>
          <div className="text-success small fw-bold">Verified Transactions: {voteTransactions?.length || 0}</div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3 mb-5">
        <h4 className="text-white fw-bold mb-2 d-flex align-items-center gap-2 mt-4"><Clock size={20} className="text-primary"/> Recent Transactions</h4>
        {voteTransactions && voteTransactions.length > 0 ? (
          [...voteTransactions].reverse().map((tx, idx) => {
            
            // Format timestamp slightly (optional safely parse string)
            const timeOnly = tx.timestamp.includes(', ') ? tx.timestamp.split(', ')[1] : tx.timestamp;

            return (
            <Card key={idx} className="glass-card border-0 shadow-lg">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 px-4 py-4">
                
                <div className="d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <Badge bg="success" className="bg-success bg-opacity-10 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill fs-6">
                      Vote Status: Completed ✅
                    </Badge>
                    <span className="text-light opacity-75 fw-medium d-flex align-items-center gap-1">
                      <Clock size={16} /> Time: {timeOnly}
                    </span>
                  </div>
                  <h5 className="text-white mb-0 mt-1 fw-bold">Election: General Election 2026</h5>
                </div>

                <div className="bg-dark bg-opacity-75 rounded-3 p-3 text-start text-md-center border border-secondary border-opacity-25" style={{ minWidth: '320px' }}>
                  <div className="text-light opacity-50 small mb-1 d-flex align-items-center gap-1 justify-content-start justify-content-md-center">
                    <Hash size={14} /> Transaction Execution ID
                  </div>
                  <div className="font-monospace text-info fw-bold w-100 text-truncate fs-5">
                    {tx.txHash.substring(0, 10)}...{tx.txHash.slice(-8)}
                  </div>
                </div>

              </Card.Body>
            </Card>
          )})
        ) : (
          <div className="text-center py-5 glass-card rounded-4">
             <Activity size={48} className="text-primary opacity-50 mb-3" />
             <h5 className="text-white opacity-75">No Activity Detected</h5>
             <p className="text-light opacity-50 mb-0">The public ledger is currently empty. Votes will appear here after execution.</p>
          </div>
        )}
      </div>

      <div className="mb-5">
        <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2"><ShieldCheck size={20} className="text-primary"/> Registered Voter Directory</h4>
        <Row className="g-3">
          {registeredVoters && registeredVoters.length > 0 ? registeredVoters.map((voter, idx) => (
            <Col md={6} lg={4} key={idx}>
              <Card className="glass-card border-0 h-100 p-3">
                <div className="d-flex align-items-center gap-3 border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                  <div className="bg-primary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                     <span className="text-white fw-bold fs-5">{voter.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h5 className="text-white mb-0 fw-bold">{voter.name}</h5>
                    <span className="text-light opacity-50 small font-monospace">Secure ID: ********{voter.aadhaar?.substring(8) || '****'}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                   <span className="text-light opacity-50 small">Region</span>
                   <span className="text-white small fw-bold">{voter.region}</span>
                </div>
                <div className="d-flex justify-content-between">
                   <span className="text-light opacity-50 small">City</span>
                   <span className="text-white small fw-bold">{voter.city}</span>
                </div>
              </Card>
            </Col>
          )) : (
             <div className="w-100 text-center py-4 text-light opacity-50">No external registrations loaded relative to this cycle.</div>
          )}
        </Row>
      </div>
    </motion.div>
  );
};

export default RegistrationHistory;
