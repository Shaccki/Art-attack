"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({
  artistId,
  artistName,
}: {
  artistId: string;
  artistName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artist_id: artistId,
        sender_name: data.get("sender_name"),
        sender_email: data.get("sender_email"),
        message: data.get("message"),
      }),
    });

    if (res.ok) {
      form.reset();
      setStatus("sent");
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "No se pudo enviar el mensaje");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">¡Mensaje enviado!</p>
        <p className="mt-1 text-sm text-emerald-700">
          {artistName} recibirá tu mensaje y te contactará por correo.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-emerald-800 underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-black/10 bg-white p-6"
    >
      <Field label="Tu nombre" name="sender_name" />
      <Field label="Tu correo" name="sender_email" type="email" />
      <label className="block">
        <span className="text-sm font-medium">Mensaje</span>
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder={`Hola ${artistName}, me interesa tu obra...`}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-rose-500"
        />
      </label>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-rose-600 px-5 py-3 font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-rose-500"
      />
    </label>
  );
}
