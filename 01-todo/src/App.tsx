import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<string[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved
      ? JSON.parse(saved)
      : ["Learn React", "Finish This Todo App", "Interview Prep"];
  });
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim() === "") return;
    setTodos([...todos, value]);
    setValue("");
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleDelete = (name: string) => {
    return setTodos(todos.filter((todo) => name !== todo));
  };
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
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
        <TaskList todos={todos} handleDelete={handleDelete} />
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

function TaskList({
  todos,
  handleDelete,
}: {
  todos: string[];
  handleDelete: (name: string) => void;
}) {
  const items = todos.map((task, idx) => (
    <li key={idx}>
      <Todo title={task} handleDelete={() => handleDelete(task)} />
    </li>
  ));
  return <ul>{items}</ul>;
}



function Todo({
  title,
  handleDelete,
}: {
  title: string;
  handleDelete: () => void;
}) {
  return (
    <div className="todo-parent">
      <span className="todo-title">{title}</span>

      <div className="button-group">
        <button className="btn-delete" onClick={handleDelete}>
          delete
        </button>
        <button className="btn-edit">edit</button>
      </div>
    </div>
  );
}

export default App;