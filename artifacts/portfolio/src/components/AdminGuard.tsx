import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
