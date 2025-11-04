import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./App.css";

function getLocalStorage() {
  const list = localStorage.getItem("todos");
  if (list) {
    return JSON.parse(list);
  }
  return [];
}

function App() {
  const [todos, setTodos] = useState(getLocalStorage());
  const [value, setValue] = useState("");
  const [isEditing, toggleIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // if (value.trim() === "") return;
    // setTodos([...todos, value]);
    // setValue("");
    // localStorage.setItem("todos", JSON.stringify(todos));
    event.preventDefault();
    if (!value) return;
    else if (value && isEditing) {
      console.log("in editing mode!");
    }
    setTodos([...todos, value]);
    toggleIsEditing(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // edit
  const handleEdit = (editTarget: string) => {
    toggleIsEditing(true);
    setEditId(editTarget);
  };

  const handleDelete = (name: string) => {
    // clear input first
    setValue("");
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
        <TaskList
          todos={todos}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </section>
            {JSON.stringify(isEditing, 2, null)}
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
  handleEdit,
}: {
  todos: string[];
  handleDelete: (name: string) => void;
  handleEdit: (name: string) => void;
}) {
  const items = todos.map((task, idx) => (
    <li key={idx}>
      <Todo
        title={task}
        handleDelete={() => handleDelete(task)}
        handleEdit={() => handleEdit(task)}
      />
    </li>
  ));
  return <ul>{items}</ul>;
}

function Todo({
  title,
  handleDelete,
  handleEdit,
}: {
  title: string;
  handleDelete: () => void;
  handleEdit: () => void;
}) {
  return (
    <div className="todo-parent">
      <span className="todo-title">{title}</span>

      <div className="button-group">
        <button className="btn-delete" onClick={handleDelete}>
          delete
        </button>
        <button className="btn-edit" onClick={handleEdit}>
          edit
        </button>
      </div>

    </div>
  );
}

export default App;
