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
  const [editId, setEditId] = useState<string | null>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value) {
      // stop if input is empty
      return;
    }
    // condition for editing existing task
    else if (value && isEditing) {
      console.log("in editing mode");
      setTodos(
        todos.map((item) => {
          if (item === editId) {
            item = value;
            return item;
          }
          return item;
        })
      );
      setValue("");
      setEditId(null);
      toggleIsEditing(false);
    } else {
      setTodos([...todos, value]);
      setValue("");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // edit
  const handleEdit = (editTarget: string) => {
    const editId = todos.find((todo: string) => todo === editTarget);
    toggleIsEditing(true);
    setEditId(editId);
    setValue(editId);
  };

  const handleDelete = (name: string) => {
    // clear input first
    setValue("");
    setTodos(todos.filter((todo) => name !== todo));
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
          isEditing={isEditing}
        />
        <TaskList
          todos={todos}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </section>
      <p style={{ color: "black" }}>{JSON.stringify(isEditing, null, 2)}</p>
    </>
  );
}
function TodoForm({
  handleSubmit,
  handleInputChange,
  value,
  isEditing,
}: {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  isEditing: boolean;
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
        <input type="submit" value={isEditing ? "update" : "submit"} />
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
