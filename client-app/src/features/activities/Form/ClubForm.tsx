import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IClub } from "../../../app/models/clubs";
import {v4 as uuid} from 'uuid'

interface IProps {
  setEditMode: (editMode: boolean) => void;
  club: IClub;
  createNewClub: (club : IClub) => void;
  editExistingClub: (club: IClub) => void;
}

export const ClubForm: React.FC<IProps> = ({
  setEditMode,
  club: initialFormState,
  createNewClub,
  editExistingClub
}) => {
  const initialiseForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        name: "",
        leagueName: "",
        stadiumName: "",
        dateEstablished: "",
        shortName: ""
      };
    }
  };

  const [club, setClub] = useState<IClub>(initialiseForm);

  const handleSubmit = () => {
    if(club.id.length === 0){
      let newClub = {
        ...club,
        id : uuid()
      }
      createNewClub(newClub)
    }else{
      editExistingClub(club)
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
        <Button  floated="right" type="submit" positive>
          Submit
        </Button>
        <Button onClick={() => setEditMode(false)} floated="right">
          Cancel
        </Button>
      </Form>
    </Segment>
  );
};