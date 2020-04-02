import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";

const NavBar : React.FC = () => {

  return (
    <Menu fixed="top" pointing>
      <Container>
        <Menu.Item header as ={NavLink} exact to='/'>
        <img src="/images/fooball.png" alt="clubLogo" style={{marginRight: 10}}/>
            Home
        </Menu.Item>
        <Menu.Item name="Clubs" header as ={NavLink} exact to='/clubs'/>
        <Menu.Item>
            <Button primary content='Create Club' as ={NavLink} exact to='/createClub'/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar)