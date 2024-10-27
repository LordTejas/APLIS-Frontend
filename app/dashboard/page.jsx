'use client';

import Header from "./_components/Header";
import SideBar from "./_components/SideBar";

import useDashboardStore from "./_zustand/dashboard.zustand";
import useSession from "@/app/hooks/useSession";

import CoursesView from "./_components/Course/CoursesView";
import EnrollmentsView from "./_components/Enrollments/EnrollmentsView";
import StudentsView from "./_components/Students/StudentsView";
import SettingsView from "./_components/Settings/SettingsView";
import ModulesView from "./_components/Course/ModulesView";

const DashboardPage = () => {

  
  const { menu, subMenu } = useDashboardStore();
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
          {menu === 'courses' && subMenu === null && <CoursesView />}
          {menu === 'courses' && subMenu === 'modules' && <ModulesView />}
          {menu === 'courses' && subMenu === 'enrollments' && <EnrollmentsView />}
          {menu === 'students' && <StudentsView />}
          {menu === 'settings' && <SettingsView />}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
