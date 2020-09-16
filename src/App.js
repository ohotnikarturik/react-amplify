import React, { Component } from "react";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";
import { Button } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from '@material-ui/core/Typography';

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
          <Button variant="outlined" color="primary" onClick={this.listQuery}>
            GraphQL List Query
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.todoMutation}
          >
            GraphQL Todo Mutation
          </Button>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
