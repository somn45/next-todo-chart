"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type useQueryStringType = () => string;

const useQueryString: useQueryStringType = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    let queryParams: string[] = [];
    for (const key of searchParams.keys()) {
      const resultOfGetSearchParams = searchParams.get(key) ?? "";
      queryParams = [...queryParams, `${key}=${resultOfGetSearchParams}`];
    }
    const queryString = queryParams.join("&")
      ? `?${queryParams.join("&")}`
      : "";

    const url = `${pathname}${queryString}`;
    setUrl(url);
  }, [pathname, searchParams]);

  return url;
};

export default useQueryString;
