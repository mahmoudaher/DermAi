"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  filename: string;
  originalname: string;
}

const diseaseLabels: Record<string, string> = {
  akiec: "Aktinik Keratoz",
  bcc: "Bazal Hücreli Karsinom",
  bkl: "Benign Keratoz",
  df: "Dermatofibrom",
  mel: "Melanom",
  nv: "Melanositik Nevus",
  vasc: "Vasküler Lezyon",
};

const faqs = [
  {
    q: "Hangi dosya formatlarını destekliyor?",
    a: "JPG, JPEG, PNG, GIF ve WEBP formatlarını destekliyoruz. Maksimum dosya boyutu 10MB'dir.",
  },
  {
    q: "Bu araç ücretsiz mi?",
    a: "Bu sürüm eğitim ve demo amaçlıdır. Ücretlendirme ve lisanslama, üretim kullanımına göre yapılandırılabilir.",
  },
  {
    q: "Sonuçlarım kaydediliyor mu?",
    a: "Varsayılan kurulumda sonuçlar yalnızca analiz için kullanılır. Opsiyonel olarak MongoDB ile kayıt özelliği eklenebilir.",
  },
  {
    q: "Bu araç doktorun yerini tutar mı?",
    a: "Hayır. DermAI sadece karar desteği sağlar; tanı ve tedavi için mutlaka dermatoloji uzmanına başvurulmalıdır.",
  },
];

const imageTypeRegex = /^image\/(jpg|jpeg|png|gif|webp)$/;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!imageTypeRegex.test(selectedFile.type)) {
        setError(
          "Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, GIF, WEBP)"
        );
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Dosya boyutu 10MB altında olmalıdır");
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Lütfen bir görsel seçin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:3000/inference/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Sunucu hatası: ${response.status}`;
        
        if (response.status === 404) {
          errorMessage = "Backend sunucusu çalışmıyor. Lütfen backend sunucusunu başlatın (port 3000).";
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // JSON parse failed, use default message
          }
        }
        
        throw new Error(errorMessage);
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun (http://localhost:3000).");
      } else {
        setError(err instanceof Error ? err.message : "Görsel işlenemedi");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Section */}
        <section className="grid gap-10 lg:grid-cols-2 items-start">
          <div
            className="space-y-6 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm text-emerald-200 hover-lift">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gerçek zamanlı AI tanılama</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                DermAI: Deri Lezyonları için Akıllı Analiz
              </h1>
              <p className="text-lg text-slate-300">
                Görselinizi yükleyin, DermAI yedi sınıf arasında olası tanıyı ve
                güven skorunu saniyeler içinde sunsun. Klinik karar desteği için
                tasarlandı.
              </p>
            </div>
            <Link
              href="#upload-section"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-slate-900 font-semibold shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/40"
            >
              Analize Başla
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Right Column: Image Upload Card */}
          <div
            id="upload-section"
            className="animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <div className="rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl p-8 hover-lift transition">
              {result === null ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-emerald-200">
                      Görsel Yükleme
                    </p>
                    <p className="text-xs text-slate-300">
                      Desteklenen formatlar: JPG, PNG, GIF, WEBP (≤10MB)
                    </p>
                  </div>

                  <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/5 px-6 py-8 transition hover:border-emerald-400 hover:bg-emerald-500/10 hover-lift">
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative space-y-4 text-center">
                      {preview ? (
                        <div className="flex justify-center">
                          <Image
                            src={preview}
                            alt="Önizleme"
                            width={320}
                            height={320}
                            className="rounded-xl border border-white/10 shadow-lg object-cover max-h-72"
                          />
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-emerald-200/80"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex flex-col items-center gap-2 text-sm text-slate-200">
                        <label className="relative cursor-pointer rounded-full bg-emerald-500 px-4 py-2 font-medium text-slate-900 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30">
                          <span>
                            {preview ? "Görseli değiştir" : "Görsel seç"}
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                          />
                        </label>
                        <p className="text-xs text-slate-400">
                          veya sürükleyip bırakın
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-cyan-500 py-3 text-center font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5 text-slate-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Analiz ediliyor...</span>
                      </div>
                    ) : (
                      "Görseli Analiz Et"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {preview && (
                    <div
                      className="space-y-3 text-center animate-fade-up"
                      style={{ animationDelay: "120ms" }}
                    >
                      <h2 className="text-xl font-semibold text-slate-100">
                        Yüklediğiniz Görsel
                      </h2>
                      <Image
                        src={preview}
                        alt="Yüklenen görsel"
                        width={420}
                        height={420}
                        className="mx-auto rounded-2xl border border-white/10 shadow-xl object-cover max-h-[420px]"
                      />
                    </div>
                  )}

                  <div
                    className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-inner animate-fade-up"
                    style={{ animationDelay: "180ms" }}
                  >
                    <h2 className="text-2xl font-bold text-emerald-100 mb-3 text-center">
                      Tahmin Sonucu
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-emerald-200 mb-1">
                          Olası Tanı
                        </p>
                        {result && (
                          <>
                            <p className="text-3xl font-bold text-white">
                              {diseaseLabels[result.predicted_class] ||
                                result.predicted_class}
                            </p>
                            <p className="text-xs text-slate-300 mt-1">
                              Sınıf: {result.predicted_class.toUpperCase()}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="space-y-2">
                        {result && (
                          <>
                            <div className="flex items-center justify-between text-sm text-emerald-200">
                              <span>Güven Skoru</span>
                              <span className="font-semibold text-white">
                                {(result.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-white/10">
                              <div
                                className="h-3 rounded-full bg-linear-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                                style={{
                                  width: `${(result.confidence * 100).toFixed(
                                    1
                                  )}%`,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-50 animate-fade-up"
                    style={{ animationDelay: "220ms" }}
                  >
                    <p className="text-sm">
                      <strong>Uyarı:</strong> Bu araç tıbbi teşhis yerine
                      geçmez. Klinik değerlendirme ve dermatolog görüşü
                      gereklidir.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10 hover-lift"
                  >
                    Yeni Bir Görsel Analiz Et
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          className="space-y-8 py-12 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <h2 className="text-4xl font-bold text-white text-center">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-slate-300 text-center max-w-2xl mx-auto">
            DermAI&apos;nin basit ve etkili işleyişiyle deri lezyonlarınızı
            kolayca analiz edin.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">
                Fotoğraf Yükle
              </h3>
              <p className="text-slate-300">
                Cihazınızdan bir deri lezyonu fotoğrafı seçin veya sürükleyip
                bırakın.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">AI Analizi</h3>
              <p className="text-slate-300">
                Yüksek performanslı yapay zeka modelimiz görseli anında analiz
                eder.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Sonuçları Al</h3>
              <p className="text-slate-300">
                Olası tanı ve güven skorunu detaylı bir raporla görüntüleyin.
              </p>
            </div>
          </div>
        </section>

        <section
          className="space-y-8 py-12 animate-fade-up"
          style={{ animationDelay: "260ms" }}
        >
          <h2 className="text-4xl font-bold text-white text-center">
            Neden DermAI?
          </h2>
          <p className="text-lg text-slate-300 text-center max-w-2xl mx-auto">
            DermAI&apos;nin sunduğu temel özellikler ve avantajlarla tanışın.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-emerald-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white">
                Yüksek Doğruluk
              </h3>
              <p className="text-slate-300">
                Eğitilmiş modelimiz, yedi farklı lezyon sınıfını yüksek
                doğrulukla ayırt eder.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-cyan-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white">
                Anlık Sonuçlar
              </h3>
              <p className="text-slate-300">
                Görsel yüklemenizin ardından saniyeler içinde hızlı ve güvenilir
                sonuçlar alın.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-purple-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white">
                Güvenli ve Gizli
              </h3>
              <p className="text-slate-300">
                Görselleriniz sadece analiz için kullanılır ve gizliliğiniz ön
                planda tutulur.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover-lift">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-orange-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3-6v6m-3-4.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.75a3 3 0 00-3-3H9.563M12 12.75l-3 3m0 0l-3-3m3-6v6m-3-4.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.75a3 3 0 00-3-3H9.563"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white">
                Klinik Destek
              </h3>
              <p className="text-slate-300">
                Dermatologlara ve sağlık profesyonellerine karar verme
                süreçlerinde yardımcı olur.
              </p>
            </div>
          </div>
        </section>

        <section
          className="space-y-8 py-12 animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <h2 className="text-4xl font-bold text-white text-center">
            Önemli Tıbbi Uyarı
          </h2>
          <div className="max-w-3xl mx-auto rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 shadow-lg">
            <p className="text-lg text-amber-50 leading-relaxed">
              DermAI, yapay zeka destekli bir ön analiz aracıdır ve tıbbi teşhis
              koyma veya tedavi önerme amacı taşımaz. Elde edilen sonuçlar
              yalnızca bilgilendirme amaçlıdır ve profesyonel bir dermatolog
              muayenesinin yerini tutmaz. Herhangi bir sağlık endişeniz varsa,
              lütfen nitelikli bir sağlık uzmanına danışın.
            </p>
          </div>
        </section>

        <section
          className="space-y-8 py-12 animate-fade-up"
          style={{ animationDelay: "380ms" }}
        >
          <h2 className="text-4xl font-bold text-white text-center">
            Sıkça Sorulan Sorular
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-white/5 border border-white/10 shadow-lg"
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left text-lg font-semibold text-white hover:bg-white/10 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.q}
                  <svg
                    className={`w-5 h-5 text-emerald-400 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 text-slate-300 text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
