import React, { useContext } from "react";
import { Segment, Item, Header, Button, Image } from "semantic-ui-react";
import placeHolderImage from "../../../app/Images/liv.png";
import { IClub } from "../../../app/models/clubs";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const ClubDetailsHeader: React.FC<{ club: IClub }> = ({ club }) => {

  const rootStore = useContext(RootStoreContext);

  const { attendClub, cancelClubAttendance, loading } = rootStore.clubStore;
  const manager = club.attendees.filter(x => x.isHost)[0];

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image src={placeHolderImage} fluid style={activityImageStyle} />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={club.name}
                  style={{ color: "white" }}
                />
                <p>{format(club.dateEstablished, "eeee do MMMM")}</p>
                <p>
                  Managed By{" "}
                  <Link to={`/profile/${manager.username}`}>
                    <strong>{manager.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {club.isHost ? (
          <Button
            as={Link}
            to={`/manage/${club.id}`}
            color="orange"
            floated="right"
          >
            Manage Event
          </Button>
        ) : club.isGoing ? (
          <Button loading={loading} onClick={cancelClubAttendance}>
            Cancel attendance
          </Button>
        ) : (
          <Button loading={loading} onClick={attendClub} color="teal">
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ClubDetailsHeader);
