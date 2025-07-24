import React, { Suspense } from "react";
import CRM from "@/components/ManageCRMComponents/ManageCRM";

const page = () => {
  return(
    <Suspense fallback={<div>Loading CRM...</div>}>
      <CRM />
    </Suspense>
  ) 

};

export default page;
