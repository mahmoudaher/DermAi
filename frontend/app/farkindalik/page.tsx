"use client";

const tips = [
  "ABCDE kuralı: Asimetri, Sınır düzensizliği, Renk değişikliği, Çap >6mm, Evrim/değişim.",
  "Güneş koruması: SPF 30+ kullanın, 2 saatte bir yenileyin, 11-16 arası güneşten kaçının.",
  "Kendi kendine cilt muayenesi: Aynada tüm vücudu 1-2 ayda bir kontrol edin.",
  "Aile öyküsü veya açık ten/çok ben varsa yılda en az bir dermatoloji kontrolü.",
  "Yeni çıkan, hızla büyüyen, kanayan veya kaşınan lezyonları ertelemeyin.",
];

const steps = [
  { title: "1. Doğru ışık", desc: "Tam aydınlatma altında tüm cildi inceleyin." },
  { title: "2. Aynalar", desc: "Sırt ve ense için el aynası veya yardım alın." },
  { title: "3. Fotoğraf kaydı", desc: "Şüpheli benleri fotoğraflayıp değişimi izleyin." },
  { title: "4. Not tutma", desc: "Tarih ve gözlemleri kısaca not alın." },
];

export default function FarkindalikPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <p className="text-sm uppercase tracking-wide text-emerald-300/80">
            Farkındalık
          </p>
          <h1 className="text-3xl font-bold text-white">
            Erken Tanı İçin Bilinçlenme Rehberi
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Cilt kanserlerinde erken tespit, tedavi başarısını artırır. Aşağıdaki
            öneriler bilgilendirme amaçlıdır; tanı ve tedavi için dermatoloğa başvurun.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <div
              key={tip}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow-lg shadow-black/20 backdrop-blur hover-lift animate-fade-up"
              style={{ animationDelay: `${100 + tips.indexOf(tip) * 40}ms` }}
            >
              {tip}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-inner space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-xl font-semibold text-emerald-100">Kendi kendine muayene</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover-lift">
                <p className="text-sm font-semibold text-white">{s.title}</p>
                <p className="text-xs text-slate-200 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-50 animate-fade-up" style={{ animationDelay: "260ms" }}>
          <p className="text-sm">
            <strong>Uyarı:</strong> DermAI sonuçları klinik muayene yerine geçmez. Her türlü
            şüpheli lezyonda dermatoloji uzmanına başvurun.
          </p>
        </div>
      </div>
    </div>
  );
}

