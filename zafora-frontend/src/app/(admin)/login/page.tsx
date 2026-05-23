import { redirect } from "next/navigation";
import { ROUTES } from "@/src/lib/url-helpers";

/** F7 replaces this with a dedicated login flow */
export default function LoginPage() {
  redirect(ROUTES.ADMIN.ROOT);
}
