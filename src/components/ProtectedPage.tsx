import { ReactNode } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./layout/AppLayout";

interface ProtectedPageProps {
  children: ReactNode;
}

export const ProtectedPage = ({ children }: ProtectedPageProps) => {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};
