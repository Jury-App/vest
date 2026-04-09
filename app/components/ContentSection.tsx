"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const SAFE_GUIDE_URL =
  "https://bookface-static.ycombinator.com/assets/ycdc/Website%20User%20Guide%20Feb%202023%20-%20final-28acf9a3b938e643cc270b7da514194d5c271359be25b631b025605673fa9f95.pdf";

export default function ContentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copyOffset, setCopyOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const revealWindow = viewportHeight * 0.9;
      const traveled = viewportHeight - rect.top;
      const progress = Math.min(1, Math.max(0, traveled / revealWindow));
      const mobileViewport = window.innerWidth < 768;
      const startOffset = mobileViewport ? 120 : 168;
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setIsMobile(mobileViewport);
      setCopyOffset((1 - easedProgress) * startOffset);
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
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center">
        <Reveal
          className="mx-auto max-w-[900px] px-4 text-center text-white sm:px-6 md:px-10"
          delayMs={40}
        >
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize:
                "clamp(2.2rem, 6vw, 5.4rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            Welcome to our
            <br />
            <span>Community Fund</span>
          </h2>
        </Reveal>

        <Reveal
          className="mx-auto w-full max-w-[640px] text-left text-[15px] leading-[1.85] text-white/78 sm:px-6 md:text-[17px] md:leading-[1.92]"
          delayMs={60}
        >
          <div
            style={{
              transform: `translateY(${copyOffset}px)`,
              transition: "transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              willChange: "transform",
              marginTop: "42px",
              paddingLeft: isMobile ? "16px" : "0px",
              paddingRight: isMobile ? "16px" : "0px",
            }}
          >
            <p> Hi! I'm Nicole. Maybe you know from a past life, maybe you know me through a mutual, maybe we're new friends. I'm a South Korean country girl at heart with the privilege of growing up in cities around the world because my Swiss dad was a chef at fancy hotels. When I moved to the US for college, I became the first in my line to graduate high school, get a bachelor's degree - and through many mistakes slash happy accidents, work my way into Silicon Valley. The rest is history (or tragic dramedy, time will tell). Long story short, I make apps and websites. For Code & Theory, Mayvenn Hair, Credit Karma, Genies, and recently by the grace of God, luck, and capitalism - myself.</p>
            <p>
            Along the way I noticed some paradoxical truths;
            </p>

            <ol className="list-decimal pl-5">
              <li>
                <p>
                  Good technology is magic. It is literal witchcraft but bad
                  technology drains the soul out of you and wastes your fucking
                  time. See; filing unemployment (why do I have to
                  input the same job I'm emailing every week?), insurance
                  claims, or any other adult activity that's not sex-related.
                </p>
              </li>
              <li>
                <p>
                  A lot of technology businesses make a fuck tonne of money
                  because i) very few people on this planet have the privilege
                  of creating software and ii) it's not like operating a
                  restaurant which has a fixed amount of seats/limited IRL
                  access. For some reason, the unbridled scaling power of
                  software comes at the cost of a good user experience (what the
                  REAL person on the ground feels when they use it).
                  <em>Do businesses take we the people for granted?</em>
                </p>
              </li>
              <li>
                <p>
                  As culture progresses towards a more people-first system that
                  corrects the current overindexing on state and business rights
                  over individual freedom and collective liberation and
                  physical safety (yes, I'm an optimist - even if transitions
                  are difficult and take longer than expected), so must our
                  standards for businesses, business leaders, and generally,
                  vibes (<em>VOIBES</em>).
                </p>
              </li>
            </ol>

            <p>
              In 2020 when the world temporarily shut down, I married new skills
              with old questions. Markets froze and we were all figuring out
              how to stay sane;
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Why does money anxiety feel <em>SO bad?</em>
              </li>
              <li>
                What are my richer friends doing that I'm not, other than being
                born into stability?
              </li>
              <li>How can I do more things with friends?</li>
              <li>
                And most importantly, <em>why am I still so damn lonely?</em>
              </li>
            </ul>

            <p> Along the way I had a front row seat to the only tech billionare I'd endorse for President; Kenneth J. Lin. I quietly watched this humble visionary build a $9B business that protected people from predators, empowered them with transparency and optionality, prioritized employee health and equity, while co-sponsoring an NBA team and PRINTING money for shareholders.</p>  

            <p> But something nagged at me. First, despite our best efforts to unlock financial progress for 1 out of 3 Americans on our app, the American Dream is not within reach for the majority of Americans. The best technology in the world can't fix this. It's a systemic problem that can be summarized in one chart.</p>
            <p> <img src="/images/chart.png" alt="Chart" className="w-full h-auto" /> </p>

            <p> The internet, and now AI, has made shareholder value so easy to unlock but wages haven't adjusted. Second, the business model was still fundamentally based on ads. I didn't like that, personally.</p>

            <p> I mean, look at today's largest consumer software non-retail ad business; Meta. Don't get me wrong. I <em>have</em> to leave room for diplomacy because I'm trying to be a big girll; and there are many solid people earning great livings from Meta's payroll, so I don't wish harm on the business. And, I celebrate Wasian babies and the Chan-Zuckerberg kids are gonna cure cancer so, God bless the family. But look at our digital system today. Outside of chat, our Social tools revolve around an interaction of posting content for external feedback (likes, shares, reposts, follows). The product became a content business, which is great for the brilliant and baddie creatives pioneering careers in a new world, but awful for our attention spans and standards since the machine incentivizes volume and organic content punches through the noise using rage and scandal to be noticed. All of this is a system that normalizes divisiveness & fear & an insiduous depression that hijacks our ability to generate dopamine elsewhere. </p>

            <p> It's not healthy to be exposed to everything, everyone, all at once, all the time. </p>

            <p> I know. I know you know, too. </p>

            <p> Our other connection tool is dating. Idk man - I think a lot of us just outgrew the dating apps but don't really have another choice, especially in a more remote school and work culture. </p>

            <p> In 2023, I began my quest to redesign social. After failing to launch a Social x Finance app (a concept warmly dubbed "Karmic Vision"), I left the fintech world in SF and launched an app at a hot social startup in LA. That didn't work out other. The scales tipped and I focused next on Online x Offline integrations, then on Social x Dating; what if your friends were included in your dating app experience? People already give each other their phones at brunch or send screenshots in the group chat. </p>
            
            <p> I spent most of 2024 alchemizing our first round of feedback into a functional prototype, iterating with women in LA and Pasadena. By the end of the year, I sunsetted the app to redesign it from the ground up with everything we had learned, rebrand our energy, while beginning to learn how to vibe code shittily with super-early AI tools until I hit a wall and got professional and specialized help to launch our not-so-basic MVP on the App Store in 2025. Post-launch was a flurry of "oh shit, gotta fix this" while getting folks to try the app. Chaos, but hey, we live!</p>

            <p> The good news; the most important thing that needed to happen (for that stage) happened. We saw a 2.5x viral coefficient out the gate without using any paid acquisition, which meant we could reliabily keep growing without forcing a shit tonne of ads down your throat. Personally? Fuck yeah. I don't ever wanna force someone to loving me or loving my art - and I dont enjoy the limelight so I'd rather you hear about us through your friends. </p>
            
            <p>The bad news? Holy shit, there is so much work to do. I need help.</p>

            <p>So here we are. If you've been following me for a minute, you know some other crazy shit happened. Two obsessed, relentless, fanatic stalkers who hacked my shit and shared it with many other people while I was building and starting life over post-marriage. Then the jealous friend of someone I went on 4 dates with who, despite us no longer being active, took it upon themselves to harass me, hijack an early-fledgling business, steal unreleased work as their own, publicly joke about my hack, threaten to expose intimate content, and just straight up bully me to... notice her? Idk. It's weird, and not the good kind.</p>

            <p>So, some drama. A different kind of workplace politics, I guess. Some celeb exposure. Some imaginary players, some big business. Heavy on existential crisis. But I need to be real with you; all of this is a distraction from the main thing that needs to stay the main thing. We don't need it. We have something that works, something real, something that people are excited about, that culture needs.</p>

            <p>Something new. </p>
            
            <p>We just have to get it outside.</p>

            <p>Meet me outside?</p>

            <p>There's a legendary era just around the corner. At minimum, good hangs with friends, maybe a cheeky cig, and a crush here and/or there 🙃 </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
