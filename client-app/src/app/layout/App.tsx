import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { IClub } from "../models/clubs";
import { NavBar } from "../../features/nav/navbar";
import { ClubDashboard } from "../../features/activities/dashboard/ClubDashboard";

const App = () => {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);

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
    setClubs([...clubs, club]);
    setSelectedClub(club);
    setEditMode(false);
  };

  const handleEditExistingClub = (club: IClub) => {
    setClubs([...clubs.filter(a => a.id !== club.id), club]);
    setSelectedClub(club);
    setEditMode(false);
  };

  const handleDeleteClub = (id : string) => {
    setClubs([...clubs.filter(c => c.id !== id)])
  }

  useEffect(() => {
    axios.get<IClub[]>("http://localhost:5000/api/clubs").then(response => {
      let clubs: IClub[] = [];
      response.data.forEach(club => {
        club.dateEstablished = club.dateEstablished.split(".")[0];
        clubs.push(club);
      });
      setClubs(clubs);
    });
  }, []);

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
          deleteClub ={handleDeleteClub}
        />
      </Container>
    </Fragment>
  );
};

export default App;
