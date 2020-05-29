import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ClubList from "./ClubList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ClubFilters from "./ClubFilters";
import ClubListItemPlaceHolder from "./ClubListItemLoadingPlaceHolder";

const ClubDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadClubs,
    loadingInitial,
    setPage,
    page,
    totalPages,
  } = rootStore.clubStore;

  const [loadingNext, setLoadingnext] = useState(false);

  const handleGetNextClubs = () => {
    setLoadingnext(true);
    setPage(page + 1);
    loadClubs().then(() => setLoadingnext(false));
  };

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);


  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <ClubListItemPlaceHolder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNextClubs}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ClubList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ClubFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClubDashboard);
