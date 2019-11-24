import React, { Component } from "react";
import "./App.css";
import { Header, Icon, Image, List, ListItem } from "semantic-ui-react";
import axios from "axios";
import { listenerCount } from "cluster";

class App extends Component {
  state = {
    values: []
  };

  componentDidMount() {
    axios.get("http://localhost:5000/api/values").then(response => {
      //console.log(response);
      this.setState({
        values: response.data
      });
    });
  }

  render() {
    return (
      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="users" circular />
          <Header.Content>Friends</Header.Content>
        </Header>
        <List>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>
              <List.Icon name="users" />
              <List.Content>{value.name}</List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
