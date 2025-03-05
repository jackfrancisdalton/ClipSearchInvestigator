import { redirect } from "react-router-dom";
import { isApiKeySet } from "../Api";

export async function isAppConfigured() {
  const auth = Boolean((await isApiKeySet()).isSet)
  
  if (!auth) {
    return redirect("/setup");
  }

  // If authenticated, simply return null to continue rendering the route.
  return null;
}