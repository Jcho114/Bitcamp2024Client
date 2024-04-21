import { useState } from 'react';

const Contact = () => {
  // State to manage whether the form has been submitted
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    setSubmitted(true); // Update the state to indicate the form has been submitted
  };

  return (
    <div className="contact-page-wrapper">
      <h1 className="primary-heading">Ask us a Question</h1>
      {!submitted ? (
        <div className="contact-form-container">
          {/* Attach the handleSubmit function to the button's onClick event */}
          <input type="text" placeholder="enter your email..." />
          <button className="secondary-button" onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <p className="response-message">We will contact you asap</p> // Ensure this element is correctly rendered
      )}
    </div>
  );
};

export default Contact;