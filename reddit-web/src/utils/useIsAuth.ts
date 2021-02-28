import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      console.log("useIsAuth line 10", router.pathname);
      console.log("redirecting to login since !data?.me")
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};