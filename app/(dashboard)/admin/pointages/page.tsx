"use client";
import React from "react";

import EmployerTable from "./_components/EmployersPresentTable";
import employersPresentData from "@/data/employersPresent.json";

const Presences = () => {
  return (
    <div>
      <main className="p-6 flex flex-col gap-6">
        <EmployerTable employers={employersPresentData} />
      </main>
    </div>
  );
};

export default Presences;
