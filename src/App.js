import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";

import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import Todo from "./components/Todo";

import './App.css';

// The All filter shows all tasks, so we return true for all tasks.
// The Active filter shows tasks whose completed prop is false.
// The Completed filter shows tasks whose completed prop is true.

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAME = Object.keys(FILTER_MAP);

export default function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // check if there have the same id
      if (id === task.id) {
        // use completed spread to make a new object
        // whose `completed` prop has been inverted
        return {
          ...task, completed: !task.completed
        }
      }
      return task;
    })
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTask = tasks.map(task => {
      // if this task have the same id
      if (id === task.id) {
        //
        return {
          ...task, name: newName
        }
      }
      return task;
    });
    setTasks(editedTask);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo 
       id={task.id}
       name={task.name}
       completed={task.completed}
       key={task.id}
       toggleTaskCompleted={toggleTaskCompleted}
       deleteTask={deleteTask}
       editTask={editTask} />
  ));

  const filterList = FILTER_NAME.map(name => (
    <FilterButton key={name} name={name} isPressed={name === filter}
    setFilter={setFilter}/>
  ));
  
  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };

    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
        <div className="todoapp stack-large">
        <h1>TodoMatic</h1>
        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">
        {filterList}
        </div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {headingText}
        </h2>
        <ul role="list" className="todo-list stack-large stack-exception" aria-labelledby="list-heading">{taskList}</ul>
      </div>
    )
}