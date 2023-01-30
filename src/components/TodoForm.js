import React from "react";

export default (props) => (
  <form onSubmit={props.onSubmit}>
    <input
      type="text"
      value={props.currentTodo}
      onChange={props.onChange}
      autoFocus
      className="new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
