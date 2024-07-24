import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionTip from "@/component/sessionTip";
import { DefaultUser } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let userObject:((DefaultUser & {
    id: string;
  }) | undefined) | null = null;

  if (session) {
    userObject = session.user;
  }

  if(!userObject) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SessionTip session={session}></SessionTip>
        <div>
          <h1>Not Login</h1>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SessionTip session={session}></SessionTip>
        <div>
          <h1>LoginUser : {userObject.name}</h1>
          <p>LoginMail : {userObject.email}</p>
          <img src={`${userObject.image}`} />
        </div>
      </main>
    );
  }
}
