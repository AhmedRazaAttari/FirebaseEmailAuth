import React, { useState, useEffect } from 'react';
// import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import firebase from '../Config/FirebaseConfig';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function Signup() {

    const history = useHistory();
    const [email, setEmail] = useState();
    const [adminEmail, setadminEmail] = useState();
    const [adminPass, setAdminpass] = useState();

    const actionCodeSettings = {
        url: 'http://localhost:3000/home',
        // This must be true.
        handleCodeInApp: true,
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                history.push("/home")
            }
        })
    })

    function SendLink() {
        if (email !== "" && email !== undefined) {
            firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    alert("Email sent to your address! please check email");
                    window.localStorage.setItem('emailForSignIn', email);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
        else {
            alert("Please enter email")
        }

    }

    function AdminLogin() {
        if (adminEmail !== "" && adminEmail !== undefined && adminPass !== "" && adminPass !== undefined) {
            if (adminEmail === "admin@example.com" && adminPass === "12345678") {
                history.push("/Dashboard");
            }
            else {
                alert("admin credential not matched !")
            }
        }
    }

    return (
        <div className='mainDiv'>
            <div className='userLogin'>
                <h2 style={{ textAlign: "center" }}>User Login</h2>
                <br />
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                <small>we will send link to your email and onclick on link you can proceed</small>
                <br />
                <Button onClick={() => SendLink()} variant='primary'>Send Link</Button>
            </div>
            {/* <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                User Login<br />
                <input type="email" placeholder='enter your email' onChange={(e) => setEmail(e.target.value)} />
                <br />
                <button onClick={() => SendLink()}>Send Link to email</button>
            </div> */}
            <div className='adminLogin'>
                <h2 style={{ textAlign: "center" }}>Admin Login</h2>
                <br />
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setadminEmail(e.target.value)} />
                <Form.Label>Enter Password</Form.Label>
                <Form.Control type="password" placeholder="Enter email" onChange={(e) => setAdminpass(e.target.value)} />

                <br />
                <Button onClick={() => AdminLogin()} variant='primary'>Login</Button>
            </div>
            {/* <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                admin Login<br />
                <input type="email" placeholder='enter admin email' onChange={(e) => setadminEmail(e.target.value)} />
                <br />
                <input type="password" placeholder='enter admin password' onChange={(e) => setAdminpass(e.target.value)} />
                <br />
                <button onClick={() => AdminLogin()}>Login</button>
            </div> */}
        </div>
    )

}

export default Signup;
