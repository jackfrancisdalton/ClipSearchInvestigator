import { redirect } from "react-router-dom";
import { isApiKeySet } from "../Api";

export async function isAppConfigured() {
  const isSet = (await isApiKeySet()).isApiKeySet
  console.log(isSet)
  
  if (!isSet) {
    return redirect("/setup");
  }

  return null;
}