import { useTranslation } from "react-i18next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChatButton from "@/components/chat/ChatButton";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen-dvh min-w-0 bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-safe py-8 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
      </main>

      <ChatButton />
    </div>
  );
};

export default Dashboard;
