import { authClient } from "$/auth.client";
import { auth } from "$/auth.server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getSession = createIsomorphicFn()
  .server(function () {
    const { headers } = getRequest();
    return auth.api.getSession({ headers });
  })
  .client(function () {
    return authClient.getSession();
  });
