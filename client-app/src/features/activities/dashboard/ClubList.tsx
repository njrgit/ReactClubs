import React, { SyntheticEvent, useContext } from "react";
import { Item, Image, Button, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubStore from "../../../app/stores/clubStore";

interface IProps {
  deleteClub : (event:SyntheticEvent<HTMLButtonElement>,id : string) => void;
  submitting : boolean
  target: string
}

const ClubList: React.FC<IProps> = ({deleteClub, submitting, target }) => {
  
  const clubStore = useContext(ClubStore);
  
  const {clubsBydate,selectClub} = clubStore;

  return (
    <Segment clearing>
      <Item.Group divided>
        {clubsBydate.map(club => (
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
                <Button  onClick={() => selectClub(club.id)} floated="right" basic color="blue" content="View" />
                <Button name={club.id} loading={target === club.id && submitting} onClick={(e) => deleteClub(e,club.id)} floated="right" basic color="red" content="Delete" />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ClubList);
