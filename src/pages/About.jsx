import { Link } from "react-router-dom";
import PageSEO from "../components/seo/PageSEO";

const About = () => {
  return (
    <>
      <PageSEO title="About PrepStories" description="Learn about PrepStories – the community-driven platform where candidates share real interview experiences. Prepare smarter with authentic placement stories." canonical="/about" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-16 transition-colors">
      <main className="mx-auto flex max-w-5xl flex-col gap-16">
        {/* Hero */}
        <section className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            About PrepStories
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            About PrepStories
          </h1>
          <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
            PrepStories is a community-driven platform where candidates share
            real interview experiences. Our goal is to replace guesswork with
            authentic stories so you can prepare smarter and walk into interviews
            with clarity and confidence.
          </p>
        </section>

        {/* Mission */}
        <section className="grid gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:grid-cols-[1.1fr,1.2fr] shadow-sm">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Our mission
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We want every student and early-career engineer to have access to
              honest, specific interview stories — not just generic tips. By
              learning from real candidates who have already been through the
              process, you can focus your preparation on what actually matters.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 text-sm text-slate-700 dark:text-slate-300">
            <p>
              PrepStories helps you understand:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
              <li className="text-slate-600 dark:text-slate-300">What rounds companies actually run</li>
              <li>What topics and questions show up repeatedly</li>
              <li>How candidates felt and what they’d do differently</li>
            </ul>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            What you can do on PrepStories
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Share interview experiences
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Publish detailed accounts of your interviews so others can learn
                from your journey — from online assessments to final HR rounds.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Discover company insights
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Explore stories filtered by company and role to see how
                interviews differ between startups, big tech, and everything in
                between.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Learn from real candidates
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Read what actually happened in each round, what went well, and
                what didn’t — straight from the people who were in the room.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Community-driven preparation
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Upvote helpful stories and add comments so the best, most
                actionable experiences surface to the top for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Footer / Call to action */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Your story can help someone else get their next offer.
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            If you&apos;ve been through an interview recently, consider sharing
            your experience so others can learn from it.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            <Link
              to="/add"
              className="rounded-xl bg-indigo-500 dark:bg-indigo-400 px-6 py-2.5 text-sm font-semibold text-white dark:text-slate-950 shadow-md shadow-indigo-500/30 hover:bg-indigo-600 dark:hover:bg-indigo-300"
            >
              Share your experience
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-900/70"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
    </div>
    </>
  );
};

export default About;

