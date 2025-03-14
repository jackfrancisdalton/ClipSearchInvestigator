import { redirect } from "react-router-dom";
import { isAppConfigured } from "../api";

export async function redirectIfAlreadyConfigured() {
  const { isApiKeySet } = (await isAppConfigured())
  
  if (isApiKeySet) {
    return redirect("/");
  }

  return null;
}