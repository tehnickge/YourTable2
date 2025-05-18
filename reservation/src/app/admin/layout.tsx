import BaseGrid from "@/components/BaseGrid";
import SmallHeader from "@/components/Header/SmallHeader";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return <BaseGrid header={<SmallHeader />}>{children}</BaseGrid>;
};

export default AdminLayout;
