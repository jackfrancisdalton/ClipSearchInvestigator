import { redirect } from "react-router-dom";
import { isApiKeySet } from "../Api";

async function isAuthenticated() {
  const temp = (await isApiKeySet()).isSet;
  return Boolean(temp)
}

export async function isAppConfigured() {
  const auth = await isAuthenticated();
  
  if (!auth) {
    return redirect("/setup");
  }
  
  // If authenticated, simply return null to continue rendering the route.
  return null;
}