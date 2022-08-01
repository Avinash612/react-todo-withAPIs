import React, { useState, useEffect } from "react";
import InputForm from "./components/TodoInput";
import Tabs from "./components/Filtertabs";
import Todo from "./components/Todolist";
import TodoAPI from "./components/TodoAPI";
import "./App.css";
/* eslint-disable */
const AllTask = "All";
const ActiveTask = "Active";
const CompletedTask = "Completed";
function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filteredActiveItems, setFilteredActiveItems] = useState(AllTask);

  useEffect(() => {
    async function getData() {
      const apiTodoList = await TodoAPI.getTodos();
      setTasks(apiTodoList.data.todoList);
    }
    getData();
  }, []);

  const getFilteredTasks = () => {
    if (filteredActiveItems === AllTask) {
      return tasks;
    } else if (filteredActiveItems === CompletedTask) {
      const updatedTasks = tasks.filter((task) => {
        return task.completed === true;
      });
      return updatedTasks;
    } else if (filteredActiveItems === ActiveTask) {
      const activeTasks = tasks.filter((task) => {
        return task.completed === false;
      });
      return activeTasks;
    }
    return tasks;
  };
  const taskList = getFilteredTasks().map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  async function addTask(name) {
    const apiTodoAddData = await TodoAPI.createTodo({ name: name });
    setTasks(apiTodoAddData.data.todoList);
  }

  async function toggleTaskCompleted(id, name, completed) {
    const updatedTasks = await TodoAPI.updateTodo({ id, name, completed });
    setTasks(updatedTasks.data.todoList);
  }
  async function deleteTask(id) {
    const apiTodoDeleteData = await TodoAPI.deleteTodo({ id });
    setTasks(apiTodoDeleteData.data.todoList);
  }
  async function editTask(id, name, completed) {
    const apiTodoUpdateData = await TodoAPI.updateTodo({ id, name, completed });
    setTasks(apiTodoUpdateData.data.todoList);
  }
  //ALL TASKS......
  const handleAllListClick = () => {
    setFilteredActiveItems(AllTask);
  };
  // COMPLETED TASKS.....
  const handleCompletedListClick = () => {
    setFilteredActiveItems(CompletedTask);
  };
  //ACTIVE TASKS....
  const handleActiveListClick = () => {
    setFilteredActiveItems(ActiveTask);
  };
  return (
    <div className="head-container">
      <style>{"body { background-color: black; }"}</style>
      <h1 className="heading">Todo</h1>
      <InputForm handleAddButtonClick={addTask} />
      <br />
      <div>
        <Tabs
          onAllListClick={handleAllListClick}
          onCompletedListClick={handleCompletedListClick}
          onActiveListClick={handleActiveListClick}
          // filteredActiveItems={filteredActiveItems}
        />
      </div>
      <div>
        <ul role="list" className="unorderedlists">
          {taskList}
        </ul>
      </div>
    </div>
  );
}
export default App;
