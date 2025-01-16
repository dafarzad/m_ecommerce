import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import Header from "@/components/dashboard/header/Header";

type Props = {
  children?: React.ReactNode;
};

export default function SellerStoreDashboardLayout({ children }: Props) {
  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <div className="mr-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
