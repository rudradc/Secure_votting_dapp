import React from 'react';
import { Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Trophy, Users, PieChart as PieChartIcon, Lock } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];

const Results = ({ candidates, electionActive }) => {
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const winner = totalVotes > 0 ? sortedCandidates[0] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h2 className="text-white fw-bold mb-0">Live Election Results</h2>
        <Badge bg={electionActive ? "success" : "secondary"} className="px-3 py-2 rounded-pill fs-6">
          <span className="d-flex align-items-center gap-2">
            {electionActive ? <div className="spinner-grow spinner-grow-sm text-light" role="status"></div> : null}
            {electionActive ? 'Polling Active' : 'Final Results'}
          </span>
        </Badge>
      </div>

      <Row className="mb-4 g-3">
        <Col md={4} sm={6}>
          <Card className="glass-card text-center dashboard-stat-card border-0">
            <Card.Body>
              <Users size={32} className="text-primary mb-2" />
              <h5 className="text-light opacity-75 mb-0">Total Votes Cast</h5>
              <h2 className="text-white fw-bold mt-2 mb-0">{totalVotes.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6}>
          <Card className="glass-card text-center dashboard-stat-card border-0">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              {electionActive ? (
                <>
                  <Lock size={32} className="text-warning mb-2" />
                  <h6 className="text-warning opacity-75 mb-0 mt-1">Status</h6>
                  <h3 className="text-white fw-bold mt-1 mb-0 text-truncate w-100 px-2">Encrypted</h3>
                </>
              ) : winner ? (
                <>
                  <div className="position-relative mb-2 mt-1">
                    <img 
                      src={winner.image} 
                      alt={winner.name} 
                      className="rounded-circle border border-3 border-warning shadow-lg" 
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }} 
                    />
                    <div className="position-absolute bottom-0 end-0 bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', transform: 'translate(10%, 10%)' }}>
                      <Trophy size={14} className="text-dark" />
                    </div>
                  </div>
                  <h6 className="text-light opacity-75 mb-0 mt-1">Elected Winner</h6>
                  <h3 className="text-white fw-bold mt-1 mb-0 text-truncate w-100 px-2">{winner.name}</h3>
                </>
              ) : (
                <>
                  <Trophy size={32} className="text-warning mb-2" />
                  <h6 className="text-light opacity-75 mb-0 mt-1">Elected Winner</h6>
                  <h3 className="text-white fw-bold mt-1 mb-0 text-truncate w-100 px-2">N/A</h3>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="glass-card text-center dashboard-stat-card border-0 h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <Activity size={32} className="text-info mb-2 align-self-center" />
              <h5 className="text-light opacity-75 mb-0">Network Status</h5>
              <h5 className="text-success fw-bold mt-2 mb-0">ICP Network Optimal</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white mb-0 d-flex align-items-center gap-2">
                  <PieChartIcon size={20} className="text-primary" /> Visual Analytics
                </h5>
              </div>
              <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column' }}>
                {electionActive ? (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center py-4 px-2">
                    <Lock size={64} className="text-warning mb-3 opacity-75" />
                    <h4 className="text-warning fw-bold">Results E2E Encrypted</h4>
                    <p className="text-light opacity-75 text-center small px-md-5 mt-2">
                      End-to-End encryption prevents tally decoding during an active election cycle. The network will automatically supply standard decryption keys to reveal layout visualizers upon Administrative polling halt.
                    </p>
                  </div>
                ) : (
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie 
                        data={candidates} 
                        dataKey="voteCount" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={100} 
                        labelLine={false}
                        label={({ name, percent }) => percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                      >
                        {candidates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                        itemStyle={{ color: '#fff' }}
                      />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="glass-card border-0 h-100 position-relative overflow-hidden">
            <Card.Body>
              <h5 className="text-white mb-4 text-center">Decrypted Standings</h5>
              {electionActive ? (
                <div className="d-flex flex-column gap-3 py-2">
                  {candidates.map((c, idx) => (
                    <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded bg-dark border border-secondary border-opacity-25" style={{ filter: 'blur(3px)', opacity: 0.5 }}>
                       <div className="d-flex align-items-center gap-3">
                         <div className="bg-secondary rounded-circle" style={{width:'32px', height:'32px'}}></div>
                         <div className="bg-secondary rounded" style={{width:'120px', height:'14px'}}></div>
                       </div>
                       <div className="bg-secondary rounded" style={{width:'50px', height:'14px'}}></div>
                    </div>
                  ))}
                  <div className="text-center position-absolute top-50 start-50 translate-middle w-100 z-1">
                     <h5 className="text-white fw-bold mb-1 px-4 drop-shadow-md" style={{textShadow: '0px 2px 12px rgba(0,0,0,1)'}}>Awaiting Contract Halting...</h5>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {sortedCandidates.map((c, idx) => {
                  const percentage = totalVotes === 0 ? 0 : ((c.voteCount / totalVotes) * 100).toFixed(1);
                  return (
                    <div key={c.id}>
                      <div className="d-flex justify-content-between mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-light opacity-75 fw-bold">#{idx+1}</span>
                          <span className="text-light fw-medium">{c.name}</span>
                        </div>
                        <span className="text-white fw-bold">{c.voteCount} <span className="small text-light opacity-75 fw-normal">votes</span></span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <ProgressBar 
                          now={percentage} 
                          variant={idx === 0 ? "success" : "primary"} 
                          className="flex-grow-1 bg-dark" 
                          style={{ height: '8px' }}
                        />
                        <span className="small text-white fw-bold min-w-40 text-end" style={{width: '45px'}}>{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </motion.div>
  );
};

export default Results;
