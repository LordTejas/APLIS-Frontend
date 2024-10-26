'use client';

import Header from "./_components/Header";
import SideBar from "./_components/SideBar";

import useDashboardStore from "./_zustand/dashboard.zustand";
import useSession from "@/app/hooks/useSession";

const DashboardPage = () => {

  
  const { menu, setMenu } = useDashboardStore();
  const {session, loading, error} = useSession();
  
  console.log(session);

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col">

      <div className="">
        <Header session={session} />
      </div>
      
      <div className="flex-1 flex">
        <div className="w-[20vw]">
          <SideBar session={session} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
