import { Row, Col, Card, Button, Modal, FormControl, FloatingLabel, Form } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const PostsPage = props => {
    const [postsList, setPostsList] = useState([])
    const [isLoginSuccessful, setLoginSuccess] = useState(false)
    const [showAddPostWindow, setShowAddPostWindow] = useState(false)

    useEffect(() => {try {
        fetch(`${props.apiServer}/get_posts?adminApiKey=${props.adminApiKey}`)
        .then(response => response.json()).then(response => {
            setLoginSuccess(response.isLoginSuccess)
            setPostsList(response.posts)
        })
    } catch (error) {
        console.error(error)
        setLoginSuccess(false)
        setPostsList([])
    }}, [])

    return (<>
        <AddPostButton
            isLoginSuccessful={isLoginSuccessful}
            setShowAddPostWindow={setShowAddPostWindow}
        />
        <AddPostModal
            showAddPostWindow={showAddPostWindow}
            setShowAddPostWindow={setShowAddPostWindow}
            apiServer={props.apiServer}
            adminApiKey={props.adminApiKey}
            isLoginSuccessful={isLoginSuccessful}
            setPostsList={setPostsList}
            postsList={postsList}
        />
        <Row m={1} md={3} className="g-4">
            {postsList.map(post => 
                <Col>
                    <Card>
                        <Card.Img variant="top" src={post.image} />
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>
                                {post.discription}
                            </Card.Text>
                        </Card.Body>
                        <RemovePostButton
                            post={post}
                            apiServer={props.apiServer}
                            adminApiKey={props.adminApiKey}
                            isLoginSuccessful={isLoginSuccessful}
                            setPostsList={setPostsList}
                            postsList={postsList}
                        />
                    </Card>
                </Col> 
            )}
        </Row>
    </>)
}

const RemovePostButton = props => {
    if (!props.isLoginSuccessful) return (<></>)
    return (
        <Card.Footer>
            <Button variant="outline-secondary" onClick={() => {
                fetch(`${props.apiServer}/remove_post?adminApiKey=${props.adminApiKey}&_id=${props.post._id}`)
                .then(response => response.json()).then(response => {
                    if (response.deletedCount === 1) {
                        props.setPostsList(props.postsList.filter(item => item._id !== props.post._id))
                    }
                })
            }}>Remove</Button>
        </Card.Footer>
    )
}

const AddPostButton = props => {
    const addPostPhoto = "https://img.icons8.com/windows/344/add--v1.png"
    const buttonStyle = {
        background: "none",
        border: "none"
    }
    if (!props.isLoginSuccessful) return (<></>)
    return (
        <div style={{textAlign: "end", marginBottom: "10px"}}>
            <button style={buttonStyle} onClick={()=>props.setShowAddPostWindow(true)}>
                <img src={addPostPhoto} style={{width: "35px"}}/>
            </button>
        </div>
    )
}

const AddPostModal = props => {
    const [title, setTitle] = useState('')
    const [discription, setDiscription] = useState('')
    const [image, setImage] = useState('')

    return (
        <Modal
            show={props.showAddPostWindow}
            onHide={()=>props.setShowAddPostWindow(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add post
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Title</h6>
                <FormControl
                    style={{marginBottom: "15px"}}
                    defaultValue={title}
                    onChange={event => setTitle(event.target.value)}
                    aria-label="Title"
                />
            
                <h6>Image</h6>
                <FormControl
                    style={{marginBottom: "15px"}}
                    defaultValue={image}
                    onChange={event => setImage(event.target.value)}
                    aria-label="Image"
                />

                <FloatingLabel controlId="floatingTextarea2" label="Discription">
                    <Form.Control
                        as="textarea"onChange={event => setDiscription(event.target.value)}
                        defaultValue={discription}
                        placeholder="Leave a discription here"
                        style={{ height: '100px' }}
                    />
                </FloatingLabel>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => {
                    fetch(`${props.apiServer}/add_post?adminApiKey=${props.adminApiKey}&title=${title}&image=${image}&discription=${discription}`)
                    .then(response => response.json()).then(newCreatedPost => {
                        if (newCreatedPost) {
                            props.setPostsList(props.postsList.concat([newCreatedPost]))
                            props.setShowAddPostWindow(false)
                            setDiscription("")
                            setTitle("")
                            setImage("")
                        }
                    })
                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    ) 
}


export default PostsPage