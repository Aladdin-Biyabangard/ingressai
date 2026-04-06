import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardPromotion, DashboardReferralFab } from "@/components/dashboard/DashboardPromotion";
import ChatButton from "@/components/chat/ChatButton";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen-dvh min-w-0 overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="landing-glow-orb absolute -left-[20%] top-[8%] size-[min(90vw,420px)] rounded-full bg-primary/16"
          aria-hidden
        />
        <div
          className="landing-glow-orb absolute -right-[15%] top-[35%] size-[min(85vw,380px)] rounded-full bg-accent/14 [animation-delay:-5s]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)_/_0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-20">
        <DashboardHeader />
      </div>

      <main className="relative z-10">
        <DashboardPromotion />
      </main>

      <ChatButton className="border-2 border-primary-foreground/35 shadow-2xl shadow-primary/40 ring-2 ring-primary/50 hover:shadow-primary/45 focus-visible:ring-primary focus-visible:ring-offset-background" />
      <DashboardReferralFab />
    </div>
  );
};

export default Dashboard;
