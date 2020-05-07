import React, { useContext} from "react";
import { Grid, Segment, Form, Button, Label } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { IProfileUpdateValues } from "../../app/models/clubs";
import { RootStoreContext } from "../../app/stores/rootStore";
import TextInput from "../../app/common/form/TextInput";
import { observer } from "mobx-react-lite";

const validate = combineValidators({
  displayName: isRequired({ message: "Display Name is required" }),
});

const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    updateProfileInformation,
    submittingUpdatedProfileInfoLoading
  } = rootStore.profileStore;

  const handleProfileEditSubmit = (values: IProfileUpdateValues) => {
    updateProfileInformation(values);
  };

  return (
    <Grid.Column width={16} style={{ paddingBottom: 10 }}>
      <Segment clearing>
        <FinalForm
          validate={validate}
          onSubmit={handleProfileEditSubmit}
          initialValues={profile!}
          render={({ handleSubmit, invalid, pristine, submitting }) => (
            <Form.Group>
              <Form
                onSubmit={handleSubmit}
                loading={submittingUpdatedProfileInfoLoading}
              >
                <Label style={{ paddingBottom: 10 }}>Display Name</Label>
                <Field
                  name="displayName"
                  placeholder="Display Name"
                  value={profile!.displayName}
                  component={TextInput}
                />
                <Label style={{ paddingBottom: 10 }}>Bio</Label>
                <Field
                  name="bio"
                  placeholder="Bio"
                  value={profile!.displayName}
                  component={TextInput}
                />
                <Button
                  disabled={
                    submittingUpdatedProfileInfoLoading || invalid || pristine
                  }
                  loading={submitting}
                  floated="right"
                  type="submit"
                  positive
                >
                  Submit
                </Button>
              </Form>
            </Form.Group>
          )}
        />
      </Segment>
    </Grid.Column>
  );
};

export default observer(ProfileEditForm);
