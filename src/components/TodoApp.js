import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { loadTodos, saveTodo, deleteTodo, updateTodo } from "../lib/service";
import { filterTodos } from "../lib/utils";

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(() => this.setState({ error: true }));
  }

  handleChange(event) {
    this.setState({ currentTodo: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newTodo = { name: this.state.currentTodo, isComplete: false };

    saveTodo(newTodo)
      .then(({ data }) =>
        this.setState({
          todos: [...this.state.todos, data],
          currentTodo: "",
        })
      )
      .catch(() => this.setState({ error: true }));
  }

  handleDelete(id) {
    deleteTodo(id).then(() =>
      this.setState({
        todos: this.state.todos.filter((t) => t.id !== id),
      })
    );
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find((t) => t.id === id);
    const updatedTodo = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete,
    };
    updateTodo(updatedTodo).then(({ data }) => {
      const todos = this.state.todos.map((t) => (t.id === data.id ? data : t));
      this.setState({ todos: todos });
    });
  }

  render() {
    const remaining = this.state.todos.filter((t) => !t.isComplete).length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className="error">Oh no!</span> : null}
            <TodoForm
              currentTodo={this.state.currentTodo}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  todos={filterTodos(match.params.filter, this.state.todos)}
                  onDelete={this.handleDelete}
                  onToggle={this.handleToggle}
                />
              )}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
