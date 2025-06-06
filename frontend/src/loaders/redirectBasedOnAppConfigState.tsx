import { LoaderFunction, redirect } from "react-router-dom";
import { fetchAppConfigState } from "../api/index.js";

export const redirectBasedOnAppConfigState: LoaderFunction = async ({ request }: { request: Request }) => {
  const isConfigured = await fetchAppConfigState();
  const { pathname } = new URL(request.url);

  if (!isConfigured.isApiKeySet && pathname !== '/setup') {
    return redirect('/setup');
  }

  if (isConfigured.isApiKeySet && pathname === '/setup') {
    return redirect('/search');
  }

  return null;
}