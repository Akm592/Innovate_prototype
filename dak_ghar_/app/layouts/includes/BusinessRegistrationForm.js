import React, { useState } from 'react';

const BusinessRegistrationForm = () => {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [gstCertificate, setGstCertificate] = useState('');
  const [importCode, setImportCode] = useState('');
  const [rcmcCertificate, setRcmcCertificate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform registration logic here
    // You can send the form data to an API or perform any other action
    // Don't forget to handle form validation as well
    
    // Reset the form after submission
    setBusinessName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setGstNumber('');
    setGstCertificate('');
    setImportCode('');
    setRcmcCertificate('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Business Registration</h2>
      
      <label htmlFor="businessName">Business Name</label>
      <input 
        type="text" 
        id="businessName" 
        value={businessName} 
        onChange={(e) => setBusinessName(e.target.value)} 
        required 
      />

      <label htmlFor="contactName">Contact Name</label>
      <input 
        type="text" 
        id="contactName" 
        value={contactName} 
        onChange={(e) => setContactName(e.target.value)} 
        required 
      />

      <label htmlFor="email">Email</label>
      <input 
        type="email" 
        id="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />

      <label htmlFor="phone">Phone</label>
      <input 
        type="tel" 
        id="phone" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        required 
      />

      <label htmlFor="gstNumber">GST Number</label>
      <input 
        type="text" 
        id="gstNumber" 
        value={gstNumber} 
        onChange={(e) => setGstNumber(e.target.value)} 
        required 
      />

      <label htmlFor="gstCertificate">GST Certificate</label>
      <input 
        type="file" 
        id="gstCertificate" 
        onChange={(e) => setGstCertificate(e.target.value)} 
        required 
      />

      <label htmlFor="importCode">Import Code</label>
      <input 
        type="text" 
        id="importCode" 
        value={importCode} 
        onChange={(e) => setImportCode(e.target.value)} 
        required 
      />

      <label htmlFor="rcmcCertificate">RCMC Certificate</label>
      <input 
        type="file" 
        id="rcmcCertificate" 
        onChange={(e) => setRcmcCertificate(e.target.value)} 
        required 
      />

      <button type="submit">Register</button>
    </form>
  );
}

export default BusinessRegistrationForm;