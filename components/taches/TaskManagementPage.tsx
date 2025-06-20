"use client"; // If this is a client component

import React, { useState } from "react";
// import { Add01Icon } from "hugeicons-react"; // Make sure Hugeicons are correctly imported for your project
import New from "./new";
import Liste from "./liste";

const TaskManagementPage = () => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false); // State to control visibility of New component
  const [showTaskList, setShowTaskList] = useState(true); // State to control visibility of Liste component, default to true

  // Function to open the "Create Task" form (New component)
  const openNewTaskForm = () => {
    setShowNewTaskForm(true);
    setShowTaskList(false); // Hide task list when creating a new task
  };

  // Function to close the "Create Task" form and show the task list
  const closeNewTaskForm = () => {
    setShowNewTaskForm(false);
    setShowTaskList(true); // Show task list after closing the form
  };

  // Function to open the task list (Liste component)
  const openTaskList = () => {
    setShowTaskList(true);
    setShowNewTaskForm(false); // Hide new task form when viewing list
  };

  return (
    <div className="flex flex-col h-screen">
      {showNewTaskForm && (
        <New onClose={closeNewTaskForm} onTaskCreated={openTaskList} />
      )}
      {/* Render the Liste component if showTaskList is true */}
      {showTaskList &&
        !showNewTaskForm && ( // Ensure Liste only shows when form is not active
          <Liste onCreateNew={openNewTaskForm} onClose={closeNewTaskForm} />
        )}
    </div>
  );
};

export default TaskManagementPage;
