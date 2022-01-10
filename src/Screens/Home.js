import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../Config/FirebaseConfig';
import { Form, Button } from 'react-bootstrap';

function Signup() {

    const history = useHistory();
    const [email, setEmail] = useState();
    const [userId, setUserid] = useState();
    const [isNewUser, setIsNewUser] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setdata] = useState([]);

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setEmail(user.email);
                setUserid(user.uid);
            }
            else {
                if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
                    var email = window.localStorage.getItem('emailForSignIn');
                    if (!email) {
                        history.push("/Signup");
                    }
                    firebase.auth().signInWithEmailLink(email, window.location.href)
                        .then((result) => {
                            console.log(result.user.email);
                            setEmail(result.user.email);
                            setUserid(result.user.uid);

                            window.localStorage.removeItem('emailForSignIn');

                            if (result.additionalUserInfo.isNewUser) {
                                firebase.database().ref("users/" + result.user.uid).set({
                                    email: result.user.email
                                })
                            }

                        })
                        .catch((error) => {
                            console.log(error)
                        });
                }
                else{
                    history.push("/")
                }

            }
        })
        var items = [];
        firebase.database().ref("steps").once("value", function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val());
                items.push({
                    stepTitle: childSnapshot.key,
                })
            })
        }).then(() => {
            setdata(items);
            // setIsNewUser(true)
            setIsLoading(false);
        })

    }, [])

    function LogoutUser() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            history.push("/Signup");
        }).catch((error) => {
            // An error happened.
        });
    }

    function subscribe() {
        var selectedSteps = [];
        var cboxes = document.getElementsByName('steps[]');
        var len = cboxes.length;
        for (var i = 0; i < len; i++) {
            if (cboxes[i].checked) {
                selectedSteps.push(cboxes[i].value);
            }
        }
        if (selectedSteps.length) {
            console.log(selectedSteps);
            console.log(userId);
            fetch("http://localhost:5000/steps/followSteps", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    stepName: selectedSteps,
                    userid: userId,
                    useremail: email
                })
            }).then(r => r.json().then(data => {
                if (!r.ok) {
                    console.log(data.message)
                }
                else {
                    alert("successfully subscribe");
                }
            }))
        }

    }

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
            <h2>Welcome to kurateDAO </h2>
            {/* <h3>Userid : {userId}</h3>
            <h5>your email : {email}</h5> */}
            <br />
            <div>
                <h4>select sets and press subscribe</h4>
                <br />
                {!isLoading && data.length && data.map((items, index) => {
                    console.log(items)
                    return <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Form.Check
                                label={items.stepTitle}
                                name="steps[]"
                                value={items.stepTitle}
                                className='steps'
                                type="checkbox"
                            />
                        </div>
                    </div>
                })}
                <br />
                <Button onClick={() => subscribe()}>subscribe</Button>
            </div>
            <br />
            <Button variant='danger' onClick={() => LogoutUser()}>Logout</Button>
        </div>
    )

}

export default Signup;
