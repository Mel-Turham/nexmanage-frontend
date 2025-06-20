"use client";
import React from "react";

import EmployerTable from "@/components/presence/EmployersPresentTable";
import employersPresentData from "@/data/employersPresent.json";

const Presences = () => {
  return (
    <div className="h-full">
      <main className="p-6 h-full">
        <EmployerTable employers={employersPresentData} />
      </main>
    </div>
  );
};

export default Presences;
