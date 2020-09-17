import React, { Component } from "react";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Analytics, Auth, Storage } from "aws-amplify";
import { Button } from "@material-ui/core";
import Container from "@material-ui/core/Container";

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

class App extends Component {
  state = { username: "" };

  async componentDidMount() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.setState({ username: user.username });
    } catch (err) {
      console.log("error getting user: ", err);
    }
  }
  
  uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;
    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    })
  }

  recordEvent = () => {
    Analytics.record({
      name: "My test event",
      attributes: {
        username: this.state.username,
      },
    });
  };

  todoMutation = async () => {
    const todoDetails = {
      name: "Party tonight!",
      description: "Amplify CLI rocks!",
    };
    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };
  
  listQuery = async () => {
    console.log("listing todos");
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };

  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <Container>
          <p> Click a button </p>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={this.listQuery}
            >
              GraphQL List Query
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.todoMutation}
            >
              GraphQL Todo Mutation
            </Button>
            <Button variant="contained" onClick={this.recordEvent}>
              Record Event
            </Button>
          </div>
          <p> Pick a file</p>
          <input  type="file" onChange={this.uploadFile} />
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
