import React, { useContext, useEffect, useState } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";
import ClubList from "./ClubList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ClubFilters from "./ClubFilters";

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

  if (loadingInitial && page === 0) {
    return <LoadingComponent content="Loading Clubs...." />;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNextClubs}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ClubList />
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width={6}>
        <ClubFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClubDashboard);
