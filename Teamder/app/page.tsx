import { title } from "@/components/primitives";
import {Button, ButtonGroup} from "@heroui/button";
import Link from 'next/link'

export default function Home() {
   return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Teamder&nbsp;</span>
        <br />
        <span className={title()}>
          Place to buld your team
        </span>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
          <Button color="primary" variant="flat" size="lg">
            <Link href="/login">Log In</Link>
          </Button>
          <Button color="primary" variant="flat" size="lg">
            <Link href="/singup">Sign Up</Link>
          </Button>
      </div>
      {/* Here would go more butifying and landing page stuff, so far aiming just for funcionality*/}
    </section>
  );
}
