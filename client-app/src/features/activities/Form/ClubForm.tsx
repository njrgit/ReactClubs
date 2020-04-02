import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IClub } from "../../../app/models/clubs";
import {v4 as uuid} from 'uuid';
import ClubStore from "../../../app/stores/clubStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams{
  id:string
}


const ClubForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
  
  const clubStore = useContext(ClubStore);
  const {editExistingClub, submitting, club:initialFormState, loadClub, clearClub} = clubStore
  
  const [club, setClub] = useState<IClub>({
      id: "",
      name: "",
      leagueName: "",
      stadiumName: "",
      dateEstablished: "",
      shortName: ""
  });
  
  useEffect(() => {
    if(match.params.id && club.id.length === 0){
      loadClub(match.params.id).then(() => initialFormState && setClub(initialFormState));
    }
    return () =>{
      clearClub();
    };
  },[loadClub,clearClub, match.params.id, initialFormState, club.id.length]);

  const handleSubmit = () => {
    if(club.id.length === 0){
      let newClub = {
        ...club,
        id : uuid()
      }
      clubStore.createClub(newClub).then(()=> history.push(`/clubs/${newClub.id}`));
    }else{
      editExistingClub(club).then(()=> history.push(`/clubs/${club.id}`));
    }
  };

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setClub({ ...club, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit = {handleSubmit}>
        <Form.Field>
          <label>Name</label>
          <input
            name="name"
            onChange={handleInputChange}
            placeholder="Name"
            value={club.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Stadium Name</label>
          <input
            name="stadiumName"
            onChange={handleInputChange}
            placeholder="Stadium Name"
            value={club.stadiumName}
          />
        </Form.Field>
        <Form.Field>
          <label>League Name</label>
          <input
            name="leagueName"
            onChange={handleInputChange}
            placeholder="League Name"
            value={club.leagueName}
          />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <input
            name="dateEstablished"
            onChange={handleInputChange}
            type="datetime-local"
            placeholder="Date"
            value={club.dateEstablished}
          />
        </Form.Field>
        <Button loading={submitting} floated="right" type="submit" positive>
          Submit
        </Button>
        <Button onClick={()=>history.push('/clubs')} floated="right">
          Cancel
        </Button>
      </Form>
    </Segment>
  );
};

export default observer(ClubForm);