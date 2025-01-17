import Logo from "@/components/shared/Logo";
import UserInfo from "@/components/dashboard/sidebar/UserInfo";
import SidebarNavAdmin from "@/components/dashboard/sidebar/NavAdmin";
import { adminDashboardSidebarOptions } from "@/constants/data";

type Props = {
  isAdmin?: boolean;
};

export default function Sidebar({ isAdmin = true }: Props) {
  const user: any = {};
  return (
    <div className="w-[300px] border-l h-screen p-4 flex flex-col fixed top-0 right-0 bottom-0">
      <Logo />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin && <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />}
    </div>
  );
}
