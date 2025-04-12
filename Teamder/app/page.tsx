import { title } from "@/components/primitives";
import Buttons from "@/components/buttons";

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
          <Buttons />
      </div>
      {/* Here would go more butifying and landing page stuff, so far aiming just for funcionality*/}
    </section>
  );
}
