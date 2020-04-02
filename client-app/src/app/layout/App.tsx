import React, {Fragment} from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navbar";
import ClubDashboard from "../../features/activities/dashboard/ClubDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ClubForm from "../../features/activities/Form/ClubForm";
import ClubDetails from "../../features/activities/details/ClubDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/clubs" component={ClubDashboard} />
              <Route exact path="/clubs/:id" component={ClubDetails} />
              <Route
                key={location.key}
                exact
                path={["/createClub", "/manage/:id"]}
                component={ClubForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
