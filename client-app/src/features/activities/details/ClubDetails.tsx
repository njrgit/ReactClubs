import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubStore from "../../../app/stores/clubStore";

const ClubDetails: React.FC = () => {

  const clubStore = useContext(ClubStore);

  const {selectedClub : club,openEditForm, cancelSelectedClub} = clubStore;

  return (
    <Card fluid>
      <Image src={`/images/${club!.shortName}.png`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{club!.name}</Card.Header>
        <Card.Meta>
          <span className="date">{club!.dateEstablished}</span>
        </Card.Meta>
        <Card.Description>{club!.stadiumName}</Card.Description>
        <Card.Description>{club!.leagueName}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() =>openEditForm(club!.id)}
            color="blue"
            basic
            content="Edit"
          ></Button>
          <Button
            onClick={cancelSelectedClub}
            color="grey"
            basic
            content="Cancel"
          ></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ClubDetails)