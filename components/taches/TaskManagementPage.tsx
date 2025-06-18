// Assuming this is in a file like TaskManagementPage.tsx or similar
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
      {" "}
      {/* Adjust overall container height/width as needed */}
      {/* This button could be elsewhere, perhaps in a main dashboard layout */}
      {/* {!showNewTaskForm &&
        showTaskList && ( // Show this button only if we are on the list view
          <div className="p-3">
            <button
              name="Creer une tache"
              className="custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg justify-center"
              onClick={openNewTaskForm} // Clicking this button opens the New component
            >
              <Add01Icon size={20} />
              Créer une tâche
            </button>
          </div>
        )} */}
      {/* Render the New component if showNewTaskForm is true */}
      {showNewTaskForm && (
        <div className="bg-bleu-ciel p-5 pb-0 pr-0 h-full w-full rounded-tl-4xl transition-opacity duration-300 ease-in-out opacity-100">
          <div className="bg-white h-full pr-0 rounded-tl-2xl">
            {/* Pass the closeNewTaskForm function as a prop to New */}
            <New onClose={closeNewTaskForm} onTaskCreated={openTaskList} />
          </div>
        </div>
      )}
      {/* Render the Liste component if showTaskList is true */}
      {showTaskList &&
        !showNewTaskForm && ( // Ensure Liste only shows when form is not active
          <div className="bg-bleu-ciel p-5 pb-0 pr-0 h-full w-full rounded-tl-4xl transition-opacity duration-300 ease-in-out opacity-100">
            <div className="bg-white h-full pr-0 rounded-tl-2xl">
              <Liste onCreateNew={openNewTaskForm} onClose={closeNewTaskForm} />{" "}
              {/* Pass functions if Liste needs them */}
            </div>
          </div>
        )}
    </div>
  );
};

export default TaskManagementPage;
