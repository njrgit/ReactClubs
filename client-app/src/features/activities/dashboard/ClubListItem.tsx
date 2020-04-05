import React from "react";
import { Item, Button, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IClub } from "../../../app/models/clubs";

const ClubListItem: React.FC<{ club: IClub }> = ({ club }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
        <Item key={club.id}>
          <Item.Image size="tiny" circular src="assets.user.png" />
          <Item.Content>
            <Item.Header as="a">{club.name}</Item.Header>
            <Item.Description>Managed By "Name of Manager"</Item.Description>
            <Item.Extra></Item.Extra>
          </Item.Content>
        </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock"/> {club.dateEstablished}
      </Segment>
      <Segment>
        <Icon name="target"/> {club.leagueName}
      </Segment>
      <Segment secondary>Players will go here</Segment>
      <Segment clearing>
        <span>
          <Icon name='crosshairs'/> {club.stadiumName}
          <Button
            as={Link}
            to={`/clubs/${club.id}`}
            floated="right"
            basic
            color="blue"
            content="View"
          />
        </span>
      </Segment>
    </Segment.Group>
  );
};

export default ClubListItem;
