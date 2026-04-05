import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardPromotion, DashboardReferralFab } from "@/components/dashboard/DashboardPromotion";
import ChatButton from "@/components/chat/ChatButton";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen-dvh min-w-0 overflow-x-clip bg-white text-stone-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="landing-glow-orb absolute -left-[20%] top-[8%] size-[min(90vw,420px)] rounded-full bg-amber-400/18"
          aria-hidden
        />
        <div
          className="landing-glow-orb absolute -right-[15%] top-[35%] size-[min(85vw,380px)] rounded-full bg-sky-300/14 [animation-delay:-5s]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(43_96%_56%/0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-20">
        <DashboardHeader />
      </div>

      <main className="relative z-10">
        <DashboardPromotion />
      </main>

      <ChatButton className="border-2 border-white/40 shadow-2xl shadow-sky-500/45 ring-2 ring-sky-400/55 hover:shadow-sky-500/50 focus-visible:ring-sky-400 focus-visible:ring-offset-white" />
      <DashboardReferralFab />
    </div>
  );
};

export default Dashboard;
