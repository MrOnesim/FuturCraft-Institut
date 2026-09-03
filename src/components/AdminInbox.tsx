"use client";

import { useState } from "react";
import { Inbox, Mail, Phone, RefreshCw, CheckCircle2, Download, MessageCircle } from "lucide-react";

export interface InboxMessage {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  subject: string;
  context: string | null;
  message: string;
  source: string | null;
  status: string;
  createdAt: string | Date;
}

export interface InboxSubscriber {
  id: number;
  email: string;
  source: string | null;
  createdAt: string | Date;
  unsubscribedAt: string | Date | null;
}

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const whatsappHref = (phone: string, name: string) => {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("229") ? digits : `229${digits.replace(/^0+/, "")}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(`Bonjour ${name}, ici FuturCraft Institut. Nous avons bien reçu votre demande via le site.`)}`;
};

/**
 * Onglet « Demandes » de la console d'administration : messages du formulaire
 * de contact, inscriptions aux événements et abonnés à la newsletter.
 */
export function AdminInbox({
  initialMessages,
  initialSubscribers,
}: {
  initialMessages: InboxMessage[];
  initialSubscribers: InboxSubscriber[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [filter, setFilter] = useState<"tous" | "nouveau" | "traite">("nouveau");
  const [refreshing, setRefreshing] = useState(false);

  const visible = messages.filter((m) => filter === "tous" || m.status === filter);
  const newCount = messages.filter((m) => m.status === "nouveau").length;

  const refresh = async () => {
    setRefreshing(true);
    try {
      const [m, s] = await Promise.all([
        fetch("/api/admin/messages").then((r) => r.json()),
        fetch("/api/admin/newsletter").then((r) => r.json()),
      ]);
      if (Array.isArray(m)) setMessages(m);
      if (Array.isArray(s)) setSubscribers(s);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleStatus = async (msg: InboxMessage) => {
    const status = msg.status === "traite" ? "nouveau" : "traite";
    const res = await fetch(`/api/admin/messages/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status } : m)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Demandes reçues via le site</h2>
          <p className="text-xs text-slate-500">
            Formulaire de contact, inscriptions aux événements et abonnés newsletter. {newCount} demande
            {newCount > 1 ? "s" : ""} à traiter.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-2 self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 text-xs">
          <Inbox className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800">Messages &amp; inscriptions</span>
          <div className="ml-auto flex gap-1">
            {(["nouveau", "traite", "tous"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                  filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {f === "traite" ? "Traités" : f === "nouveau" ? "Nouveaux" : "Tous"}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-10 text-center text-xs text-slate-500">Aucune demande dans cette vue.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {visible.map((m) => (
              <li key={m.id} className="px-4 py-4 grid gap-3 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-3">
                  <p className="text-sm font-bold text-slate-900">{m.name}</p>
                  <p className="text-[11px] text-slate-500">{formatDate(m.createdAt)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === "traite" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {m.status === "traite" ? "Traité" : "Nouveau"}
                    </span>
                    {m.source && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {m.source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <p className="text-xs font-bold text-slate-800">
                    {m.subject}
                    {m.context && <span className="font-normal text-slate-500"> — {m.context}</span>}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 whitespace-pre-line">{m.message}</p>
                </div>
                <div className="lg:col-span-3 flex flex-wrap lg:flex-col gap-2 text-xs lg:items-end">
                  <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600">
                    <Phone className="w-3.5 h-3.5" /> {m.phone}
                  </a>
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600 break-all">
                      <Mail className="w-3.5 h-3.5" /> {m.email}
                    </a>
                  )}
                  <a
                    href={whatsappHref(m.phone, m.name.split(" ")[0])}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Répondre sur WhatsApp
                  </a>
                  <button
                    onClick={() => toggleStatus(m)}
                    className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {m.status === "traite" ? "Remettre en nouveau" : "Marquer comme traité"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 text-xs">
          <Mail className="w-4 h-4 text-violet-600" />
          <span className="font-bold text-slate-800">Abonnés newsletter ({subscribers.filter((s) => !s.unsubscribedAt).length})</span>
          <a
            href="/api/admin/newsletter?format=csv"
            className="ml-auto inline-flex items-center gap-1.5 font-bold text-violet-700 hover:underline"
          >
            <Download className="w-3.5 h-3.5" /> Exporter en CSV
          </a>
        </div>
        {subscribers.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-slate-500">Aucun abonné pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Origine</th>
                  <th className="py-2.5 px-4">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.slice(0, 50).map((s) => (
                  <tr key={s.id} className={s.unsubscribedAt ? "opacity-50" : ""}>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{s.email}</td>
                    <td className="py-2.5 px-4 text-slate-500">{s.source || "—"}</td>
                    <td className="py-2.5 px-4 text-slate-500">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subscribers.length > 50 && (
              <p className="px-4 py-2 text-[11px] text-slate-500">
                {subscribers.length - 50} abonné(s) supplémentaire(s) dans l&apos;export CSV.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
