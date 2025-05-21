import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

type GuestRoutesProps = PropsWithChildren;

export default function GuestRoutes({ children }: GuestRoutesProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user !== undefined) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (user === undefined) {
    return <Loading />;
  }

  return children;
}
