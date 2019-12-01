import React from "react";
import { Item, Image, Button, Segment } from "semantic-ui-react";
import { IClub } from "../../../app/models/clubs";

interface IProps {
  clubs: IClub[];
  selectClub: (id: string) => void;
  deleteClub : (id : string) => void;
}

export const ClubList: React.FC<IProps> = ({ clubs, selectClub, deleteClub }) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {clubs.map(club => (
          <Item key={club.id}>
            <Item.Content>
              <Item.Header as="a">{club.name}</Item.Header>
              <Item.Description>
                <div>{club.stadiumName}</div>
                <div>{club.leagueName}</div>
                <Image src="/images/wireframe/short-paragraph.png" />
              </Item.Description>
              <Item.Meta>{club.dateEstablished}</Item.Meta>
              <Item.Extra>
                <Button onClick={() => selectClub(club.id)} floated="right" basic color="blue" content="View" />
                <Button onClick={() => deleteClub(club.id)} floated="right" basic color="red" content="Delete" />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};
