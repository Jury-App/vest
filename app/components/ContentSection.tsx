"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

export default function ContentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height + viewportHeight;
      const traveled = viewportHeight - rect.top;
      const progress = Math.min(1, Math.max(0, traveled / total));

      setParallaxOffset(progress * -32);
    };

    const requestUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#232323] px-5 py-24 sm:px-8 md:px-10 md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-12 md:mb-16 lg:mb-20">
          <h1
            className="text-center text-white"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "clamp(3.2rem, 8vw, 7.6rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            Welcome to our
            <br />
            Community Fund
          </h1>
        </Reveal>

        <Reveal
          className="mx-auto mt-8 max-w-[820px] px-2 text-left text-[15px] leading-[1.85] text-white/78 sm:px-6 md:mt-8 md:px-10 md:text-[17px] md:leading-[1.92] lg:px-14"
          delayMs={60}
          
        >
          <div
            style={{
              transform: `translateY(${parallaxOffset}px)`,
              transition: "transform 120ms linear",
              willChange: "transform",
            }}
          >
            <p>
              Social media became a content business and culture outgrew dating
              apps. Public and legal opinion of today&apos;s connection tools are at
              historic lows. The Jury has like, literally, spoken.
            </p>

            <p className="mt-5 md:mt-6">
              Now imagine everyone on Match, Bumble, Grindr &amp; Her invited 3 of
              their closest friends to join. Imagine everyone frustrated with
              social media &amp; big tech had a healthy and fun alternative they
              could trust. Imagine your wallflower friends had something to do on
              their phone other than lurk. Imagine a social network without ads.
            </p>

            <p className="mt-5 md:mt-6">
              That&apos;s Jury. Your friends build your profile and swipe for you.
              The outcome of this Social Intelligence gets people outside with our
              signed event partners. If you&apos;re dating, meet your match in
              person. No in-app chat. If it&apos;s awkward IRL, that&apos;s fine -
              you&apos;re still outside having a good time with friends. Our Social
              AI gathers group intelligence about you through your Jury&apos;s
              behavior, merges it into an ever-evolving identity characterization,
              and matches you with real-world experiences.
            </p>

            <ul className="mt-8 space-y-4 pl-6 marker:text-white/55 md:mt-10 md:space-y-5 md:pl-7">
              <li>
                It&apos;s working; we validated a 2.5x organic viral coefficient out
                the gate with $0 paid acquisition. After 1 year of designing with
                local partners and another bigger investment in quality UX, brand
                &amp; motion design, we&apos;ve proven immediate velocity on iOS.
              </li>

              <li>
                We are embedded in pre-gentrified culture; on the ground,
                in-person, hipster-punk-experimental-underground-ish, home-grown
                in Silver Lake, Los Angeles. It&apos;s your cool friend&apos;s cool
                secret spot. That&apos;s our HQ. We know LA neighborhoods by style
                &amp; substance, not just as a zipcode.
              </li>

              <li>
                On top of that, as mentioned, it is possible I can turn my
                situation (recap: invasion of privacy and ongoing data leak during
                stealth which was distributed to people I follow on Instagram who
                have been following my journey for a year +; this includes your
                favorite rappers, musicians, supermodels, fashion designers,
                actors, directors, writers, comedians, athletes, podcasters,
                photographers, influencers, businesspeople, ETC.) into
                distribution partnerships if we can secure Jury&apos;s brand
                together.
              </li>

              <li>
                Our moat against foundational models; we literally create our own
                data to train social intelligence. And - brand. And I&apos;m not
                talking about marketing campaigns. This is FUBU. You can&apos;t fake
                authenticity.
              </li>

              <li>
                I&apos;m a solo founder, digital product designer by trade for 12
                years; my dad was a chef working in hotels. I grew up an only
                child moving continents every 2~4 years. I&apos;m the first in my line
                to graduate high school. I moved to America for college alone and
                worked my way into Silicon Valley designing ads for Farmville at
                programmatic agencies in the Zynga-era. I married young. Moved to
                NYC and joined a creative agency working out of Andy Warhol&apos;s old
                library where Kanye used to drop-in. Moved back to SF and joined a
                startup to disrupt the hair industry for Black women; bundles,
                wigs, closures, etc. My career was cemented at Credit Karma when I
                joined as a very early designer and was promoted 1x/year (rare) as
                the company tripled in size on the way to Intuit&apos;s acquisition.
                This is where I started my personal thesis in 2020 on Social
                Utility for next-era consumer which Anish Acharya at a16z
                evangelized too. It started as &quot;your friends involved in your
                finances&quot; where I began designing whole products and relational
                account configuration &amp; onboarding for teens. Ken &amp; Ryan (CEO
                &amp; CTO) gave us green light to build a separate app from the
                mothership but that ended up ruffling too many mid-level
                management feathers. I got bored with growth work and left to join
                a social avatar companion app in LA. We designed and shipped a
                mediocre use-case that I couldn&apos;t pivot successfully for
                political reasons. I quit and started Jury as I began separating
                from a decade-long marriage. In the last 2 and a half years
                I&apos;ve learned how to become the Product, Design, and Engineering
                team all in one and am only just getting started despite
                extraordinary headwinds. I haven&apos;t even hit my prime.
              </li>
            </ul>

            <p className="mt-8 md:mt-10">
              My goal was to reach 3yrs bootstrapped, but I&apos;ve encountered
              unexpected ongoing legal/security costs, sudden changes with aging
              dependents, and recently a small car accident. So - it&apos;s now or
              never for me and Jury. This is it. I&apos;m raising a $1.44M seed on
              post-money SAFE at a $12M valuation which is an intentional probably
              50% discount. I have no idea how the investment world works and
              truthfully it&apos;s not my priority, so I&apos;m open to feedback.
              I&apos;ve intentionally limited investor outreach to select and elite
              partners. This is not spray &amp; pray. This is not accelerator
              material. This is outside system, kinda-punk, for the culture-type
              entrepreneurship. The floor is iconic and the ceiling doesn&apos;t
              exist. You guys would be my second marriage and I&apos;m cognizant of
              the work that goes into that, atop of company building - something
              I&apos;m new to but really excited to figure out in unchartered waters.
            </p>

            <p className="mt-5 md:mt-6">
              We have GTM partners ready to execute, a small army of passionate
              fans, and interested investors but I just need someone brave enough
              to take the lead so we can relaunch Jury together and, excuse my
              French, just fucking GO. Jury needs a Hero; a Midwife
            </p>

            <p className="mt-5 text-white/92 md:mt-6">
              There&apos;s a beautiful era just around the corner.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16 flex w-full justify-center md:mt-20 lg:mt-24" delayMs={120}>
          <div className="h-[92px] w-[210px] overflow-hidden md:h-[161px] md:w-[367px]">
            <img
              alt="Signature"
              className="mx-auto h-full w-full object-contain"
              src="/assets/whitesig.png"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
