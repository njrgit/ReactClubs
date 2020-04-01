import React, {useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navbar";
import  ClubDashboard  from "../../features/activities/dashboard/ClubDashboard";
import LoadingComponent from "./LoadingComponent";
import ClubStore from "../stores/clubStore";
import {observer} from 'mobx-react-lite';

const App = () => {

  const clubStore = useContext(ClubStore)

  useEffect(() => {
    clubStore.loadClubs();
  }, [clubStore]);

  if(clubStore.loadingInitial){
    return <LoadingComponent content="Loading Clubs...."/>
  }

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ClubDashboard/>
      </Container>
    </Fragment>
  );
};

export default observer(App);
