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
                    <Nav.Link href={"/"} as={Link}>Find Hard Drive</Nav.Link>
                    <Nav.Link href={"/addHardDriveFile"} as={Link}>Add erase report XML</Nav.Link>
                    {/*<Nav.Link href={"/addHardDrive"} as={Link}>Add new hard Drive</Nav.Link>*/}
                    {/*<Nav.Link href={"/changelog"} as={Link}>Change Log</Nav.Link>*/}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar
