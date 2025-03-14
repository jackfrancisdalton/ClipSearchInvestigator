import { redirect } from "react-router-dom";
import { isAppConfigured } from "../api";

export async function redirectIfNotConfigured() {
  const { isApiKeySet } = (await isAppConfigured())
  
  if (!isApiKeySet) {
    return redirect("/setup");
  }

  return null;
}