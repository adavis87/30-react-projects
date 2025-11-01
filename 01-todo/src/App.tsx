import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const tasks = ["Learn React", "Build a Todo App", "Master JavaScript"];

function Todo({ title }: { title: string }) {
  return (
    <div className="todo-parent">
      <p className="todo-title">{title}</p>
      <button className="btn-delete">delete</button>
      <button className="btn-edit">edit</button>
    </div>
  );
}

function TaskList() {
  const todos = tasks.map((task) => (
    <Todo title={task} />
  ))
  return (
    <ul>
      <li>{todos}</li>
    </ul>
  );
}

function App() {
  return (
    <>
      <header>
        <h1>What is there todo?</h1>
      </header>
      <section className="todo-container">
        <TaskList />
      </section>
    </>
  );
}

export default App;
