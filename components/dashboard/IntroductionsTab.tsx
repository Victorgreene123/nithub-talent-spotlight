"use client";

import { useEffect, useRef, useState } from "react";
import { InternIntroductionRequest } from "@/types/talent";

interface IntroductionsTabProps {
  introductions: InternIntroductionRequest[];
  internEmail: string;
  internPhone: string;
  onAcceptIntro: (id: string) => void;
  onDeclineIntro: (id: string, reason?: string) => void;
}

const CONFETTI_COLORS = [
  "#27a810",
  "#62cf3a",
  "#FACC15",
  "#38BDF8",
  "#F43F5E",
  "#A855F7",
  "#FFFFFF",
];

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      tilt: number;
      tiltSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const totalParticles = 120;

    for (let i = 0; i < totalParticles; i++) {
      // Launch from center-top of the modal and both sides
      const originX =
        i % 3 === 0
          ? width * 0.5
          : i % 3 === 1
            ? width * 0.35
            : width * 0.65;
      const originY = height * 0.42;

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 7 + Math.random() * 13;

      particles.push({
        x: originX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: 8 + Math.random() * 7,
        h: 5 + Math.random() * 5,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.08 + Math.random() * 0.12,
        opacity: 1,
      });
    }

    let frame = 0;
    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let activeCount = 0;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.vx *= 0.985; // Air resistance
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        if (frame > 130) {
          p.opacity = Math.max(0, p.opacity - 0.018);
        }

        if (p.opacity > 0 && p.y < canvas.height + 40) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(1, Math.cos(p.tilt));
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (activeCount > 0) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    }

    animationFrameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}

export function IntroductionsTab({
  introductions,
  internEmail,
  internPhone,
  onAcceptIntro,
  onDeclineIntro,
}: IntroductionsTabProps) {
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [celebratingIntro, setCelebratingIntro] =
    useState<InternIntroductionRequest | null>(null);

  const pendingIntros = introductions.filter(
    (item) => item.consent_status === "pending"
  );
  const historyIntros = introductions.filter(
    (item) => item.consent_status !== "pending"
  );

  function handleAccept(intro: InternIntroductionRequest) {
    onAcceptIntro(intro.id);
    setCelebratingIntro(intro);
  }

  function handleConfirmDecline(id: string) {
    onDeclineIntro(id, declineReason.trim() || undefined);
    setDecliningId(null);
    setDeclineReason("");
  }

  return (
    <div className="space-y-12">
      {/* Section 1: Pending Employer Introductions */}
      <section>
        <div className="pb-5 border-b border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="font-cabin text-xs font-semibold uppercase tracking-wider text-brand-green">
              Action Required
            </p>
            <h2 className="mt-0.5 font-cabinet font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
              Introductions waiting for your{" "}
              <span className="text-brand-green underline decoration-brand-green/35 decoration-2 underline-offset-4">
                consent
              </span>
            </h2>
            <p className="mt-1.5 font-mulish text-sm text-slate-600">
              Your email and phone number are never shown publicly. We only
              share your contact details after you accept an introduction below.
            </p>
          </div>

          <span className="self-start sm:self-end px-3 py-1 rounded-lg bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
            {pendingIntros.length} pending
          </span>
        </div>

        {pendingIntros.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-2">
            <h3 className="font-cabinet font-bold text-lg text-navy">
              No pending introduction requests right now
            </h3>
            <p className="font-mulish text-sm text-slate-500 max-w-md mx-auto">
              When an employer shortlists your profile and NitHub Admin reviews
              their request, it will appear here for you to review and approve.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {pendingIntros.map((intro) => {
              const isDeclining = decliningId === intro.id;

              return (
                <article
                  key={intro.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  <div className="h-1.5 w-full bg-navy" />

                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Top Row: Company Name & Engagement Type */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-cabinet font-extrabold text-xl sm:text-2xl text-navy">
                          {intro.company_name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                          {intro.engagement_type}
                        </span>
                      </div>

                      <span className="font-cabin text-xs text-slate-400">
                        Forwarded by NitHub Admin · {intro.sent_by_admin_at}
                      </span>
                    </div>

                    {/* Role Description */}
                    <div>
                      <p className="font-cabin text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        What they are hiring for
                      </p>
                      <p className="font-mulish text-sm sm:text-base text-slate-700 leading-relaxed">
                        {intro.role_notes}
                      </p>
                    </div>

                    {/* Specific Note for this Intern */}
                    {intro.specific_note && (
                      <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/20">
                        <p className="font-cabin text-xs font-semibold text-brand-green mb-1">
                          Note from {intro.company_name} specifically for you:
                        </p>
                        <p className="font-mulish text-sm text-navy leading-relaxed">
                          “{intro.specific_note}”
                        </p>
                      </div>
                    )}

                    {/* Consent & Action Footer */}
                    <div className="pt-4 border-t border-slate-100">
                      {!isDeclining ? (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <p className="font-mulish text-xs text-slate-500 max-w-xl leading-relaxed">
                            By accepting, you give NitHub consent to share your
                            email (
                            <strong className="font-semibold text-navy">
                              {internEmail}
                            </strong>
                            )
                            {internPhone ? ` and phone (${internPhone})` : ""}{" "}
                            with{" "}
                            <strong className="font-semibold text-navy">
                              {intro.company_name}
                            </strong>
                            .
                          </p>

                          <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setDecliningId(intro.id);
                                setDeclineReason("");
                              }}
                              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 font-cabin text-xs sm:text-sm font-semibold hover:border-slate-400 hover:text-navy transition-colors cursor-pointer"
                            >
                              Decline
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAccept(intro)}
                              className="px-5 py-2.5 rounded-xl bg-brand-green text-white font-cabin text-xs sm:text-sm font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shadow-xs"
                            >
                              Accept &amp; Share My Contact ✓
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <label
                            htmlFor={`decline-reason-${intro.id}`}
                            className="block font-cabinet font-bold text-sm text-navy"
                          >
                            Let NitHub Admin know why you’re declining{" "}
                            <span className="font-mulish font-normal text-xs text-slate-400">
                              (optional)
                            </span>
                          </label>
                          <input
                            id={`decline-reason-${intro.id}`}
                            type="text"
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="e.g. Already accepted another offer, or currently focused on school exams"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mulish text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy"
                          />
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => setDecliningId(null)}
                              className="px-3.5 py-1.5 rounded-lg font-cabin text-xs font-semibold text-slate-500 hover:text-navy cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmDecline(intro.id)}
                              className="px-4 py-1.5 rounded-lg bg-navy text-white font-cabin text-xs font-semibold hover:bg-navy/90 cursor-pointer"
                            >
                              Confirm decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Past & Responded Introductions */}
      {historyIntros.length > 0 && (
        <section>
          <div className="pb-4 border-b border-slate-200 mb-5">
            <h3 className="font-cabinet font-bold text-xl text-navy">
              Past Introduction Responses ({historyIntros.length})
            </h3>
            <p className="font-mulish text-xs sm:text-sm text-slate-500">
              A record of companies you’ve already responded to.
            </p>
          </div>

          <div className="space-y-3.5">
            {historyIntros.map((intro) => {
              const isAccepted = intro.consent_status === "accepted";

              return (
                <div
                  key={intro.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-cabinet font-bold text-lg text-navy">
                        {intro.company_name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-cabin text-xs">
                        {intro.engagement_type}
                      </span>
                      {isAccepted ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-green/10 text-brand-green font-cabin text-xs font-semibold">
                          Accepted &amp; Contact Shared ✓
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-cabin text-xs font-semibold">
                          Declined
                        </span>
                      )}
                    </div>

                    <p className="font-mulish text-xs text-slate-600 line-clamp-2">
                      {intro.role_notes}
                    </p>

                    {intro.decline_reason && !isAccepted && (
                      <p className="font-mulish text-xs text-slate-400">
                        Reason shared with NitHub: “{intro.decline_reason}”
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {!isAccepted && (
                      <button
                        type="button"
                        onClick={() => handleAccept(intro)}
                        className="font-cabin text-xs font-semibold text-brand-green hover:underline underline-offset-4 cursor-pointer"
                      >
                        Change to Accept
                      </button>
                    )}
                    <span className="font-cabin text-xs text-slate-400">
                      {intro.responded_at || "Responded"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Celebratory Thumbs-Up & Full-Screen Confetti Consent Popup Modal */}
      {celebratingIntro && (
        <>
          <ConfettiCanvas />

          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-celebration-title"
          >
            {/* Backdrop */}
            <div
              onClick={() => setCelebratingIntro(null)}
              className="fixed inset-0 bg-navy/55 backdrop-blur-[2px] transition-opacity"
            />

            {/* Modal Box */}
            <div
              style={{ width: "100%", maxWidth: "460px" }}
              className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-modal-up"
            >
              {/* Top Navy Celebration Banner with Thumbs-Up */}
              <div className="relative bg-navy text-white px-6 pt-10 pb-8 text-center overflow-hidden">
                {/* Animated Thumbs-Up Badge */}
                <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-brand-green/40 animate-soft-ripple"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-brand-green text-white flex items-center justify-center shadow-lg animate-thumbs-up">
                    {/* Crisp Thumbs-Up SVG Icon */}
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                      />
                    </svg>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-brand-green/25 text-brand-green-light font-cabin text-xs font-semibold uppercase tracking-wider">
                  Consent Confirmed
                </span>

                <h2
                  id="consent-celebration-title"
                  className="mt-2.5 font-cabinet font-extrabold text-2xl sm:text-3xl text-white tracking-tight"
                >
                  You’re connecting with {celebratingIntro.company_name}!
                </h2>

                <p className="mt-2 font-mulish text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  We’ve let the NitHub placement team know you’re ready to meet{" "}
                  <strong className="text-white font-semibold">
                    {celebratingIntro.company_name}
                  </strong>{" "}
                  regarding their{" "}
                  <strong className="text-white font-semibold">
                    {celebratingIntro.engagement_type.toLowerCase()}
                  </strong>
                  .
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/20 space-y-2">
                  <p className="font-cabinet font-bold text-sm text-navy">
                    Contact details shared with NitHub Placement Team
                  </p>
                  <div className="font-mulish text-xs text-slate-600 space-y-1">
                    <p>
                      <span className="text-slate-400">Email:</span>{" "}
                      <strong className="font-semibold text-navy">
                        {internEmail}
                      </strong>
                    </p>
                    {internPhone && (
                      <p>
                        <span className="text-slate-400">
                          Phone / WhatsApp:
                        </span>{" "}
                        <strong className="font-semibold text-navy">
                          {internPhone}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>

                <p className="font-mulish text-xs text-slate-500 text-center leading-relaxed">
                  NitHub will send a direct introduction email to you and the{" "}
                  <strong className="font-semibold text-navy">
                    {celebratingIntro.company_name}
                  </strong>{" "}
                  team shortly. Keep an eye on your inbox!
                </p>

                <button
                  type="button"
                  onClick={() => setCelebratingIntro(null)}
                  className="w-full py-3 px-5 rounded-xl bg-brand-green text-white font-cabin text-sm font-semibold hover:bg-brand-green/90 transition-colors cursor-pointer shadow-xs"
                >
                  Awesome, back to my workspace
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



