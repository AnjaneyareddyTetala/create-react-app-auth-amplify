import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';

import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'ap-south-1',
    userPoolId: 'ap-south-1_2V1Ut5oi4',
    userPoolWebClientId: '1k7bmoirdls7do8qb2e5omii7u',
  },
  Storage: { 
    region: 'ap-south-1', 
    bucket: 'hackathonbucketname'
  }
});

import { Auth } from 'aws-amplify';

signUp = async event => {
  const params = {
    username: this.state.email,
    password: getRandomString(30),
    attributes: {
      name: this.state.fullName
    }
  };
  await Auth.signUp(params);
};

function getRandomString(bytes) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues).map(intToHex).join('');
}

function intToHex(nr) {
  return nr.toString(16).padStart(2, '0');
}

signIn = () => { 
    try { 
        user = await Auth.signIn(this.state.email);
        this.setState({ user });
    } catch (e) { 
        console.log('Oops...');
    } 
};


import Webcam from "react-webcam";

// Instantiate and set webcam to open and take a screenshot
// when user is presented with a custom challenge

/* Webcam implementation goes here */


// Retrieves file uploaded to S3 and sends as a File to Rekognition 
// as answer for the custom challenge
dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
};

sendChallengeAnswer = () => {

    // Capture image from user camera and send it to S3
    const imageSrc = this.webcam.getScreenshot();
    const attachment = await s3UploadPub(dataURLtoFile(imageSrc, "id.png"));
    
    // Send the answer to the User Pool
    const answer = `public/${attachment}`;
    user = await Auth.sendCustomChallengeAnswer(cognitoUser, answer);
    this.setState({ user });
    
    try {
        // This will throw an error if the user is not yet authenticated:
        await Auth.currentSession();
    } catch {
        console.log('Apparently the user did not enter the right code');
    }
    
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
