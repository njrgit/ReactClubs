import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubStore from "../../../app/stores/clubStore";
import { RouteComponentProps, Link } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";


interface DetailsParams {
  id: string;
}


const ClubDetails: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {

  const clubStore = useContext(ClubStore);

  const {club, loadClub, loadingInitial} = clubStore;


  useEffect(() => {
    loadClub(match.params.id)
  },[loadClub, match.params.id])

  if(loadingInitial || ! club){
    return <LoadingComponent content="Loading Club Details..." />
  }

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
            as={Link} to={`/manage/${club.id}`}
            color="blue"
            basic
            content="Edit"
          ></Button>
          <Button
            onClick={() => history.push('/clubs')}
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