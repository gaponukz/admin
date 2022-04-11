import { Card, InputGroup, FormControl, Button } from 'react-bootstrap'

const LoginPage = props => {
    const setAdminApiKeyInMemory = () => {
        let cookie = JSON.parse(document.cookie || "{}")
        cookie.adminApiKey = props.adminApiKey
        cookie.isAuthed = Boolean(props.adminApiKey)
        document.cookie = JSON.stringify(cookie)
    }
    const setAdminApiKey = event => {
        props.setAdminApiKey(event.target.value)
    }
    return (<>
        <Card body style={{ width: '30rem', marginTop: "150px" }}>
            <h5>Login to get access to table</h5>
            <p>If you need to access you have no access</p>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Your admin api key"
                    defaultValue={props.adminApiKey}
                    onChange={setAdminApiKey}
                    aria-label="Your admin api key"
                    aria-describedby="basic-addon2"
                />
                <Button onClick={setAdminApiKeyInMemory} variant="outline-secondary" id="button-addon2">
                    Set admin key
                </Button>
            </InputGroup>
        </Card>
    </>)
}

export default LoginPage