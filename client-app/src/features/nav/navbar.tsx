import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps{
    openCreateForm : () => void;
}

export const NavBar : React.FC<IProps> = ({openCreateForm}) => {
  return (
    <Menu fixed="top" pointing>
      <Container>
        <Menu.Item header>
        <img src="/images/fooball.png" alt="clubLogo" style={{marginRight: 10}}/>
            Clubs
        </Menu.Item>
        <Menu.Item name="Clubs" />
        <Menu.Item>
            <Button onClick={openCreateForm} primary content='Create Club'/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
