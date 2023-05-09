import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
function NavBar () {
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href={"/"} as={Link}>
                    C & I HARD DRIVE DATABASE
                   {/* <Image src={logo} alt={""}/>*/}
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href={"/searchHardDrives"} as={Link}>Search Hard Drives</Nav.Link>
                    <Nav.Link href={"/addHardDrive"} as={Link}>Add new hard drives</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar