import React, { useState } from 'react';
import { Card, Form, Button, Alert, Nav, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Lock, ShieldAlert, FileText, Upload, User, MapPin, Phone, CheckCircle, Eye } from 'lucide-react';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", 
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const Login = ({ onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [aadhaar, setAadhaar] = useState('');
  const [showBiometric, setShowBiometric] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [biometricType, setBiometricType] = useState('Fingerprint');
  const [pan, setPan] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [isFetchingPin, setIsFetchingPin] = useState(false);
  const [password, setPassword] = useState(''); // Used for admin
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      setIsFetchingPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0]?.Status === "Success") {
          const fetchedState = data[0].PostOffice[0].State;
          const fetchedCity = data[0].PostOffice[0].District || data[0].PostOffice[0].Block;
          if (fetchedState) {
            setRegion(fetchedState);
          }
          if (fetchedCity) {
            setCity(fetchedCity);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pincode data", err);
      } finally {
        setIsFetchingPin(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Require biometric for normal voters and profile creation. Skip for admins who input password.
    if (password) {
      executeSubmit();
      return;
    }

    if (aadhaar.length < 4) {
      setError('Please enter Aadhaar to continue biometric verification.');
      return;
    }

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
        executeSubmit();
      }, 1000);
    }, 2500);
  };

  const executeSubmit = () => {
    setIsVerifying(true);
    
    // Simulate API delay for verification/registration
    setTimeout(() => {
      let res;
      if (isLoginMode) {
        res = onLogin(aadhaar, password);
      } else {
        if (!pan || pan.length < 10) {
          res = { success: false, error: 'Valid 10-character PAN required for profile creation.' };
        } else if (!name.trim() || !region.trim() || !city.trim() || !phone.trim() || phone.length < 10 || !pincode.trim() || pincode.length < 6) {
          res = { success: false, error: 'Full Name, valid Phone, valid PIN Code, City, and Region/State are required.' };
        } else {
          res = onRegister(aadhaar, pan, name.trim(), region.trim(), city.trim(), phone.trim(), pincode.trim());
        }
      }
      
      if (!res.success) {
        setError(res.error);
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="d-flex justify-content-center align-items-center h-100 mt-5 mb-5"
    >
      <Card className="glass-card border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Header className="bg-transparent border-0 pt-4 pb-0">
          <Nav variant="pills" className="justify-content-center w-100 bg-dark rounded-pill p-1">
            <Nav.Item className="w-50 text-center">
              <Nav.Link 
                className={`rounded-pill ${isLoginMode ? 'bg-primary text-white' : 'text-muted'}`}
                onClick={() => { setIsLoginMode(true); setError(''); }}
              >
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="w-50 text-center">
              <Nav.Link 
                className={`rounded-pill ${!isLoginMode ? 'bg-primary text-white' : 'text-muted'}`}
                onClick={() => { setIsLoginMode(false); setError(''); }}
              >
                Create Profile
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body className="p-4 p-md-5 pt-4">
          <div className="text-center mb-4">
            <div className="bg-dark rounded-circle d-inline-flex p-3 mb-3 border border-secondary shadow-lg">
              <Fingerprint size={40} className="text-primary" />
            </div>
            <h3 className="fw-bold text-white mb-1">
              {isLoginMode ? 'Identity Verification' : 'Voter Profile Setup'}
            </h3>
            <p className="text-light opacity-75 small">
              {isLoginMode 
                ? 'Please verify your identity to access the decentralized voting portal.' 
                : 'Create your secure, one-time profile with Aadhaar and PAN verification.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert variant="danger" className="bg-danger text-light border-0 d-flex gap-2 p-2 px-3 small align-items-center">
                  <ShieldAlert size={16} className="min-w-max" /> <span>{error}</span>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                <Lock size={14} /> Aadhaar Number
              </Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter 12-digit format" 
                className="form-control-dark py-2"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                required 
              />
              {!isLoginMode && (
                <Form.Text className="text-light opacity-75 small">
                  Your Aadhaar acts as your unique blockchain identifier.
                </Form.Text>
              )}
            </Form.Group>
            
            {!isLoginMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key="register-fields">
                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <User size={14} /> Full Name
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your legal name" 
                    className="form-control-dark py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} /> PIN Code
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter 6-digit PIN code" 
                    className="form-control-dark py-2"
                    value={pincode}
                    onChange={handlePincodeChange}
                    required 
                  />
                  {isFetchingPin && <Form.Text className="text-info small">Tracking Location...</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} /> City / District
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Auto-fetched city" 
                    className="form-control-dark py-2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} /> Region / State
                  </Form.Label>
                  <Form.Select 
                    className="form-control-dark py-2"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required 
                  >
                    <option value="">Choose State...</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <Phone size={14} /> Phone Number
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter 10-digit mobile number" 
                    className="form-control-dark py-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <FileText size={14} /> PAN Card Number
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter 10-character PAN" 
                    className="form-control-dark py-2 text-uppercase"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                    <Upload size={14} /> Supporting KYC Document
                  </Form.Label>
                  <Form.Control 
                    type="file" 
                    className="form-control-dark py-2"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <Form.Text className="text-info small d-flex align-items-center gap-1 mt-1">
                    <ShieldAlert size={12}/> One-time upload constraint strictly enforced.
                  </Form.Text>
                </Form.Group>
              </motion.div>
            )}

            {isLoginMode && (
              <Form.Group className="mb-4">
                <Form.Label className="small text-light opacity-75 mb-1 d-flex align-items-center gap-1">
                  <Lock size={14} /> System Node Key (For Admin / Auditor)
                </Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Leave blank for regular voters" 
                  className="form-control-dark py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            )}

            <Button 
              type="submit" 
              className="btn-gradient w-100 py-2 rounded-3 fw-medium d-flex justify-content-center align-items-center gap-2"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {isLoginMode ? 'Verifying Identity...' : 'Creating Immutable Profile...'}
                </>
              ) : (
                isLoginMode ? 'Secure Login' : 'Complete Profile Setup'
              )}
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <p className="small text-light opacity-75 mb-0 d-flex justify-content-center align-items-center gap-1">
              <ShieldAlert size={14} className="text-warning"/> Data is end-to-end encrypted and never stored.
            </p>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showBiometric} onHide={() => !isScanning && setShowBiometric(false)} centered contentClassName="glass-card border-0 text-white">
        <Modal.Header className="border-secondary border-opacity-25" closeButton={!isScanning} closeVariant="white">
          <Modal.Title className="fs-5 d-flex align-items-center">
            {biometricType === 'Fingerprint' && <Fingerprint className="me-2 text-primary" size={20} />}
            {biometricType === 'Facial Recognition' && <User className="me-2 text-primary" size={20} />}
            {biometricType === 'Iris Scan' && <Eye className="me-2 text-primary" size={20} />}
            Biometric Authentication
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4 d-flex flex-column align-items-center w-100">
          {scanSuccess ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
              <CheckCircle size={64} className="text-success mb-3" />
              <h5 className="text-white fw-bold">Identity Verified</h5>
              <p className="text-light opacity-75 small">Unique {biometricType} hash mapped securely.</p>
            </motion.div>
          ) : (
            <div className="d-flex flex-column align-items-center w-100">
              {!isScanning && (
                <div className="w-100 px-4 mb-4">
                  <Form.Label className="small text-light opacity-75">Select Biometric Method</Form.Label>
                  <Form.Select 
                    className="form-control-dark bg-dark text-white border-secondary"
                    value={biometricType}
                    onChange={(e) => setBiometricType(e.target.value)}
                  >
                    <option value="Fingerprint">Fingerprint Scan</option>
                    <option value="Facial Recognition">Facial Recognition (Face ID)</option>
                    <option value="Iris Scan">Retinal / Iris Scan</option>
                  </Form.Select>
                </div>
              )}
              
              <motion.div 
                animate={isScanning ? { scale: [1, 1.1, 1], opacity: [1, 0.5, 1] } : {}} 
                transition={isScanning ? { repeat: Infinity, duration: 1.5 } : {}}
              >
                {biometricType === 'Fingerprint' && <Fingerprint size={80} className={`${isScanning ? 'text-info' : 'text-primary opacity-50'} mb-3`} />}
                {biometricType === 'Facial Recognition' && <User size={80} className={`${isScanning ? 'text-info' : 'text-primary opacity-50'} mb-3`} />}
                {biometricType === 'Iris Scan' && <Eye size={80} className={`${isScanning ? 'text-info' : 'text-primary opacity-50'} mb-3`} />}
              </motion.div>
              
              <h5 className="fw-bold mb-2">{isScanning ? `Processing ${biometricType}...` : 'Require Unique Biometric'}</h5>
              <p className="small text-light opacity-75 mb-4 px-2">
                {isLoginMode ? `Please complete ${biometricType} to authenticate Aadhaar` : `Please complete ${biometricType} to link securely with Aadhaar`} <strong className="font-monospace ms-1">{aadhaar.slice(0, 4)}********</strong>
              </p>
              
              <Button 
                variant={isScanning ? "outline-info" : "primary"} 
                className={`rounded-pill px-4 py-2 ${!isScanning && 'btn-gradient'}`}
                onClick={handleBiometricScan}
                disabled={isScanning}
              >
                {isScanning ? 'Verifying...' : (isLoginMode ? `Start ${biometricType}` : `Register ${biometricType}`)}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default Login;
