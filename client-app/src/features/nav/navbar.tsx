import React, { useContext } from "react";
import { Menu, Container, Button, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import footballLogo from "../../app/Images/football.png";

const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {user, logout } = rootStore.userStore;

  return (
    <Menu fixed="top" pointing>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            src={footballLogo}
            alt="clubLogo"
            style={{ marginRight: 10 }}
          />
          Home
        </Menu.Item>
        <Menu.Item name="Clubs" header as={NavLink} exact to="/clubs" />
        <Menu.Item>
          <Button
            primary
            content="Create Club"
            as={NavLink}
            exact
            to="/createClub"
          />
        </Menu.Item>
        {user && (
          <Menu.Item position="right">
            <Image avatar spaced="right" src={user.image} />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.userName}`}
                  text="My profile"
                  icon="user"
                />
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown> 
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
