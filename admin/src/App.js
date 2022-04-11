import { Container } from 'react-bootstrap'
import RouteNavbar from './components/RouteNavbar'
import LoginPage from './components/LoginPage'
import TablePage from './components/TablePage'
import PostsPage from './components/PostsPage'

import { useState } from 'react'
import './App.css'

const App = () => {
    const apiServer = "http://localhost:4000"
    let cookie = JSON.parse(document.cookie || "{}")
    const [page, setPage] = useState(cookie.isAuthed ? 'table' : 'login')
    const [adminApiKey, setAdminApiKey] = useState(cookie.adminApiKey ? cookie.adminApiKey : '')

    return (<>
        <RouteNavbar setPage={setPage}/>
        <Container style={{marginTop: "65px", textAlign: "-webkit-center"}}>
            {{
                login: <LoginPage adminApiKey={adminApiKey} setAdminApiKey={setAdminApiKey} />,
                table: adminApiKey ? <TablePage adminApiKey={adminApiKey} apiServer={apiServer}/> : <br/>,
                posts: <PostsPage adminApiKey={adminApiKey} apiServer={apiServer}/>
            }[page] || <div>Something went wrong</div>}
        </Container>
    </>)
}

export default App;
