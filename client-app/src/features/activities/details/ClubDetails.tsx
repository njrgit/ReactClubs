import React, { useContext, useEffect } from "react";
import {Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubStore from "../../../app/stores/clubStore";
import { RouteComponentProps} from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ClubDetailsHeader from "./ClubDetailsHeader";
import ClubDetailsInfo from "./ClubDetailsInfo";
import ClubDetailsChat from "./ClubDetailsChat";
import ClubDetailsSidebar from "./ClubDetailsSidebar";


interface DetailsParams {
  id: string;
}


const ClubDetails: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {

  const clubStore = useContext(ClubStore);

  const {club, loadClub, loadingInitial} = clubStore;


  useEffect(() => {
    loadClub(match.params.id);
  },[loadClub, match.params.id, history])

  if(loadingInitial || ! club){
    return <LoadingComponent content="Loading Club Details..." />
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ClubDetailsHeader club={club}/>
        <ClubDetailsInfo club={club}/>
        <ClubDetailsChat/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ClubDetailsSidebar/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClubDetails)