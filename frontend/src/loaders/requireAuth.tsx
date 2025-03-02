import { redirect } from "react-router-dom";

// A helper function that returns a boolean indicating whether the user is authenticated.
// This is just an example. In a real application, you might check a token in localStorage,
// query a context, or call an API.
async function isAuthenticated() {
  // For demonstration, we'll assume there's a token in localStorage.
  // TODO get authentication
  return Boolean(true);
}

export async function requireAuth() {
  const auth = await isAuthenticated();
  if (!auth) {
    // Redirect unauthenticated users to the login page.
    return redirect("/login");
  }
  // If authenticated, simply return null to continue rendering the route.
  return null;
}