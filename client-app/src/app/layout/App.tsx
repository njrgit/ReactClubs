import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IClub } from "../models/clubs";
import { NavBar } from "../../features/nav/navbar";
import { ClubDashboard } from "../../features/activities/dashboard/ClubDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

const App = () => {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);
  const [loading,setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectedClub = (id: string) => {
    setSelectedClub(clubs.filter(c => c.id === id)[0]);
    setEditMode(false);
  };

  const [editMode, setEditMode] = useState(false);

  const handleCreateClub = () => {
    setEditMode(true);
    setSelectedClub(null);
  };

  const handleCreateNewClub = (club: IClub) => {
    setSubmitting(true);
    agent.Clubs.create(club)
    .then(()=>{
      setClubs([...clubs, club]);
      setSelectedClub(club);
      setEditMode(false);
    })
    .then(()=>
    setSubmitting(false)
    )
    .catch(error => {
      console.log(error);
    });
  };

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
    agent.Clubs.list().then(response => {
      let clubs: IClub[] = [];
      response.forEach((club) => {
        club.dateEstablished = club.dateEstablished.split(".")[0];
        clubs.push(club);
      });
      setClubs(clubs);
    }).then(()=> setLoading(false));
  }, []);

  if(loading){
    return <LoadingComponent content="Loading Clubs...."/>
  }

  return (
    <Fragment>
      <NavBar openCreateForm={handleCreateClub} />
      <Container style={{ marginTop: "7em" }}>
        <ClubDashboard
          clubs={clubs}
          selectClub={handleSelectedClub}
          selectedClub={selectedClub!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedClub={setSelectedClub}
          createNewClub={handleCreateNewClub}
          editExistingClub={handleEditExistingClub}
          deleteClub={handleDeleteClub}
          submitting ={submitting}
          target = {target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
