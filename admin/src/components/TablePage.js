import { Table, Modal, Button, InputGroup, FormControl, Row, Col, Form } from 'react-bootstrap'
import DatePicker from "react-datepicker"
import { useState, useEffect } from 'react'

import "react-datepicker/dist/react-datepicker.css"

const TablePage = props => {
    const editUserPhoto = "https://img.icons8.com/windows/344/edit-user.png"
    const removeUserPhoto = "https://img.icons8.com/windows/344/remove-user-male--v3.png"
    const buttonStyle = { background: "none", border: "none" }

    const [usersList, setUsersList] = useState([])
    const [isLoginSuccessful, setLoginSuccess] = useState(false)
    const [currentSelectedUser, setCurrentSelectedUser] = useState({})

    const [showUpadeUserWindow, setShowUpadeUserWindow] = useState(false)
    const [showAddUserWindow, setShowAddUserWindow] = useState(false)

    const removeUser = key => {
        fetch(`${props.apiServer}/remove_user?adminApiKey=${props.adminApiKey}&key=${key}`)
        .then(response => response.json()).then(response => {
            if (response.deletedCount === 1) {
                setUsersList(usersList.filter(user => user.key !== key))
            }
        })
    }

    useEffect(() => {
        try {
            fetch(`${props.apiServer}/get_users?adminApiKey=${props.adminApiKey}`)
            .then(response => response.json()).then(response => {
                setLoginSuccess(response.isLoginSuccess)
                setUsersList(response.users)
            })
        } catch (error) {
            setLoginSuccess(false)
            setUsersList([])
        }
    }, [])
    return (<>
        <AddUserButton
            isLoginSuccessful={isLoginSuccessful}
            setShowAddUserWindow={setShowAddUserWindow}
        />

        <AddUserModal
            setShowAddUserWindow={setShowAddUserWindow}
            showAddUserWindow={showAddUserWindow}
            usersList={usersList}
            setUsersList={setUsersList}
            adminApiKey={props.adminApiKey}
            apiServer={props.apiServer}
        />

        <Table hover>
            <thead>
                <tr>
                    <th>#</th> <th>Username</th> <th>Has trial</th> 
                    <th>Start</th> <th>End</th> <th></th>
                </tr>
            </thead>
            <tbody>
                {usersList.map((user, index) =>
                    <tr>
                        <td>{index}</td>
                        <td>{user.username}</td>
                        <td>{user.has_trial ? "Yes" : "No"}</td>
                        <td>{user.start_preiod_date}</td>
                        <td>{user.end_preiod_date}</td>
                        <td>
                            <button style={buttonStyle} onClick={() => {
                                setCurrentSelectedUser(user)
                                setShowUpadeUserWindow(true)
                            }}>
                                <img src={editUserPhoto} style={{width: "25px"}}/>
                            </button>
                            <button style={buttonStyle} onClick={()=>removeUser(user.key)}>
                                <img src={removeUserPhoto} style={{width: "25px"}}/>
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        <UpdateUserModal 
            showUpadeUserWindow={showUpadeUserWindow}
            setShowUpadeUserWindow={setShowUpadeUserWindow}
            currentSelectedUser={currentSelectedUser}
            setCurrentSelectedUser={setCurrentSelectedUser}
            adminApiKey={props.adminApiKey}
            apiServer={props.apiServer}
        />
    </>)
}

const UpdateUserModal = props => {
    const [userPeriodDate, setUserPeriodDate] = useState(new Date())
    const [username, setUsername] = useState('')
    const [userHasTrial, setUserTrial] = useState(false)

    return (
        <Modal
            show={props.showUpadeUserWindow}
            onHide={()=>props.setShowUpadeUserWindow(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Update user info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Username</h6>
                <InputGroup className="mb-3" style={{marginBottom: "15px"}}>
                    <FormControl
                        placeholder={props.currentSelectedUser.username}
                        onChange={event => setUsername(event.target.value)}
                        aria-label="username"
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        
                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&username=${username}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                newUserObject.username = username
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>
                        Save
                    </Button>
                </InputGroup>

                <h6>End date</h6>
                <Row>
                    <Col>
                    <DatePicker
                        selected={new Date(userPeriodDate)}
                        onChange={(date)=> setUserPeriodDate(date)} 
                    />
                    </Col>
                    <Col>
                        <Button variant="outline-secondary" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        
                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&end_preiod_date=${userPeriodDate}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                newUserObject.end_preiod_date = new Date(userPeriodDate).toLocaleString()()
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>Save</Button>
                    </Col>
                </Row>
                <h6>Has trival</h6>
                <Row>
                    <Col>
                        <Form.Select
                            onChange={event => setUserTrial(event.target.value)}
                        >
                            <option>Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Button variant="outline-secondary" onClick={async() => {
                        const key = props.currentSelectedUser.key
                        const hasTrial = userHasTrial === "yes"
                        
                        await fetch(`${props.apiServer}/edit_user?adminApiKey=${props.adminApiKey}&key=${key}&has_trial=${hasTrial}`)
                        .then(async response => await response.json()).then(async response => {
                            if (response.modifiedCount === 1) {
                                let newUserObject = props.currentSelectedUser
                                newUserObject.has_trial = userHasTrial === "yes"
                                props.setCurrentSelectedUser(newUserObject)
                            }
                        })
                    }}>Save</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

const AddUserModal = props => {
    const [userPeriodDate, setUserPeriodDate] = useState(new Date())
    const [username, setUsername] = useState('')

    return (
        <Modal
            show={props.showAddUserWindow}
            onHide={()=>props.setShowAddUserWindow(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add user
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h6>Username</h6>
                <FormControl
                    style={{marginBottom: "15px"}}
                    defaultValue={username}
                    onChange={event => setUsername(event.target.value)}
                    aria-label="username"
                    aria-describedby="basic-addon2"
                />

                <h6>End date</h6>
                <DatePicker
                    selected={new Date(userPeriodDate)}
                    onChange={(date)=> setUserPeriodDate(date)} 
                />

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => {
                    fetch(`${props.apiServer}/add_user?adminApiKey=${props.adminApiKey}&username=${username}&end_preiod_date=${userPeriodDate}`)
                    .then(response => response.json()).then(newCreatedUser => {
                        alert(JSON.stringify(newCreatedUser ? newCreatedUser.key : "Error" ))
                        props.setUsersList(props.usersList.concat([newCreatedUser]))
                        props.setShowAddUserWindow(false)
                        setUsername("")
                    })
                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    ) 
}

const AddUserButton = props => {
    const addUserPhoto = "https://img.icons8.com/windows/344/add-user-male--v1.png"
    const buttonStyle = {
        background: "none",
        border: "none"
    }
    if (!props.isLoginSuccessful) return (<></>)
    return (
        <div style={{textAlign: "end"}}>
            <button style={buttonStyle} onClick={()=>props.setShowAddUserWindow(true)}>
                <img src={addUserPhoto} style={{width: "35px"}}/>
            </button>
        </div>
    )
}

export default TablePage