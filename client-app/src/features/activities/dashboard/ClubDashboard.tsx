import React from "react";
import { Grid } from "semantic-ui-react";
import { IClub } from "../../../app/models/clubs";
import { ClubList } from "./ClubList";
import { ClubDetails } from "../details/ClubDetails";
import { ClubForm } from "../Form/ClubForm";

interface IProps {
  clubs: IClub[];
  selectClub: (id: string) => void;
  selectedClub: IClub | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedClub: (club: IClub | null) => void;
  createNewClub: (club: IClub) => void;
  editExistingClub: (club: IClub) => void;
  deleteClub : (id : string) => void;
}

export const ClubDashboard: React.FC<IProps> = ({
  clubs,
  selectClub,
  selectedClub,
  editMode,
  setEditMode,
  setSelectedClub,
  createNewClub,
  editExistingClub,
  deleteClub
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ClubList clubs={clubs} selectClub={selectClub} deleteClub={deleteClub} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedClub && !editMode && (
          <ClubDetails
            setEditMode={setEditMode}
            club={selectedClub}
            setSelectedClub={setSelectedClub}
          />
        )}
        {editMode && (
          <ClubForm
            key={selectedClub && selectedClub.id || 0}
            setEditMode={setEditMode}
            club={selectedClub!}
            createNewClub={createNewClub}
            editExistingClub={editExistingClub}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};
