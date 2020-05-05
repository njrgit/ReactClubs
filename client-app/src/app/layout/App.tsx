import React, {Fragment, useContext, useEffect} from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navbar";
import ClubDashboard from "../../features/activities/dashboard/ClubDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps, Switch } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ClubForm from "../../features/activities/Form/ClubForm";
import ClubDetails from "../../features/activities/details/ClubDetails";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

const App: React.FC<RouteComponentProps> = ({ location }) => {

  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;

  const {getUser} = rootStore.userStore

  useEffect(() => {
    if(token){
      getUser().finally(()=> setAppLoaded());
    }else{
      setAppLoaded();
    }
  }, [getUser,setAppLoaded,token])

  if(!appLoaded){
    return <LoadingComponent content='Loading App'/>
  }


  return (
    <Fragment>
      <ModalContainer/>
      <ToastContainer position='bottom-right'/>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
              <Route exact path="/clubs" component={ClubDashboard} />
              <Route exact path="/clubs/:id" component={ClubDetails} />
              <Route
                key={location.key}
                exact
                path={["/createClub", "/manage/:id"]}
                component={ClubForm}
              />
              <Route path='/profile/:username' component={ProfilePage}/>
              <Route component={NotFound}/>
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
