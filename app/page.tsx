import Link from "next/link";

export default function Home() {
  const platforms = [
    { name: "يوتيوب", sub: "أرباح الفيديوهات الطويلة", tab: "youtube", icon: "🎬" },
    { name: "تيك توك", sub: "برنامج مكافآت المبدعين", tab: "tiktok", icon: "🎵" },
    { name: "إنستغرام ريلز", sub: "تسعير الصفقات الإعلانية", tab: "instagram", icon: "instagram" },
    { name: "بينتريست", sub: "أرباح التسويق بالعمولة", tab: "pinterest", icon: "📌" },
  ];

  return (
    <main className="max-w-4xl mx-auto p-4 dir-rtl text-center">
      <h1 className="text-3xl font-bold my-4 text-white">اختر محرك الحساب</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {platforms.map((p) => (
          <Link
            key={p.tab}
            href={`/creator?tab=${p.tab}`}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-4 rounded-xl text-right transition-all block"
          >
            <div className="font-bold text-white">{p.name}</div>
            <div className="text-xs text-gray-400 mt-1">{p.sub}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
