import React, { useContext, useEffect } from "react";
import {Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps} from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ClubDetailsHeader from "./ClubDetailsHeader";
import ClubDetailsInfo from "./ClubDetailsInfo";
import ClubDetailsChat from "./ClubDetailsChat";
import ClubDetailsSidebar from "./ClubDetailsSidebar";
import { RootStoreContext } from "../../../app/stores/rootStore";


interface DetailsParams {
  id: string;
}


const ClubDetails: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {

  const rootStore = useContext(RootStoreContext);

  const {club, loadClub, loadingInitial} = rootStore.clubStore;


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
        <ClubDetailsSidebar attendees={club.attendees}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClubDetails)