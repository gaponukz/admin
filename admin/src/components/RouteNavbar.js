import { Container, Navbar, Nav } from 'react-bootstrap'

const RouteNavbar = props => {
    return (
        <Navbar bg="dark" variant="dark" fixed="top" >
            <Container fluid>
                <Navbar.Brand href="#">Users</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>props.setPage('login')} href="#">Login</Nav.Link>
                    <Nav.Link onClick={()=>props.setPage('table')} href="#">Table</Nav.Link>
                    <Nav.Link onClick={()=>props.setPage('posts')} href="#">News</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default RouteNavbar