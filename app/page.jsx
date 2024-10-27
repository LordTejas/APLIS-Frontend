`use server`

import { permanentRedirect } from "next/navigation";

export default function Home() {
  permanentRedirect('/dashboard');
}