import React from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import logoImage from "../../app/Images/logo.png"

export const HomePage = () => {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src= {logoImage}
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Clubs
        </Header>
        <Header as="h2" inverted content="Welcome to Clubs" />
        <Button as={Link} to="/clubs" size="huge" inverted>
          Take me to the Clubs!
        </Button>
      </Container>
    </Segment>
  );
};
