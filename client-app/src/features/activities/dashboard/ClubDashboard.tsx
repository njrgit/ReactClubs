import React, { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { IClub } from "../../../app/models/clubs";
import  ClubList  from "./ClubList";
import  ClubDetails from "../details/ClubDetails";
import { ClubForm } from "../Form/ClubForm";
import ClubStore from '../../../app/stores/clubStore';
import { observer } from "mobx-react-lite";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  setSelectedClub: (club: IClub | null) => void;
  editExistingClub: (club: IClub) => void;
  deleteClub : (event: SyntheticEvent<HTMLButtonElement>,id : string) => void;
  submitting : boolean;
  target: string;
}

const ClubDashboard: React.FC<IProps> = ({
  setEditMode,
  setSelectedClub,
  editExistingClub,
  deleteClub,
  submitting,
  target
}) => {
  const clubStore = useContext(ClubStore);
  const {editMode,selectedClub} = clubStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ClubList deleteClub={deleteClub} submitting ={submitting} target ={target} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedClub && !editMode && (
          <ClubDetails
            setEditMode={setEditMode}
            setSelectedClub={setSelectedClub}
          />
        )}
        {editMode && (
          <ClubForm
            key={(selectedClub && selectedClub.id )|| 0}
            setEditMode={setEditMode}
            club={selectedClub!}
            editExistingClub={editExistingClub}
            submitting ={submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};


export default observer(ClubDashboard);