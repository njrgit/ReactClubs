import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ClubListItem from "../dashboard/ClubListItem";
import { RootStoreContext } from "../../../app/stores/rootStore";
import {format} from 'date-fns';

const ClubList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { clubsBydate } = rootStore.clubStore;

  return (
    <Fragment>
      {clubsBydate.map(([group, clubs]) => (
        <Fragment  key={group} >
          <Label size="large" color="blue">
          {format(Date.parse(group), 'eeee do MMMM')}
          </Label>
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
