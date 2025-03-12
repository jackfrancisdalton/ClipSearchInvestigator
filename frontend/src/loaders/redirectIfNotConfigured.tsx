import { redirect } from "react-router-dom";
import { isAppConfigured } from "../Api";

export async function redirectIfNotConfigured() {
  const { isApiKeySet } = (await isAppConfigured())
  
  if (!isApiKeySet) {
    return redirect("/setup");
  }

  return null;
}