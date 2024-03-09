'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './login.css';
import Link from 'next/link';

export default function HomePage() {

  // Create state variables to manage form input values
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    // Function to handle form submission
    const handleSubmit = (event:any) => {
      event.preventDefault(); // Prevent the default form submission behavior
      
      // Perform your authentication logic here
      // For example, you can send a request to your server to validate the credentials
      
      // If authentication is successful, you can redirect the user to the dashboard
      // Replace this with your actual authentication logic
      if (userName === 'admin' && password === 'admin123') {
        // Redirect the user to the dashboard
        window.location.href = '/dashboard';
      } else {
        // Display an error message for invalid credentials
        setErrorMessage('Invalid username or password');
      }
    };


  return (
    <div style={{ background: "#F2F6FC" }}>
      <Container fluid className="">
        <Row className="align-items-center">
          <Col className="rounded-5  p-5 py-3 d-flex vh-100 loginBg" xs={7} >
            <div className="text-center text-lg-center p-2">
              <h3 className="techPointsSec display-6 fw-bold lh-1 text-body-emphasis mb-3 ftColorWhite px-2">React App Demo</h3>
              <div className=''>
                <div className='techPoints'>
                  <p className="loginPar mt-1" style={{ color: "#C5D5FC" }}> <b>Front-end stack : -</b> <br></br>React, Next.js, RESTful APIs, GraphQL, TypeScript, RxJS, Redux, AG-Grid, UI, Figma UX, Tailwind CSS, React Bootstrap, D3 Charts and Cypress.</p>
                </div>
                <div className='techPoints'>
                  <p className="loginPar mt-1" style={{ color: "#C5D5FC" }}><b>Back-end stack :-</b> <br></br>AWS, Node.js, Python, GraphQL, AWS (Amplify, AppSync, CloudFront, Lambda, APIs, DynamoDB, EKS, ECS, Fargate, S3, IAM, Cognito, CodeBuild), JWT, Docker and Kubernetes.</p>
                </div>
              </div>
              <div>
                <img src='../../bannerimage.png' className='img-fluide' />
              </div>
            </div>
          </Col>
          <Col xs={5} className="d-flex justify-content-center align-items-center">
            <div style={{ width: "450px" }} >
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-block" }}>
                  <img src="../../logo.png" style={{ height: "42px" }} />
                </div>
              </div>
              <br></br>
              <br></br>
              <form className="p-4 p-md-5 border rounded-3 bgWhi" onSubmit={handleSubmit}>
      <div className="text-center display-7">Sign in</div>
      <br></br>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="form-floating mb-3">
        <input
          className="form-control"         
          value={userName}
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <label>Username</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
      </div>
      <br></br>
      <button className="w-100 btn btn-lg btn-primary" type="submit">Sign In</button>     
    </form>
            </div>
          </Col>
        </Row>

      </Container>

    </div>
  )
}
