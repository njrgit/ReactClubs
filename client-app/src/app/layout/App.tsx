import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from "react";
import { Container } from "semantic-ui-react";
import { IClub } from "../models/clubs";
import NavBar from "../../features/nav/navbar";
import  ClubDashboard  from "../../features/activities/dashboard/ClubDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import ClubStore from "../stores/clubStore";
import {observer} from 'mobx-react-lite';

const App = () => {

  const clubStore = useContext(ClubStore)

  const [clubs, setClubs] = useState<IClub[]>([]);
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const [editMode, setEditMode] = useState(false);

  const handleEditExistingClub = (club: IClub) => {
    setSubmitting(true);
    agent.Clubs.update(club).then(() =>{
      setClubs([...clubs.filter(a => a.id !== club.id), club]);
      setSelectedClub(club);
      setEditMode(false);
    }).then(()=>
    setSubmitting(false)
    );
  };

  const handleDeleteClub = (event:SyntheticEvent<HTMLButtonElement> ,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name)
    agent.Clubs.delete(id).then(()=>{
      setClubs([...clubs.filter(c => c.id !== id)]);
    }).then(()=>
    setSubmitting(false)
    )
    .catch(error => {
      console.log(error.response)
    });
  };

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
        <ClubDashboard
          setEditMode={setEditMode}
          setSelectedClub={setSelectedClub}
          editExistingClub={handleEditExistingClub}
          deleteClub={handleDeleteClub}
          submitting ={submitting}
          target = {target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
