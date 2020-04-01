import React, {useContext } from "react";
import { Grid } from "semantic-ui-react";
import  ClubList  from "./ClubList";
import  ClubDetails from "../details/ClubDetails";
import ClubForm from "../Form/ClubForm";
import ClubStore from '../../../app/stores/clubStore';
import { observer } from "mobx-react-lite";

const ClubDashboard: React.FC = () => {
  const clubStore = useContext(ClubStore);
  const {editMode,selectedClub} = clubStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ClubList />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedClub && !editMode && (
          <ClubDetails/>
        )}
        {editMode && (
          <ClubForm
            key={(selectedClub && selectedClub.id )|| 0}
            club={selectedClub!}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};


export default observer(ClubDashboard);