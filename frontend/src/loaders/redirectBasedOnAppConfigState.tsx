import { LoaderFunction, redirect } from "react-router-dom";
import { fetchAppConfigState } from "../api";

// TODO: review why this keep re-firing all the time
export const redirectBasedOnAppConfigState: LoaderFunction = async ({ request }) => {

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