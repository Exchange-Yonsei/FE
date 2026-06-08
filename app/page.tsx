import Link from "next/link";
import { Coffee, MessageCircle, UsersRound, Utensils } from "lucide-react";

const cards = [
  {
    title: "Find people to eat with",
    copy: "Join small food plans around Sinchon, campus, and Seoul.",
    icon: Utensils
  },
  {
    title: "Join campus meetups",
    copy: "Study, cafes, culture trips, sports, and casual hangs.",
    icon: UsersRound
  },
  {
    title: "Connect through WhatsApp",
    copy: "Approved participants receive the invite link privately.",
    icon: MessageCircle
  }
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-peach px-4 py-2 text-sm font-bold text-stone-800">TableMate Yonsei</p>
          <h1 className="mt-6 text-4xl font-black leading-tight text-ink sm:text-6xl">
            <span className="block">Meet students.</span>
            <span className="block">Eat together.</span>
            <span className="block">Explore Seoul.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
            Casual meetups for Yonsei students and exchange students.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">No payments. No complicated setup. Just meet people.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/meetups">
              Browse Meetups
            </Link>
            <Link className="btn-secondary" href="/meetups/new">
              Create Meetup
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-soft">
          <div className="rounded-[1.5rem] bg-mint p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-leaf">
                <Coffee className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-leaf">Tonight near Sinchon</p>
                <h2 className="text-2xl font-black text-ink">Cafe study and late dinner</h2>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white p-4">
                <p className="font-bold text-ink">4 spots</p>
                <p className="mt-1 text-stone-600">Small group</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="font-bold text-ink">English/Korean</p>
                <p className="mt-1 text-stone-600">Easy to join</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-leaf">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-black text-ink">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{card.copy}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
