import React from "react";
import EmployerTable from "./_components/EmployerTable";
import employers from "@/data/employers.json";

const Page = () => {
  return (
    <div className="h-full">
      <main className="p-6 h-full">
        <EmployerTable employers={employers} />
      </main>
    </div>
  );
};

export default Page;
