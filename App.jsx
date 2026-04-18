import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navbar';
import Login from './components/Login';
import Vote from './components/Vote';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import RegistrationHistory from './components/History';

// Mock Blockchain State
const generateIpfsHash = () => 'Qm' + Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join('');

const initialCandidates = [
  { id: 1, name: 'Alice Smith', party: 'Tech Forward Party', voteCount: 154, image: 'https://i.pravatar.cc/150?u=alice', ipfsHash: generateIpfsHash() },
  { id: 2, name: 'Bob Johnson', party: 'Decentralized Future', voteCount: 89, image: 'https://i.pravatar.cc/150?u=bob', ipfsHash: generateIpfsHash() },
  { id: 3, name: 'Charlie Davis', party: 'Open Source Coalition', voteCount: 201, image: 'https://i.pravatar.cc/150?u=charlie', ipfsHash: generateIpfsHash() },
  { id: 4, name: 'Diana Prince', party: 'National Unity Alliance', voteCount: 342, image: 'https://i.pravatar.cc/150?u=diana', ipfsHash: generateIpfsHash() },
  { id: 5, name: 'Ethan Hunt', party: 'Progressive Green Front', voteCount: 120, image: 'https://i.pravatar.cc/150?u=ethan', ipfsHash: generateIpfsHash() },
  { id: 6, name: 'Fiona Gallagher', party: 'Liberty & Justice Movement', voteCount: 287, image: 'https://i.pravatar.cc/150?u=fiona', ipfsHash: generateIpfsHash() }
];

function App() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [user, setUser] = useState(null); // { id, aadhaar, hasVoted, txHash, isAdmin }
  const [electionActive, setElectionActive] = useState(true);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000)); // +24 hours
  const [registeredVoters, setRegisteredVoters] = useState([
    { aadhaar: '111122223333', name: 'Existing User', region: 'Delhi', city: 'New Delhi', phone: '9876543210', pincode: '110001' }
  ]); // Mock existing db
  const [voteTransactions, setVoteTransactions] = useState([]); // Blockchain ledger mock

  const registerUser = (aadhaar, pan, name, region, city, phone, pincode) => {
    if (aadhaar.length !== 12) {
      return { success: false, error: 'Invalid Aadhaar (Requires 12 digits)' };
    }
    const exists = registeredVoters.find(v => v.aadhaar === aadhaar);
    if (exists) {
      return { success: false, error: 'Profile already exists! A person can only create one profile. Please login.' };
    }
    const newUser = { aadhaar, name, region, city, phone, pincode };
    setRegisteredVoters([...registeredVoters, newUser]);
    
    // Auto-login after successful registration
    setUser({ id: `user-${aadhaar.slice(0, 4)}`, aadhaar, name, region, city, phone, pincode, hasVoted: false, role: 'voter' });
    return { success: true };
  };

  const loginUser = (aadhaar, password) => {
    // Fake Aadhaar Verification Simulation
    if (password === 'admin123') {
      setUser({ id: 'admin-1', index: aadhaar, hasVoted: false, role: 'admin', name: 'System Admin', region: 'Central', city: 'Headquarters' });
      return { success: true };
    }
    if (password === 'audit123') {
      setUser({ id: 'auditor-1', index: aadhaar, hasVoted: false, role: 'auditor', name: 'Chief Auditor', region: 'Federal', city: 'HQ' });
      return { success: true };
    }
    
    if (aadhaar.length === 12) {
      const voter = registeredVoters.find(v => v.aadhaar === aadhaar);
      if (!voter) {
        return { success: false, error: 'Aadhaar not found. Please create a profile first.' };
      }
      setUser({ id: `user-${aadhaar.slice(0, 4)}`, ...voter, hasVoted: false, role: 'voter' });
      return { success: true };
    }
    return { success: false, error: 'Invalid Aadhaar (Requires 12 digits)' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser({ ...user, ...updatedFields });
    const newVoters = registeredVoters.map(v => v.aadhaar === user.aadhaar ? { ...v, ...updatedFields } : v);
    setRegisteredVoters(newVoters);
  };

  const castVote = (candidateId, digitalSignature) => {
    if (!electionActive || new Date() >= deadline) return { success: false, error: 'Election is closed.' };
    if (user?.hasVoted) return { success: false, error: 'You have already voted.' };

    const expectedSignature = `SIG-${user.id}-${user.aadhaar?.slice(-4)}`;
    if (digitalSignature !== expectedSignature) {
      return { success: false, error: 'Cryptographic identity signature verification failed. Vote rejected by backend.' };
    }

    const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
    ));
    
    const targetCandidate = candidates.find(c => c.id === candidateId);
    const encryptedPayload = 'E2E-' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    setVoteTransactions([...voteTransactions, {
      txHash,
      voterId: user.id || `user-anon`,
      voterName: user.name || 'N/A',
      voterAadhaar: user.aadhaar || 'N/A',
      voterPhone: user.phone || 'N/A',
      voterLocation: `${user.city || 'N/A'}, ${user.region || 'N/A'}`,
      candidateName: 'ENCRYPTED_PAYLOAD',
      encryptedPayload,
      digitalSignature,
      timestamp: new Date().toLocaleString()
    }]);
    
    setUser({ ...user, hasVoted: true, votedCandidateId: candidateId, txHash });
    return { success: true, txHash };
  };

  const addCandidate = (name, party, ipfsHash) => {
    const newId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
    setCandidates([...candidates, { id: newId, name, party, voteCount: 0, image: `https://i.pravatar.cc/150?u=${newId}`, ipfsHash: ipfsHash || generateIpfsHash() }]);
  };

  const toggleElection = () => {
    setElectionActive(!electionActive);
  };

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navigation user={user} logout={logout} />
        <main className="flex-grow-1 py-4 container">
          <Routes>
            <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? "/admin" : user.role === 'auditor' ? "/history" : "/vote") : "/login"} />} />
            <Route path="/login" element={!user ? <Login onLogin={loginUser} onRegister={registerUser} /> : <Navigate to={user.role === 'admin' ? "/admin" : user.role === 'auditor' ? "/history" : "/vote"} />} />
            <Route path="/vote" element={user && user.role === 'voter' ? <Vote candidates={candidates} castVote={castVote} user={user} updateUser={updateUser} electionActive={electionActive} deadline={deadline} /> : <Navigate to="/login" />} />
            <Route path="/results" element={<Results candidates={candidates} electionActive={electionActive} />} />
            <Route path="/history" element={<RegistrationHistory registeredVoters={registeredVoters} voteTransactions={voteTransactions} />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel candidates={candidates} addCandidate={addCandidate} toggleElection={toggleElection} electionActive={electionActive} registeredVoters={registeredVoters} voteTransactions={voteTransactions} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
