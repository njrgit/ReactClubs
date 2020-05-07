import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { ClubFormValues } from "../../../app/models/clubs";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import { leagueNames } from "../../../app/common/options/leagueName";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, isRequired} from 'revalidate';
import { RootStoreContext } from "../../../app/stores/rootStore";


const validate  = combineValidators({
  name: isRequired({message: 'Name is required'}),
  leagueName: isRequired({message: 'League is required'}),
  stadiumName: isRequired({message: 'Stadium is required'}),
  //shortName: isRequired({message: 'Short Name is required'}),
  dateEstablished: isRequired({message: 'Date is required'}),
  time: isRequired({message: 'Time Name is required'})
})

interface DetailParams {
  id: string;
}

const ClubForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createClub,
    editExistingClub,
    submitting,
    loadClub,
    } = rootStore.clubStore;

  const [club, setClub] = useState(new ClubFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadClub(match.params.id)
        .then((club) => setClub(new ClubFormValues(club)))
        .finally(() => setLoading(false));
    }
  }, [loadClub, match.params.id]);

  // const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
  //   const { name, value } = event.currentTarget;
  //   setClub({ ...club, [name]: value });
  // };

  //This handles when the form is submitted
  const handleFinalFormSubmit = (values: any) => {
    const dateTime = combineDateAndTime(values.dateEstablished, values.time);
    const { dateEstablished, time, ...club } = values;
    club.dateEstablished = dateTime;
    if (!club.id) {
          let newClub = {
            ...club,
            id: uuid()
          };
            createClub(newClub);
        } else {
          editExistingClub(club);
        }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={club}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine  }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="name"
                  placeholder="Name"
                  value={club.name}
                  component={TextInput}
                />
                <Field
                  name="stadiumName"
                  placeholder="Stadium Name"
                  value={club.stadiumName}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="leagueName"
                  placeholder="League Name"
                  value={club.leagueName}
                  options={leagueNames}
                  component={SelectInput}
                />
                <Form.Group>
                  <Field
                    date={true}
                    name="dateEstablished"
                    placeholder="Date"
                    value={club.dateEstablished}
                    component={DateInput}
                  />
                  <Field
                    time={true}
                    name="time"
                    placeholder="Time"
                    value={club.time}
                    component={DateInput}
                  />
                </Form.Group>
                <Button
                  disabled={loading || invalid || pristine}
                  loading={submitting}
                  floated="right"
                  type="submit"
                  positive
                >
                  Submit
                </Button>
                <Button
                  disabled={loading}
                  onClick={club.id ? ()=> history.push(`/clubs/${club.id}`) : () => history.push("/clubs")}
                  floated="right"
                >
                  Cancel
                </Button>
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClubForm);
