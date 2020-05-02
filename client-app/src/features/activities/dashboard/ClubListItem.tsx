import React from "react";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IClub } from "../../../app/models/clubs";
import {format} from 'date-fns'
import ClubListItemAttendees from "./ClubListItemAttendees";
import clubCrests from "../../../app/Images/football.png";

const ClubListItem: React.FC<{ club: IClub }> = ({ club }) => {

  const manager = club.attendees.filter(x => x.isHost)[0];

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
        <Item key={club.id}>
          <Item.Image size="tiny" circular src={clubCrests} />
          <Item.Content>
              <Item.Header as="a">{club.name}</Item.Header>
              <Item.Description>Manager : {manager.displayName}</Item.Description>
              {club.isHost && <Item.Description><Label basic color='orange' content='You are managing this' /></Item.Description>}
              {club.isGoing && !club.isHost && <Item.Description><Label basic color='green' content='You are not managing this, just watching' /></Item.Description>}
            <Item.Extra></Item.Extra>
          </Item.Content>
        </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock"/> {format(club.dateEstablished, 'h:mm a')}
      </Segment>
      <Segment>
        <Icon name="target"/> {club.leagueName}
      </Segment>
      <Segment secondary>
        <ClubListItemAttendees attendees={club.attendees} />
      </Segment>
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
