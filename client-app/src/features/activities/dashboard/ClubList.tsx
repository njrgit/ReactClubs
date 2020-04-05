import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubStore from "../../../app/stores/clubStore";
import ClubListItem from "../dashboard/ClubListItem";

const ClubList: React.FC = () => {
  const clubStore = useContext(ClubStore);

  const { clubsBydate } = clubStore;

  return (
    <Fragment>
      {clubsBydate.map(([group, clubs]) => (
        <Fragment  key={group} >
          <Label size="large" color="blue">{group}</Label>
            <Item.Group divided>
              {clubs.map(club => (
                <ClubListItem key={club.id} club={club} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ClubList);
