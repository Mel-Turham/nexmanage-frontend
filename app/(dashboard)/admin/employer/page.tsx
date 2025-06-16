import React from "react";
import EmployerTable from "./_components/EmployerTable";
import employers from "@/data/employers.json";

const Page = () => {
  return (
    <div>
      <main className="p-6 flex flex-col gap-6">
        <EmployerTable employers={employers} />
      </main>
    </div>
  );
};

export default Page;
