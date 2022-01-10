import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../Config/FirebaseConfig';
import { Form, Dropdown, Modal, Button } from 'react-bootstrap';

function Signup() {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setdata] = useState([]);
    const [stepName, setStepname] = useState();
    const [AdddataModal, setAdddataModal] = useState(false);

    const [selectedStep, setSelectedStep] = useState();
    const [textvalue, updatetextValue] = useState()

    useEffect(() => {
        var items = [];
        firebase.database().ref("steps").once("value", function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val());
                items.push({
                    stepTitle: childSnapshot.key,
                    stepdata: childSnapshot.val()
                })
            })
        }).then(() => {
            setdata(items);
            setIsLoading(false);
        })
    }, [isLoading]);

    function AddSteps() {
        setIsLoading(true)
        fetch("http://localhost:5000/steps/AddSteps", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                stepName: stepName,
            })
        }).then(r => r.json().then(data => {
            if (!r.ok) {
                console.log(data.message)
            }
            else {
                setIsLoading(false)
                setAdddataModal(false);
            }
        }))
    }

    function deleteStep(name) {
        setIsLoading(true);
        fetch("http://localhost:5000/steps/DeleteStep", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                stepName: name,
            })
        }).then(r => r.json().then(data => {
            if (!r.ok) {
                console.log(data.message)
            }
            else {
                setIsLoading(false)
                setAdddataModal(false)
            }
        }))
    }

    function UpdateStep() {
        setIsLoading(true);
        firebase.database().ref("steps/" + selectedStep).push({
            text: textvalue
        }).then(() => {
            fetch(`http://localhost:5000/steps/set/:${selectedStep}/mintElement`)
                .then(r => r.json().then(data => {
                    if (!r.ok) {
                        console.log(data.message)
                    }
                    else {
                        setIsLoading(false)
                        setAdddataModal(false);
                        updatetextValue(null);
                    }
                }))
        })

    }

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                <h2>Admin Dashboard</h2>
                Sets :
                {
                    !isLoading && data.length && data.map((items, index) => {
                        console.log(items.stepdata)
                        return <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <h3>{items.stepTitle}</h3>
                                <Button style={{ marginLeft: 20 }} onClick={() => { setAdddataModal(true); setSelectedStep(items.stepTitle) }}>Add</Button>
                                <Button onClick={() => deleteStep(items.stepTitle)} style={{ marginLeft: 20 }} variant='danger'>delete</Button>
                            </div>
                            <div style={{ padding: 20, textAlign: "left" }}>
                                {Object.keys(items.stepdata).map((items2, index2) => {
                                    return items.stepdata[items2].text ? <>{index2 + " - " + items.stepdata[items2].text} <br /></> : null
                                })}
                            </div>
                        </div>
                    })
                }
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
                {!AdddataModal && <div>
                    <p>You can add set :)</p>
                    <br />
                    <Form.Control type="text" placeholder='type set name here' onChange={(e) => setStepname(e.target.value)} />
                    <br />
                    <Button disabled={stepName ? false : true} onClick={() => AddSteps()}>Add More sets</Button>
                </div>}
                {AdddataModal && <div>
                    <p>Type text and click update to update your sets..</p>
                    <br />
                    <Form.Control type="text" placeholder='Type text here' onChange={(e) => updatetextValue(e.target.value)} />
                    <br />
                    <Button disabled={textvalue ? false : true} onClick={() => UpdateStep()} style={{ marginTop: 10 }}>Update sets</Button>
                </div>}
            </div>

            <br />
        </div>
    )

}

export default Signup;
