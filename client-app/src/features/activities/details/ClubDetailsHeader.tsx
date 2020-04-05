import React from 'react'
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react'

import placeHolderImage from '../../../app/Images/placeholder.png';
import { IClub } from '../../../app/models/clubs';
import { observer } from 'mobx-react-lite';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ClubDetailsHeader: React.FC<{club : IClub}> = ({club}) => {
    return (
            <Segment.Group>
              <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={placeHolderImage} fluid style={activityImageStyle}/>
                <Segment basic style={activityImageTextStyle}>
                  <Item.Group>
                    <Item>
                      <Item.Content>
                        <Header
                          size='huge'
                          content={club.name}
                          style={{ color: 'white' }}
                        />
                        <p>{club.dateEstablished}</p>
                        <p>
                          Played at <strong>{club.stadiumName}</strong>
                        </p>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Segment>
              </Segment>
              <Segment clearing attached='bottom'>
                <Button color='teal'>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button color='orange' floated='right'>
                  Manage Event
                </Button>
              </Segment>
            </Segment.Group>
    )
}

export default observer(ClubDetailsHeader)
