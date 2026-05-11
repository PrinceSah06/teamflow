import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const features = [
  {
    title: "Shared notes",
    description: "Create, edit, and organize team notes inside your workspace.",
  },
  {
    title: "Team invites",
    description: "Invite members with a link and keep every workspace separate.",
  },
  {
    title: "Auto save",
    description: "Your writing stays saved while you focus on the work.",
  },
];

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const authUser = accessToken ? user : null;
  const displayName = authUser?.email?.split("@")[0] ?? "User";

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link className="text-xl font-black tracking-normal text-slate-950 no-underline" to="/">
            TeamFlow
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {authUser ? (
              <>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left">
                  <p className="text-sm font-bold leading-4 text-slate-950">{displayName}</p>
                  <p className="text-xs leading-4 text-slate-500">{authUser.email}</p>
                </div>
                <Link
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white no-underline transition hover:bg-slate-800"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="rounded-md px-4 py-2 text-sm font-bold text-slate-700 no-underline transition hover:bg-slate-100"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white no-underline transition hover:bg-slate-800"
                  to="/signup"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
          <div className="text-left">
            <p className="text-sm font-black uppercase tracking-normal text-teal-700">
              Notes for modern teams
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl">
              Keep your team notes, invites, and workspace in one clean place.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              TeamFlow helps you capture ideas, organize notes by organization, and invite the right people without losing momentum.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-teal-600 px-5 py-3 text-sm font-black text-white no-underline shadow-sm transition hover:bg-teal-700"
                to={authUser ? "/dashboard" : "/signup"}
              >
                {authUser ? "Open dashboard" : "Get started"}
              </Link>
              <Link
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 no-underline transition hover:bg-slate-100"
                to={authUser ? "/dashboard" : "/login"}
              >
                {authUser ? "View notes" : "Login"}
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm md:p-5">
            <div className="rounded-md bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p className="text-sm font-bold text-teal-200">Workspace</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Product notes</h2>
                </div>
                <span className="rounded-md bg-teal-400 px-3 py-1 text-xs font-black text-slate-950">
                  Live
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-md bg-white/10 p-3">
                  <p className="text-sm font-bold text-white">Sprint planning</p>
                  <p className="mt-1 text-sm text-slate-300">API tasks, UI polish, release checklist</p>
                </div>
                <div className="rounded-md bg-white/10 p-3">
                  <p className="text-sm font-bold text-white">Design review</p>
                  <p className="mt-1 text-sm text-slate-300">Responsive dashboard and invite flow</p>
                </div>
                <div className="rounded-md bg-teal-400/15 p-3">
                  <p className="text-sm font-bold text-teal-100">Invite ready</p>
                  <p className="mt-1 text-sm text-slate-300">Share a secure link with your teammate.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-4 py-10">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm" key={feature.title}>
                <h2 className="text-xl font-black text-slate-950">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
