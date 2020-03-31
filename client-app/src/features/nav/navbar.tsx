import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ClubStore from "../../app/stores/clubStore";
import { observer } from "mobx-react-lite";

const NavBar : React.FC = () => {

  const clubStore = useContext(ClubStore)

  return (
    <Menu fixed="top" pointing>
      <Container>
        <Menu.Item header>
        <img src="/images/fooball.png" alt="clubLogo" style={{marginRight: 10}}/>
            Clubs
        </Menu.Item>
        <Menu.Item name="Clubs" />
        <Menu.Item>
            <Button onClick={clubStore.openCreateForm} primary content='Create Club'/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar)