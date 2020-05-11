import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import userImage from "../../../app/Images/user.png";
import { IAttendee } from "../../../app/models/clubs";

interface IProps {
  attendees: IAttendee[];
}

const styles = {
  borderColor: 'orange',
  borderWidth:2
}

const ClubListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image bordered style={attendee.following  ? styles : null} size="mini" circular src={attendee.image || userImage} />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ClubListItemAttendees;
