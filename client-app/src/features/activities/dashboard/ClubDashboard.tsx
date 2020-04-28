import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import  ClubList  from "./ClubList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import  {RootStoreContext} from "../../../app/stores/rootStore";

const ClubDashboard: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {loadClubs, loadingInitial} = rootStore.clubStore;

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  if (loadingInitial) {
    return <LoadingComponent content="Loading Clubs...." />;
  }
  
  return (
    <Grid>
      <Grid.Column width={10}>
        <ClubList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Club Filters</h2>
      </Grid.Column>
    </Grid>
  );
};


export default observer(ClubDashboard);