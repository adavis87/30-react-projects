import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    "Learn React",
    "Build a Todo App",
    "Master JavaScript",
    "Do some stretching",
  ]);
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim() === "") return;
    setTodos([...todos, value]);
    setValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <header>
        <h1>What is there todo?</h1>
      </header>
      <section className="todo-container">
        <TodoForm
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          value={value}
        />
        <TaskList todos={todos} />
      </section>
    </>
  );
}

function TodoForm({
  handleSubmit,
  handleInputChange,
  value,
}: {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="taskName">Task Name</label>
      <div>
        <input
          id="taskName"
          type="text"
          className="text"
          value={value}
          onChange={handleInputChange}
        />
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

function TaskList({ todos }: { todos: string[] }) {
  const items = todos.map((task, idx) => (
    <li key={idx}>
      <Todo title={task} />
    </li>
  ));
  return <ul>{items}</ul>;
}

export default App;
