import { useState } from "react";
import "./App.css";

const tasks = ["Learn React", "Build a Todo App", "Master JavaScript"];

function TodoForm() {
  return (
    <form>
      <label htmlFor="taskName">Task Name</label>
      <div>
        <input type="text" className="text" />
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}

function Todo({ title }: { title: string }) {
  return (
    <div className="todo-parent">
      <span className="todo-title">{title}</span>

      <div className="button-group">
        <button className="btn-delete">delete</button>
        <button className="btn-edit">edit</button>
      </div>
    </div>
  );
}

function TaskList() {
  const todos = tasks.map((task) => (
    <li>
      <Todo title={task} />
    </li>
  ));
  return <ul>{todos}</ul>;
}

function App() {
  return (
    <>
      <header>
        <h1>What is there todo?</h1>
      </header>
      <section className="todo-container">
        <TodoForm />
        <TaskList />
      </section>
    </>
  );
}

export default App;
