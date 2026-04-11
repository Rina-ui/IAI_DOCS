import Sidebar from "@/components/student/Sidebar";
import Header from "@/components/student/Header";
import FloatingAI from "@/components/student/FloatingAI";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/*<Header />*/}
        <div className="pt-24 px-10 pb-12">{children}</div>
      </main>
      {/*<FloatingAI />*/}
    </div>
  );
}
