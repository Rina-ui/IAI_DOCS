import {
  ArrowUpRight,
  Clock,
  Filter,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

const questions = [
  {
    id: 1,
    title:
      "Comment optimiser les hyperparamètres d\u0027un réseau transformer pour le traitement de textes médicaux ?",
    excerpt:
      "Je travaille sur un modèle de NLP dédié à l\u0027extraction d\u0027entités nommées dans des rapports de pathologie. Malgré plusieurs tentatives avec GridSearch, je n\u0027arrive pas à stabiliser la perte sur mes ensembles de validation...",
    votes: 42,
    answers: 12,
    views: "1.2k",
    tags: ["Deep Learning", "NLP", "BioMed"],
    author: "Dr. Elena Rostova",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=100&q=80",
    time: "il y a 3h",
    answered: true,
  },
  {
    id: 2,
    title:
      "Quelles sont les implications éthiques de l\u0027IA générative dans la recherche fondamentale ?",
    excerpt:
      "Nous débattons actuellement de l\u0027usage de ChatGPT pour la rédaction de protocoles expérimentaux. Est-ce que cela remet en cause l\u0027originalité de la démarche scientifique et la propriété intellectuelle de nos découvertes ?",
    votes: 15,
    answers: 0,
    views: "245",
    tags: ["Éthique", "Recherche"],
    author: "Prof. Julian Marc",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&q=80",
    time: "hier",
    answered: false,
  },
  {
    id: 3,
    title:
      "Comprendre la convergence de l\u0027algorithme Metropolis-Hastings dans les espaces de grande dimension",
    excerpt:
      "J\u0027essaie d\u0027échantillonner une distribution de probabilité complexe en 500 dimensions. Malgré l\u0027usage de MCMC, le mélange semble extrêmement lent... Quelqu\u0027un a-t-il des suggestions d\u0027optimisation ?",
    votes: 128,
    answers: 54,
    views: "5.8k",
    tags: ["Mathématiques", "Statistiques", "MCMC"],
    author: "Jean-Luc Moreau",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&q=80",
    time: "il y a 2 jours",
    answered: true,
  },
  {
    id: 4,
    title:
      "Architecture microservices vs monolithique pour un système de recommandation en temps réel ?",
    excerpt:
      "Notre équipe hésite entre une architecture micro-services et un monolithe bien structuré pour notre moteur de recommandation. Quelle approche conseillez-vous en termes de latence et de scalabilité ?",
    votes: 67,
    answers: 23,
    views: "3.1k",
    tags: ["Architecture", "Cloud", "ML Ops"],
    author: "Amina Diallo",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&q=80",
    time: "il y a 4 jours",
    answered: true,
  },
];

const categories = [
  { name: "Mathématiques", count: 342 },
  { name: "Physique", count: 218 },
  { name: "Éthique IA", count: 156 },
  { name: "Neurosciences", count: 127 },
  { name: "Informatique", count: 489 },
  { name: "Deep Learning", count: 312 },
];

export default function ForumPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            Forum de discussion
          </h1>
          <p className="text-secondary max-w-lg flex items-center gap-2">
            <Sparkles size={16} className="text-primary shrink-0" />
            Explorez et contribuez à la base de connaissances IAI_DOCS.
          </p>
        </div>
        <button className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap">
          <Plus size={20} strokeWidth={3} />
          Poser une question
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Questions", value: "2,481", icon: MessageSquare, color: "text-primary" },
          { label: "Non répondues", value: "32", icon: HelpCircle, color: "text-amber-500" },
          { label: "Utilisateurs", value: "1,247", icon: Users, color: "text-tertiary" },
          { label: "Aujourd\u0027hui", value: "+18", icon: TrendingUp, color: "text-primary" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-5 rounded-2xl border border-secondary/20 flex items-center gap-4 hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center shrink-0">
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-secondary font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <section className="bg-surface border border-secondary/20 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 min-w-0 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary/60" />
          <input
            type="text"
            placeholder="Rechercher une question, un tag ou un auteur..."
            className="w-full bg-neutral border-none rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-secondary/60 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold whitespace-nowrap shadow-sm">
            Plus récents
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-neutral text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors whitespace-nowrap">
            Plus votés
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-neutral text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors whitespace-nowrap hidden sm:block">
            Non répondus
          </button>
        </div>
      </section>

      {/* Main Layout: Questions + Right Sidebar */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Question List */}
        <div className="flex-1 min-w-0 space-y-4">
          {questions.map((q) => (
            <article
              key={q.id}
              className="bg-surface p-6 rounded-2xl border border-secondary/20 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col sm:flex-row gap-6 group"
            >
              {/* Stats Column */}
              <div className="flex sm:flex-col gap-4 sm:gap-3 justify-between sm:justify-start text-center min-w-[80px] shrink-0 pt-1">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-on-surface">{q.votes}</span>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-0.5">
                    votes
                  </span>
                </div>
                <div
                  className={`flex flex-col items-center p-2 rounded-xl border ${
                    q.answered
                      ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                      : "text-secondary border-secondary/20"
                  }`}
                >
                  <span className="text-lg font-bold">{q.answers}</span>
                  <span className="text-[9px] uppercase tracking-widest font-black mt-0.5">
                    réponses
                  </span>
                </div>
                <div className="flex flex-col items-center text-secondary">
                  <span className="text-sm font-bold">{q.views}</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold mt-0.5">
                    vues
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <h2 className="font-headline text-lg lg:text-xl font-bold text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer">
                    {q.title}
                  </h2>
                  <p className="text-secondary mb-5 line-clamp-2 leading-relaxed text-sm font-medium">
                    {q.excerpt}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral border border-secondary/10 px-3 py-1 rounded-lg text-xs font-bold text-on-surface hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <img
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                      alt={q.author}
                      src={q.avatar}
                    />
                    <div className="text-xs">
                      <p className="text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                        {q.author}
                      </p>
                      <span className="text-secondary font-medium flex items-center gap-1">
                        <Clock size={10} />
                        {q.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right Sidebar — Categories & Tags */}
        <aside className="xl:w-80 shrink-0 space-y-6">
          {/* Categories */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Filter size={14} className="text-primary" />
              Catégories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="#"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:bg-neutral hover:text-on-surface transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/30 group-hover:bg-primary transition-colors" />
                    {cat.name}
                  </span>
                  <span className="text-xs bg-neutral group-hover:bg-surface px-2 py-0.5 rounded-md font-bold">
                    {cat.count}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              Tags populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Deep Learning",
                "NLP",
                "Éthique",
                "MCMC",
                "Statistiques",
                "BioMed",
                "Recherche",
                "Python",
                "TensorFlow",
                "Architecture",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-neutral border border-secondary/10 px-3 py-1.5 rounded-lg text-xs font-bold text-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-secondary/70 mb-4 flex items-center gap-2">
              <Users size={14} className="text-primary" />
              Top contributeurs
            </h3>
            <div className="space-y-3">
              {[
                { name: "Dr. Elena Rostova", score: "2.4k", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=100&q=80" },
                { name: "Jean-Luc Moreau", score: "1.8k", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&q=80" },
                { name: "Amina Diallo", score: "1.2k", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&q=80" },
              ].map((user) => (
                <div key={user.name} className="flex items-center gap-3 group cursor-pointer">
                  <img
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                    alt={user.name}
                    src={user.avatar}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-secondary font-medium">{user.score} points</p>
                  </div>
                  <ArrowUpRight size={14} className="text-secondary/30 group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
