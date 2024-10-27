'use client';

import Header from "./_components/Header";
import SideBar from "./_components/SideBar";

import useDashboardStore from "./_zustand/dashboard.zustand";
import useSession from "@/app/hooks/useSession";

import CoursesView from "./_components/Course/CoursesView";
import EnrollmentsView from "./_components/Course/EnrollmentsView";
import StudentsView from "./_components/Students/StudentsView";
import SettingsView from "./_components/Settings/SettingsView";
import ModulesView from "./_components/Course/ModulesView";
import ModuleContentView from "./_components/Course/ModuleContentView";
import AssignmentCreationView from "./_components/Course/AssignmentCreationView";
import QuizCreationView from "./_components/Course/QuizCreationView";
import ModuleContentCreationView from "./_components/Course/ModuleContentCreationView";
import ContentView from "./_components/Course/ContentView";
import AssignmentView from "./_components/Course/AssignmentView";
import QuizView from "./_components/Course/QuizView";
import AnalyticsView from "./_components/Analytics/AnalyticsView";

const DashboardPage = () => {

  
  const { menu, subMenu } = useDashboardStore();
  const {session, loading, error} = useSession();
  
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
          {menu === 'courses' && subMenu === 'module-content' && <ModuleContentView />}
          {menu === 'courses' && subMenu === 'module-content-creation' && <ModuleContentCreationView />}
          {menu === 'courses' && subMenu === 'content-view' && <ContentView />}
          {menu === 'courses' && subMenu === 'assignment-creation' && <AssignmentCreationView />}
          {menu === 'courses' && subMenu === 'assignment-view' && <AssignmentView />}
          {menu === 'courses' && subMenu === 'quiz-creation' && <QuizCreationView />}
          {menu === 'courses' && subMenu === 'quiz-view' && <QuizView />}
          {menu === 'analytics' && subMenu === null && <AnalyticsView />}
          {menu === 'students' && <StudentsView />}
          {menu === 'settings' && <SettingsView />} 
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
