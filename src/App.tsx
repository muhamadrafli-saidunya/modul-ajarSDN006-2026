import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastNotification } from './components/common/ToastNotification';
import { DeleteConfirmModal } from './components/common/DeleteConfirmModal';
import { ModuleDetailModal } from './components/modules/ModuleDetailModal';
import { ModuleFormModal } from './components/modules/ModuleFormModal';
import { PrintPreviewModal } from './components/modules/PrintPreviewModal';
import { DatabaseBackupRestoreModal } from './components/profile/DatabaseBackupRestoreModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ModuleCatalog } from './components/modules/ModuleCatalog';
import { ModuleGeneratorWizard } from './components/generator/ModuleGeneratorWizard';
import { QuestionGeneratorView } from './components/quiz/QuestionGeneratorView';
import { CurriculumGuideView } from './components/curriculum/CurriculumGuideView';
import { AssessmentBankView } from './components/assessment/AssessmentBankView';
import { ProtaPromesView } from './components/protapromes/ProtaPromesView';
import { ProfileView } from './components/profile/ProfileView';

const MainLayout: React.FC = () => {
  const { currentView, userProfile } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'modules':
        return <ModuleCatalog />;
      case 'generator':
        return <ModuleGeneratorWizard />;
      case 'buat-soal':
      case 'question-generator':
        return <QuestionGeneratorView />;
      case 'curriculum':
        return <CurriculumGuideView />;
      case 'assessment':
        return <AssessmentBankView />;
      case 'prota-promes':
      case 'protapromes':
        return <ProtaPromesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 antialiased selection:bg-orange-500/20 selection:text-orange-600">
      {/* Responsive Left Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar Header */}
        <Topbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

        {/* Scrollable Workspace */}
        <main
          id="main-app-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        >
          {renderActiveView()}
        </main>

        {/* Professional Polish Status Bar */}
        <footer
          id="app-status-bar"
          className="h-8 shrink-0 bg-[#00529C] text-white/70 text-[10px] flex items-center px-6 lg:px-8 justify-between font-mono select-none"
        >
          <div className="flex items-center gap-4">
            <span>Server: Production-JKT-1</span>
            <span className="hidden sm:inline">Latency: 24ms</span>
            <span className="hidden md:inline font-sans text-white/80">
              {userProfile.school} • Kelas {userProfile.gradeAssigned} SD
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-sans">Sistem Berjalan Normal - Versi 2.4.0</span>
          </div>
        </footer>
      </div>

      {/* Modals & Portals */}
      <ModuleDetailModal />
      <ModuleFormModal />
      <PrintPreviewModal />
      <DatabaseBackupRestoreModal />
      <DeleteConfirmModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
