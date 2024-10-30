'use client';

import { lazy, Suspense } from 'react';
import Header from "./_components/Header";
import SideBar from "./_components/SideBar";

import useDashboardStore from "./_zustand/dashboard.zustand";
import useSession from "@/app/hooks/useSession";

// Keep immediate menu components
import CoursesView from "./_components/Course/CoursesView";
import StudentsView from "./_components/Students/StudentsView";
import SettingsView from "./_components/Settings/SettingsView";
import AnalyticsView from "./_components/Analytics/AnalyticsView";

// Lazy load submenu components
const ModulesView = lazy(() => import('./_components/Course/ModulesView'));
const EnrollmentsView = lazy(() => import('./_components/Course/EnrollmentsView'));
const ModuleContentView = lazy(() => import('./_components/Course/ModuleContentView'));
const ModuleContentCreationView = lazy(() => import('./_components/Course/ModuleContentCreationView'));
const ContentView = lazy(() => import('./_components/Course/ContentView'));
const AssignmentCreationView = lazy(() => import('./_components/Course/AssignmentCreationView'));
const AssignmentView = lazy(() => import('./_components/Course/AssignmentView'));
const QuizCreationView = lazy(() => import('./_components/Course/QuizCreationView'));
const QuizView = lazy(() => import('./_components/Course/QuizView'));

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
          {menu === 'courses' && subMenu === 'modules' && (
            <Suspense fallback={null}>
              <ModulesView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'enrollments' && (
            <Suspense fallback={null}>
              <EnrollmentsView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'module-content' && (
            <Suspense fallback={null}>
              <ModuleContentView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'module-content-creation' && (
            <Suspense fallback={null}>
              <ModuleContentCreationView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'content-view' && (
            <Suspense fallback={null}>
              <ContentView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'assignment-creation' && (
            <Suspense fallback={null}>
              <AssignmentCreationView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'assignment-view' && (
            <Suspense fallback={null}>
              <AssignmentView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'quiz-creation' && (
            <Suspense fallback={null}>
              <QuizCreationView />
            </Suspense>
          )}
          {menu === 'courses' && subMenu === 'quiz-view' && (
            <Suspense fallback={null}>
              <QuizView />
            </Suspense>
          )}
          {menu === 'analytics' && subMenu === null && <AnalyticsView />}
          {menu === 'students' && <StudentsView />}
          {menu === 'settings' && <SettingsView />} 
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
