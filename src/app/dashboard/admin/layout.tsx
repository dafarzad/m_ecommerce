import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AdminDashboardLayout({ children }: Props) {
  return (
    <div className="w-full h-full">
      <Sidebar />
      <div className="mr-[300px]">
        <Header />
        <div className="mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
