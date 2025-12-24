"use client";

const items = [
  {
    title: "Melanom (mel)",
    desc: "Melanosit kaynaklı, erken evrede yakalanması kritik olan malign lezyon.",
  },
  {
    title: "Bazal Hücreli Karsinom (bcc)",
    desc: "En sık görülen cilt kanseri; genellikle yavaş ilerler, metastaz riski düşüktür.",
  },
  {
    title: "Aktinik Keratoz (akiec)",
    desc: "Güneş hasarına bağlı prekanseröz lezyon; skuamöz hücreli karsinom gelişebilir.",
  },
  {
    title: "Benign Keratoz (bkl)",
    desc: "Seboreik keratoz veya benzeri iyi huylu hiperkeratotik lezyonlar.",
  },
  {
    title: "Dermatofibrom (df)",
    desc: "İyi huylu fibröz nodül; genellikle travma sonrası gelişir.",
  },
  {
    title: "Melanositik Nevus (nv)",
    desc: "Benign benler; asimetri, renk, sınır değişiminde değerlendirme gerekir.",
  },
  {
    title: "Vasküler Lezyon (vasc)",
    desc: "Hemanjiyom, anjiyokeratom gibi damar kaynaklı iyi huylu lezyonlar.",
  },
];

export default function HastaliklarPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <p className="text-sm uppercase tracking-wide text-emerald-300/80">
            Klinik Bilgi
          </p>
          <h1 className="text-3xl font-bold text-white">
            DermAI Sınıfları ve Açıklamaları
          </h1>
          <p className="text-slate-300 max-w-3xl">
            DermAI yedi sınıfı destekler. Aşağıdaki özetler sadece bilgilendirme
            amaçlıdır; klinik tanı ve tedavi için dermatolog değerlendirmesi gerekir.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-lg shadow-black/20 hover-lift animate-fade-up"
              style={{ animationDelay: `${100 + items.indexOf(item) * 40}ms` }}
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-50 animate-fade-up" style={{ animationDelay: "220ms" }}>
          <p className="text-sm">
            <strong>Uyarı:</strong> Bu içerikler klinik teşhis yerine geçmez. Herhangi
            bir lezyon şüphesinde dermatoloji uzmanına başvurunuz.
          </p>
        </div>
      </div>
    </div>
  );
}

