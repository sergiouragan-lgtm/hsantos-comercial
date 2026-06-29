"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { STAGE_LABELS, formatMoney, formatDate } from "@/lib/format";

type Contact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  stage: Stage;
  value: string | null;
  notes: string | null;
  nextFollowUp: string | null;
  updatedAt: string;
};

type Stage = "LEAD" | "PROSPECT" | "NEGOTIATION" | "CUSTOMER" | "LOST";
const STAGES: Stage[] = ["LEAD", "PROSPECT", "NEGOTIATION", "CUSTOMER", "LOST"];

type Interaction = {
  id: string;
  type: string;
  content: string;
  dueAt: string | null;
  done: boolean;
  createdAt: string;
};

export default function CrmClient({
  initialContacts,
  currency,
}: {
  initialContacts: Contact[];
  currency: string;
}) {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  async function refresh() {
    const res = await fetch("/api/contacts");
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
    }
    router.refresh();
  }

  async function changeStage(id: string, stage: Stage) {
    setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    router.refresh();
  }

  async function removeContact(id: string) {
    if (!confirm("Excluir este contato e seu histórico?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setContacts((cs) => cs.filter((c) => c.id !== id));
    setSelected(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {contacts.length} contato(s) no funil
        </p>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Novo contato
        </button>
      </div>

      <div className="grid gap-4 overflow-x-auto md:grid-cols-5">
        {STAGES.map((stage) => {
          const items = contacts.filter((c) => c.stage === stage);
          return (
            <div key={stage} className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-slate-700">
                  {STAGE_LABELS[stage]}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-brand-300 hover:shadow"
                  >
                    <p className="text-sm font-medium">{c.name}</p>
                    {c.company && (
                      <p className="text-xs text-slate-500">🏢 {c.company}</p>
                    )}
                    {c.value && (
                      <p className="mt-1 text-xs font-semibold text-brand-600">
                        {formatMoney(Number(c.value), currency)}
                      </p>
                    )}
                    {c.nextFollowUp && (
                      <p className="mt-1 text-xs text-amber-600">
                        ⏰ {formatDate(c.nextFollowUp)}
                      </p>
                    )}
                  </button>
                ))}
                {items.length === 0 && (
                  <p className="px-1 text-xs text-slate-300">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <ContactForm
          onClose={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await refresh();
          }}
        />
      )}

      {selected && (
        <ContactDrawer
          contact={selected}
          currency={currency}
          onClose={() => setSelected(null)}
          onChangeStage={changeStage}
          onDelete={removeContact}
          onUpdated={refresh}
        />
      )}
    </div>
  );
}

function ContactForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    value: "",
    stage: "LEAD" as Stage,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        value: form.value || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) onSaved();
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao salvar");
    }
  }

  return (
    <Modal onClose={onClose} title="Novo contato">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Nome">
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Empresa">
            <input
              className="input"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </Field>
          <Field label="Telefone">
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="E-mail">
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Valor potencial">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Estágio">
          <select
            className="input"
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: e.target.value as Stage })}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notas">
          <textarea
            className="input"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ContactDrawer({
  contact,
  currency,
  onClose,
  onChangeStage,
  onDelete,
  onUpdated,
}: {
  contact: Contact;
  currency: string;
  onClose: () => void;
  onChangeStage: (id: string, stage: Stage) => void;
  onDelete: (id: string) => void;
  onUpdated: () => void;
}) {
  const [interactions, setInteractions] = useState<Interaction[] | null>(null);
  const [content, setContent] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [type, setType] = useState("NOTE");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/contacts/${contact.id}/interactions`);
    if (res.ok) {
      const data = await res.json();
      setInteractions(data.interactions);
    }
  }, [contact.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function addInteraction(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await fetch(`/api/contacts/${contact.id}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type, dueAt: dueAt || undefined }),
    });
    setLoading(false);
    setContent("");
    setDueAt("");
    await load();
    onUpdated();
  }

  return (
    <Modal onClose={onClose} title={contact.name}>
      <div className="space-y-1 text-sm text-slate-600">
        {contact.company && <p>🏢 {contact.company}</p>}
        {contact.phone && <p>📱 {contact.phone}</p>}
        {contact.email && <p>✉️ {contact.email}</p>}
        {contact.value && (
          <p className="font-semibold text-brand-600">
            💰 {formatMoney(Number(contact.value), currency)}
          </p>
        )}
        {contact.notes && <p className="text-slate-500">📝 {contact.notes}</p>}
      </div>

      <div className="mt-4">
        <label className="label">Estágio</label>
        <select
          className="input"
          value={contact.stage}
          onChange={(e) => onChangeStage(contact.id, e.target.value as Stage)}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">Histórico & Follow-ups</h3>
        <form onSubmit={addInteraction} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="NOTE">Nota</option>
              <option value="CALL">Ligação</option>
              <option value="MESSAGE">Mensagem</option>
              <option value="MEETING">Reunião</option>
              <option value="TASK">Tarefa</option>
            </select>
            <input
              className="input"
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              title="Data de follow-up (opcional)"
            />
          </div>
          <textarea
            className="input"
            rows={2}
            placeholder="Descreva a interação ou o follow-up..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar"}
          </button>
        </form>

        <ul className="mt-3 space-y-2">
          {interactions?.map((i) => (
            <li key={i.id} className="rounded-lg border border-slate-100 p-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{i.content}</span>
                {i.dueAt && (
                  <span className="text-xs text-amber-600">
                    ⏰ {formatDate(i.dueAt)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {i.type} · {formatDate(i.createdAt)}
              </p>
            </li>
          ))}
          {interactions?.length === 0 && (
            <p className="text-xs text-slate-400">Nenhuma interação ainda.</p>
          )}
        </ul>
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
        <button className="btn-danger" onClick={() => onDelete(contact.id)}>
          Excluir contato
        </button>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
