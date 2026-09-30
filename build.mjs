// Statik site üreticisi: site.config.json → dist/
// Kullanım: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import ekSayfalar from "./src/ek-sayfalar.mjs";
import { REHBER_HUB, REHBERLER } from "./src/rehberler.mjs";

const c = JSON.parse(readFileSync("site.config.json", "utf8"));
const OUT = "dist";
const BUGUN = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const adresSatiri = [c.adres.sokak, c.adres.mahalle, `${c.adres.postaKodu} ${c.adres.ilce}/${c.adres.il}`].filter(Boolean).join(", ");
const telLink = `tel:${c.telefon}`;
const digerHatlar = c.digerHatlar || [];
const tumHatlar = [{ telefon: c.telefon, gorunen: c.telefonGorunen, etiket: "1. hat", whatsapp: c.whatsapp }, ...digerHatlar];
const waMini = (h) => h.whatsapp ? `<a class="wa-mini" href="https://wa.me/${h.whatsapp}?text=${encodeURIComponent(WA_GENEL)}" data-track="whatsapp" rel="nofollow noopener" target="_blank" aria-label="${esc(h.gorunen)} WhatsApp">${WA_SVG}</a>` : "";
const hatLink = (h) => `<a href="tel:${h.telefon}" data-track="call">${esc(h.gorunen)}</a>`;
const waLink = (metin) => `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(metin)}`;
const WA_GENEL = "Merhaba, Kars'ta taksi istiyorum. Konumum: ";
const haritaLinki = c.googleHaritaLinki || `https://www.google.com/maps/search/?api=1&query=${c.konum.lat},${c.konum.lng}`;

// ---------- İkonlar (24x24, çizgi) ----------
const IK = {
  tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  sehir: '<path d="M3 21h18M5 21V7l6-3v17M11 21V10h8v11M8 9h.01M8 12h.01M8 15h.01M8 18h.01M14 13h2M14 16h2"/>',
  ucak: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  dag: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.1 15.1c2.6-1.6 5.2-1.4 7.9.4 2.7 1.9 5.5 2 8.2.2"/>',
  ani: '<path d="M3 22h18M5 22V11M19 22V11M3 11h18L12 4 3 11zM9 22v-5a3 3 0 0 1 6 0v5"/>',
  tren: '<path d="M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM4 11h16M12 3v8M8 15h.01M16 15h.01M8 18l-2 3M16 18l2 3"/>',
  otobus: '<path d="M4 17V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11zM4 11h16M7 17v3M17 17v3M8 14h.01M16 14h.01M2 8v2M22 8v2"/>',
  kar: '<path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>',
  saat: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  ay: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  kalkan: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  fis: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2zM8 8h8M8 12h8M8 16h5"/>',
  pusula: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  bavul: '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 6h16v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM9 10v7M15 10v7"/>',
  ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  yol: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  takvim: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  mesaj: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  kapat: '<path d="M18 6 6 18M6 6l12 12"/>',
};
const ikon = (ad, cls = "") => `<svg class="ik${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IK[ad]}</svg>`;
const WA_SVG = '<svg class="ik" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.46-.72-1.7-.8-.22-.08-.39-.12-.55.13-.17.24-.63.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43l-.75-1.8c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.14 3.66c1.54.66 2.14.72 2.9.6.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.15-1.18-.07-.1-.23-.16-.48-.28z"/></svg>';

// ---------- Sayfa içerikleri ----------
// Her sayfa tek bir arama niyetini hedefler. Mesafeler "yaklaşık" olarak verilir.
const sayfalar = [
  {
    yol: "/",
    baslik: `Kars Taksi 7/24 | ${c.marka}`,
    aciklama: `Kars'ta 7/24 taksi. Havalimanı, otogar ve gar karşılama; Sarıkamış, Ani ve ilçelere transfer. Google'da ${c.googlePuan} puan. Hemen arayın: ${c.telefonGorunen}`,
    h1: "Kars Taksi",
    h1Vurgu: "gece gündüz kapınızda.",
    ust: `${c.durak} · Kars merkez`,
    giris: "Tek telefonla şehir içi yolculuk, havalimanı ve gar karşılama, Sarıkamış, Ani ve Çıldır transferi. Kars'ı iyi bilen yerel taksi.",
    waMetin: WA_GENEL,
    anasayfa: true,
    sss: [
      ["Kars'ta gece taksi bulabilir miyim?", `Evet. ${c.durak} gece gündüz, hafta sonu ve bayramlarda da hizmet verir. Aramanız yeterli.`],
      ["Şehir içi ücret nasıl hesaplanıyor?", "Şehir içi yolculuklar taksimetre ile ücretlendirilir. Şehir dışı yolculuklarda fiyat yola çıkmadan önce telefonda netleştirilir."],
      ["Havalimanından ya da gardan alıyor musunuz?", "Evet. Uçuş numaranızı veya tren saatinizi iletin, iniş/varış saatinize göre sizi karşılayalım."],
      ["Konumumu nasıl bildiririm?", "WhatsApp butonuna dokunup konumunuzu paylaşmanız en hızlı yoldur. Telefonla adres tarif etmeniz de yeterli."],
      ["Sarıkamış veya Ani'ye götürüyor musunuz?", "Evet. Sarıkamış kayak merkezi, Ani Ören Yeri, Çıldır Gölü ve çevre ilçelere transfer yapıyoruz. Ani için bekleme dahil gidiş-dönüş planlanabilir."],
    ],
  },
  {
    yol: "/kars-havalimani-taksi",
    kisa: "Havalimanı",
    ikon: "ucak",
    baslik: "Kars Havalimanı Taksi | Uçuşa Göre Karşılama, 7/24",
    aciklama: `Kars Harakani Havalimanı'nda uçuşunuza göre karşılama. Merkeze ~15 dk; otelinize ya da Sarıkamış'a doğrudan transfer. Gece uçuşları dahil. ${c.telefonGorunen}`,
    h1: "Kars Havalimanı Taksi",
    ust: "Harakani Havalimanı · Karşılama",
    ozet: "İnişte karşılama, rötar takibi, gece uçuşları dahil.",
    giris: "Kars Harakani Havalimanı ile şehir merkezi arasında hızlı ve güvenilir taksi. Uçuş numaranızı gönderin, inişte sizi bekleyelim.",
    mesafe: [["Havalimanı → Kars merkez", "~8 km", "~15 dk"], ["Havalimanı → Sarıkamış", "~60 km", "1 saat"], ["Havalimanı → Ani Ören Yeri", "~50 km", "50 dk"]],
    maddeler: [
      ["ucak", "Uçuşa göre karşılama", "Uçuş numaranızı WhatsApp'tan iletin; rötar olursa saatinizi biz takip ederiz."],
      ["ay", "Gece ve sabah erken uçuşlar", "Saat kaç olursa olsun havalimanına bırakır, havalimanından alırız."],
      ["bavul", "Bagaj ve kayak ekipmanı", "Valiz ve kayak çantalarınızı araca biz yerleştiririz."],
      ["pin", "Doğrudan otele", "Kars merkez, Sarıkamış ya da çevre ilçelerdeki otelinize kapıdan kapıya."],
    ],
    waMetin: "Merhaba, Kars Havalimanı'ndan taksi istiyorum. Uçuş no / saat: ",
    sss: [
      ["Havalimanında nerede buluşuyoruz?", "Geliş salonu çıkışında buluşuruz. Varıştan önce sizi arayıp araç yerini bildiririz."],
      ["Uçağım rötar yaparsa ne olur?", "Uçuş numaranızı ilettiyseniz yeni iniş saatinize göre gelir, sizi bekleriz."],
      ["Havalimanından Kars merkeze ne kadar sürer?", "Durağımızdan havalimanına yol yaklaşık 8 km; trafik ve hava durumuna göre genellikle 15 dakika civarı sürer."],
    ],
  },
  {
    yol: "/sarikamis-taksi",
    kisa: "Sarıkamış",
    ikon: "dag",
    baslik: "Sarıkamış Taksi Transferi | Kars Havalimanı, Gar ve Merkez",
    aciklama: `Kars Havalimanı, gar ya da şehir merkezinden Sarıkamış Kayak Merkezi ve otellerine taksi (~57 km, ~50 dk). Fiyat yola çıkmadan belli. ${c.telefonGorunen}`,
    h1: "Kars – Sarıkamış Taksi Transferi",
    ust: "Cıbıltepe Kayak Merkezi · Oteller",
    ozet: "Havalimanı ve gardan doğrudan kayak otellerine.",
    giris: "Kars Havalimanı, tren garı veya şehir merkezinden Sarıkamış'taki otelinize ve kayak merkezine doğrudan transfer. Kış aylarında yol durumunu kontrol ederek yola çıkarız.",
    mesafe: [["Kars merkez → Sarıkamış", "~60 km", "1 saat"], ["Havalimanı → Sarıkamış", "~60 km", "1 saat"], ["Sarıkamış → Kayak merkezi", "~4 km", "10 dk"]],
    maddeler: [
      ["kar", "Kayak sezonu transferi", "Kasım–Mart döneminde havalimanı ve gardan doğrudan Sarıkamış otellerine."],
      ["fis", "Önceden fiyat", "Şehir dışı yolculukta ücret telefonda, yola çıkmadan önce netleşir."],
      ["bavul", "Ekipman sorun değil", "Kayak, snowboard ve valizler için yer ayarlanır."],
      ["takvim", "Dönüş de planlanır", "Tatil bitiminde otelden havalimanına veya gara dönüşünüzü önceden ayırtın."],
    ],
    waMetin: "Merhaba, Sarıkamış'a taksi transferi istiyorum. Tarih / kişi sayısı: ",
    sss: [
      ["Kars'tan Sarıkamış'a taksi ne kadar sürer?", "Normal yol koşullarında yaklaşık 1 saat. Kar yağışında süre uzayabilir; yola çıkmadan durumu kontrol ederiz."],
      ["Sarıkamış transferi için ne kadar önceden aramalıyım?", "Kayak sezonunda en az bir gün önceden ayırtmanızı öneririz. Müsaitsek aynı gün de yola çıkarız."],
      ["Ücret nasıl belirleniyor?", "Şehir dışı yolculuk olduğu için ücret kişi sayısı ve güzergâha göre telefonda önceden belirlenir."],
    ],
  },
  {
    yol: "/ani-oren-yeri-taksi",
    kisa: "Ani Ören Yeri",
    ikon: "ani",
    baslik: "Ani Ören Yeri Taksi | Kars'tan Bekleme Dahil Gidiş-Dönüş",
    aciklama: `Kars'tan Ani Ören Yeri'ne taksi (~46 km, ~40 dk). Otelden alış, gezi boyunca bekleme ve dönüş; fiyat baştan belli. ${c.telefonGorunen}`,
    h1: "Kars – Ani Ören Yeri Taksi",
    ust: "UNESCO Dünya Mirası · Gidiş-dönüş",
    ozet: "Bekleme dahil gidiş-dönüş, otelden alış.",
    giris: "Kars merkezden Ani Ören Yeri'ne taksiyle gidin, gezinizi acele etmeden yapın, sizi bekleyip geri getirelim.",
    mesafe: [["Kars merkez → Ani Ören Yeri", "~45 km", "45 dk"], ["Havalimanı → Ani Ören Yeri", "~50 km", "50 dk"]],
    maddeler: [
      ["saat", "Bekleme dahil", "Gezi süresi boyunca bekler, çıkışta sizi alırız. Süreyi önceden konuşuruz."],
      ["pin", "Otelden alış", "Kars merkezdeki otelinizden alır, dönüşte otele bırakırız."],
      ["pusula", "Kars turu ile birleştirin", "Ani dönüşü Kars Kalesi, Kümbet Camii veya taş binalar sokağına uğrayabiliriz."],
      ["fis", "Fiyat baştan belli", "Gidiş-dönüş ve bekleme ücreti yola çıkmadan netleşir."],
    ],
    waMetin: "Merhaba, Ani Ören Yeri için gidiş-dönüş taksi istiyorum. Tarih / kişi sayısı: ",
    sss: [
      ["Ani'de ne kadar süre bekliyorsunuz?", "Ziyaretçilerin çoğu 2–3 saat ayırır. İstediğiniz süreyi arama sırasında birlikte belirleriz."],
      ["Ani Ören Yeri'ne toplu taşıma var mı?", "Düzenli toplu taşıma oldukça sınırlıdır; bu yüzden ziyaretçilerin çoğu taksi veya özel araçla gider."],
    ],
  },
  {
    yol: "/kars-tren-gari-taksi",
    kisa: "Tren Garı",
    ikon: "tren",
    baslik: "Kars Garı Taksi | Doğu Ekspresi Karşılama ve Otel Transferi",
    aciklama: `Doğu Ekspresi ile Kars'a mı geliyorsunuz? Trenin varışında gar çıkışında karşılar; otelinize, Ani'ye ya da Sarıkamış'a götürürüz. ${c.telefonGorunen}`,
    h1: "Kars Tren Garı Taksi",
    ust: "Doğu Ekspresi · Gar karşılama",
    ozet: "Doğu Ekspresi varışında gar çıkışında karşılama.",
    giris: "Doğu Ekspresi ya da Turistik Doğu Ekspresi ile Kars'a mı geliyorsunuz? Trenin varış saatinde gar çıkışında olalım, sizi otelinize götürelim.",
    mesafe: [["Kars Garı → Merkez oteller", "~2–3 km", "5–10 dk"], ["Kars Garı → Havalimanı", "~8 km", "15 dk"], ["Kars Garı → Sarıkamış", "~60 km", "1 saat"]],
    maddeler: [
      ["tren", "Tren saatine göre", "Tren gecikirse de bekleriz; sefer tarihinizi iletmeniz yeterli."],
      ["bavul", "Uzun yolculuğun ardından", "Valizlerinizi taşır, kapıdan kapıya otelinize bırakırız."],
      ["ani", "Ani ve Kars turu", "Ertesi gün için Ani Ören Yeri veya şehir turu planlayabiliriz."],
      ["saat", "Dönüş treni", "Kalkış saatinize göre otelinizden alır, gara zamanında yetiştiririz."],
    ],
    waMetin: "Merhaba, Kars Garı'nda karşılama için taksi istiyorum. Tren / tarih: ",
    sss: [
      ["Tren geç gelirse bekliyor musunuz?", "Evet. Sefer bilginizi ilettiyseniz trenin gerçek varış saatine göre gar çıkışında oluruz."],
      ["Gardan şehir merkezine yürünür mü?", "Mesafe kısa olsa da valizle, karda veya gece taksi çok daha rahattır; yolculuk 5–10 dakika sürer."],
    ],
  },
  {
    yol: "/kars-otogar-taksi",
    kisa: "Otogar",
    ikon: "otobus",
    baslik: "Kars Otogar Taksi | Terminalden Şehir Merkezine 7/24",
    aciklama: `Kars Şehirlerarası Otobüs Terminali'nden merkeze, otelinize ya da hastaneye taksi (~7 km, ~12 dk). Gece gelen otobüsler için de açığız. ${c.telefonGorunen}`,
    h1: "Kars Otogar Taksi",
    ust: "Şehirlerarası otobüs · 7/24",
    ozet: "Gece gelen otobüsler dahil, merkeze yaklaşık 12 dakika.",
    giris: "Otobüsle Kars'a geldiğinizde bekleme yapmadan şehir merkezine ulaşın. Gecenin geç saatinde de bir telefonla otogardayız.",
    mesafe: [["Otogar → Kars merkez", "~7 km", "~12 dk"], ["Otogar → Havalimanı", "şehir geçişi", "15–20 dk"]],
    maddeler: [
      ["ay", "Gece otobüsleri", "Sabaha karşı gelen otobüsler için de telefonla ulaşabilirsiniz."],
      ["sehir", "Hastane ve üniversite", "Kafkas Üniversitesi, hastaneler ve yurtlara doğrudan."],
      ["yol", "Aktarma", "Otogardan havalimanına ya da tren garına aktarma."],
      ["fis", "Taksimetre ile", "Şehir içi yolculuklar taksimetre ile ücretlendirilir."],
    ],
    waMetin: "Merhaba, Kars Otogarı'ndan taksi istiyorum. Varış saatim: ",
    sss: [
      ["Otogardan merkeze ne kadar sürer?", "Şehirlerarası otobüs terminali merkeze yaklaşık 7 km; trafiğe göre genellikle 12 dakika civarı sürer."],
    ],
  },
  {
    yol: "/cildir-golu-taksi",
    kisa: "Çıldır Gölü",
    ikon: "kar",
    baslik: "Çıldır Gölü Taksi | Kars'tan Atlı Kızak Gezisi, Gidiş-Dönüş",
    aciklama: `Kars'tan Çıldır Gölü'ne taksi (~64 km, ~1 sa 15 dk). Kışın donmuş gölde atlı kızak, yazın göl kıyısı; bekleme dahil gidiş-dönüş. ${c.telefonGorunen}`,
    h1: "Kars – Çıldır Gölü Taksi",
    ust: "Atlı kızak · Buz üstü balıkçılık",
    ozet: "Donmuş gölde atlı kızak için gidiş-dönüş.",
    giris: "Kışın donan Çıldır Gölü'nde atlı kızak ve buz üstü balıkçılık görmek isteyenler için Kars'tan gidiş-dönüş taksi.",
    mesafe: [["Kars merkez → Çıldır Gölü", "yola göre", "1–1,5 saat"]],
    maddeler: [
      ["yol", "Gidiş-dönüş", "Göl kıyısında gezinizi yapın, sizi bekleyip Kars'a geri getirelim."],
      ["kar", "Kış yolları", "Yola çıkmadan hava ve yol durumunu kontrol ederiz."],
      ["pusula", "Günü birleştirin", "Rota uygunsa dönüşte başka noktalara da uğrayabiliriz."],
      ["fis", "Fiyat baştan belli", "Şehir dışı yolculukta ücret önceden netleşir."],
    ],
    waMetin: "Merhaba, Çıldır Gölü için gidiş-dönüş taksi istiyorum. Tarih / kişi sayısı: ",
    sss: [
      ["Çıldır Gölü ne zaman donar?", "Hava koşullarına bağlı olarak genellikle kış ortasında donar; atlı kızak dönemi yıldan yıla değişir. Gitmeden önce birlikte kontrol edebiliriz."],
    ],
  },
];

sayfalar.push(...ekSayfalar(c));
const hizmetSayfalari = sayfalar.filter((s) => !s.anasayfa);
const anaSayfalar = hizmetSayfalari.filter((s) => !s.grup);
const ilceSayfalari = hizmetSayfalari.filter((s) => s.grup === "ilce");
const sehirSayfalari = hizmetSayfalari.filter((s) => s.grup === "sehir");

// ---------- Yapısal veri ----------
const isletmeId = `${c.domain}/#isletme`;
function isletmeSchema() {
  return {
    "@type": ["LocalBusiness", "TaxiStand"],
    "@id": isletmeId,
    name: c.marka,
    alternateName: [c.durak, "Kars Çamlıca Taksi", "Edizer Taksi", `Kars Taksi ${c.plaka}`],
    url: c.domain + "/",
    telephone: c.profilTelefonu || c.telefon,
    sameAs: [c.googleHaritaLinki].filter(Boolean),
    contactPoint: tumHatlar.map((h) => ({ "@type": "ContactPoint", telephone: h.telefon, contactType: "customer service", areaServed: "TR", availableLanguage: "Turkish", hoursAvailable: { "@type": "OpeningHoursSpecification", opens: "00:00", closes: "23:59" } })),
    image: [`${c.domain}/foto/taksi-36t0089-yol-800.webp`, `${c.domain}/foto/taksi-36t0089-sehir-600.webp`, `${c.domain}/og.png`],
    logo: `${c.domain}/icon-512.png`,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      streetAddress: [c.adres.sokak, c.adres.mahalle].filter(Boolean).join(", "),
      addressLocality: c.adres.il,
      addressRegion: c.adres.il,
      postalCode: c.adres.postaKodu,
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: c.konum.lat, longitude: c.konum.lng },
    hasMap: haritaLinki,
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00", closes: "23:59",
    }],
    areaServed: ["Kars", "Sarıkamış", "Ani", "Selim", "Digor", "Arpaçay", "Kağızman", "Susuz", "Akyaka", "Çıldır"].map((n) => ({ "@type": "Place", name: n })),
    makesOffer: hizmetSayfalari.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "TaxiService", name: s.h1, url: c.domain + s.yol, provider: { "@id": isletmeId } },
    })),
  };
}

function schemaFor(s) {
  const graph = [isletmeSchema()];
  if (s.yol === "/" || s.yol === "/en") {
    graph.push({
      "@type": "WebSite",
      "@id": `${c.domain}/#site`,
      name: c.marka,
      alternateName: ["Çamlıca Taksi", "Kars Çamlıca Taksi", "Edizer Taksi"],
      url: c.domain + "/",
      inLanguage: s.dil === "en" ? "en" : "tr",
      publisher: { "@id": isletmeId },
    });
    graph.push({
      "@type": "WebPage",
      "@id": c.domain + (s.yol === "/" ? "/" : s.yol) + "#sayfa",
      url: c.domain + (s.yol === "/" ? "/" : s.yol),
      name: s.baslik,
      isPartOf: { "@id": `${c.domain}/#site` },
      about: { "@id": isletmeId },
      primaryImageOfPage: { "@type": "ImageObject", url: `${c.domain}/foto/taksi-36t0089-yol-800.webp`, width: 800, height: 1000 },
    });
  }
  if (s.tur === "rehber") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kars Taksi", item: c.domain + "/" },
        { "@type": "ListItem", position: 2, name: "Ulaşım rehberi", item: c.domain + "/rehber" },
        { "@type": "ListItem", position: 3, name: s.h1, item: c.domain + s.yol },
      ],
    });
    graph.push({
      "@type": "Article",
      "@id": c.domain + s.yol + "#makale",
      headline: s.h1,
      description: s.aciklama,
      inLanguage: "tr",
      datePublished: s.guncelleme,
      dateModified: s.guncelleme,
      mainEntityOfPage: c.domain + s.yol,
      image: [c.domain + "/og.png"],
      author: { "@id": isletmeId },
      publisher: { "@id": isletmeId },
    });
  } else if (s.kisa) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kars Taksi", item: c.domain + "/" },
        { "@type": "ListItem", position: 2, name: s.h1, item: c.domain + s.yol },
      ],
    });
  }
  if (s.sss?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: s.sss.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

// ---------- Dil ----------
IK.yildiz = '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>';
IK.dunya = '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>';
IK.degis = '<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/>';
IK.hastane = '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>';
IK.kep = '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>';
IK.kamera = '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>';
tumHatlar[0].etiketEn = "Line 1";

const en = (s) => s.dil === "en";
const T = (s, tr, eng) => (en(s) ? eng : tr);
const intl = (g) => "+90 " + g.replace(/^0/, "");
const numara = (s, g) => (en(s) ? intl(g) : g);
const etiket = (s, h) => (en(s) ? h.etiketEn || h.etiket : h.etiket);
const WA_EN = "Hello, I need a taxi in Kars. My location: ";

// ---------- Rota haritası (şematik) ----------
// Koordinatlar Kars'a göre gerçek yönleri korur; yakın noktalar okunabilirlik için büyütülmüştür.
const DURAK = { x: 200, y: 168 };
const DUGUMLER = [
  { yol: "/cildir-golu-taksi", ad: "Çıldır Gölü", adEn: "Lake Çıldır", yerEn: "Lake Çıldır", alt: "1–1,5 sa", altEn: "1–1.5 h", x: 238, y: 48, konum: "r" },
  { yol: "/kars-tren-gari-taksi", ad: "Tren Garı", adEn: "Train Stn.", yerEn: "Kars Train Station", alt: "2–3 km", x: 254, y: 136, konum: "r" },
  { yol: "/kars-otogar-taksi", ad: "Otogar", adEn: "Bus Stn.", yerEn: "Kars Bus Station", alt: "~12 dk", altEn: "~12 min", x: 146, y: 140, konum: "l" },
  { yol: "/kars-havalimani-taksi", ad: "Havalimanı", adEn: "Airport", yerEn: "Kars Airport (KSY)", alt: "~8 km", x: 236, y: 226, konum: "b" },
  { yol: "/ani-oren-yeri-taksi", ad: "Ani", adEn: "Ani Ruins", yerEn: "Ani Ruins", alt: "~45 km", x: 344, y: 196, konum: "b" },
  { yol: "/sarikamis-taksi", ad: "Sarıkamış", adEn: "Sarıkamış", yerEn: "Sarıkamış Ski Resort", alt: "~60 km", x: 78, y: 262, konum: "b" },
];

function rotaHaritasi(s, vurguYol) {
  const hepsi = !vurguYol;
  const rotalar = DUGUMLER.map((n, i) => {
    const mx = (DURAK.x + n.x) / 2, my = (DURAK.y + n.y) / 2;
    const dx = n.x - DURAK.x, dy = n.y - DURAK.y;
    const k = 0.2 * (i % 2 ? 1 : -1);
    const d = `M${DURAK.x} ${DURAK.y} Q${(mx - dy * k).toFixed(1)} ${(my + dx * k).toFixed(1)} ${n.x} ${n.y}`;
    const aktif = hepsi || n.yol === vurguYol;
    const sure = (3 + Math.hypot(dx, dy) / 60).toFixed(1);
    return `<path d="${d}" class="r-taban"/>` + (aktif
      ? `<path id="r${i}" d="${d}" class="r-aktif"${hepsi ? ` style="animation-delay:-${i * 0.4}s"` : ""}/><circle r="3.5" class="r-arac"><animateMotion dur="${sure}s" begin="${hepsi ? i * 0.35 : 0}s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.85;1" calcMode="linear"><mpath href="#r${i}"/></animateMotion></circle>`
      : "");
  }).join("");

  const etiketler = DUGUMLER.map((n) => {
    const aktif = hepsi || n.yol === vurguYol;
    const ad = en(s) ? n.adEn : n.ad, alt = en(s) ? n.altEn || n.alt : n.alt;
    const w = Math.round(Math.max(ad.length * 8, alt.length * 6.6) + 22), h = 40;
    const [ex, ey] = { r: [n.x + 12, n.y - h / 2], l: [n.x - 12 - w, n.y - h / 2], t: [n.x - w / 2, n.y - h - 12], b: [n.x - w / 2, n.y + 12] }[n.konum];
    const href = en(s) ? "#book" : n.yol;
    return `<a href="${href}" class="dugum${aktif ? " aktif" : ""}${n.yol === vurguYol ? " secili" : ""}" data-yer="${esc(en(s) ? n.yerEn : "")}" aria-label="${esc(ad)}">
<circle cx="${n.x}" cy="${n.y}" r="${n.yol === vurguYol ? 12 : 9}" class="d-hale"/><circle cx="${n.x}" cy="${n.y}" r="4.5" class="d-nokta"/>
<rect x="${ex}" y="${ey}" width="${w}" height="${h}" rx="9" class="d-kutu"/>
<text x="${ex + 11}" y="${ey + 17}" class="d-ad">${esc(ad)}</text><text x="${ex + 11}" y="${ey + 32}" class="d-alt">${esc(alt)}</text></a>`;
  }).join("");

  return `<svg class="rota-svg" viewBox="0 0 400 320" role="img" aria-label="${T(s, "Çamlıca Taksi Durağı'ndan Kars çevresindeki noktalara rotalar", "Routes from Çamlıca taxi stand to places around Kars")}">
<defs>
  <pattern id="izgara" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" class="izgara-n"/></pattern>
  <radialGradient id="parilti"><stop offset="0" stop-color="#ffc72c" stop-opacity=".4"/><stop offset="1" stop-color="#ffc72c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="320" fill="url(#izgara)"/>
<g class="halka"><circle cx="${DURAK.x}" cy="${DURAK.y}" r="62"/><circle cx="${DURAK.x}" cy="${DURAK.y}" r="128"/><circle cx="${DURAK.x}" cy="${DURAK.y}" r="196"/></g>
<g class="pusula-g" transform="translate(372 30)"><circle r="14"/><path d="M0 -9 L4 3 L0 1 L-4 3 Z"/><text y="-17">${T(s, "K", "N")}</text></g>
${rotalar}
<circle cx="${DURAK.x}" cy="${DURAK.y}" r="46" fill="url(#parilti)"/>
${etiketler}
<g class="durak-g"><circle cx="${DURAK.x}" cy="${DURAK.y}" r="16" class="durak-dalga"/><circle cx="${DURAK.x}" cy="${DURAK.y}" r="9" class="durak-nokta"/><circle cx="${DURAK.x}" cy="${DURAK.y}" r="3.5" class="durak-ic"/>
<rect x="${DURAK.x - 62}" y="${DURAK.y + 18}" width="124" height="28" rx="14" class="durak-kutu"/><text x="${DURAK.x}" y="${DURAK.y + 36.5}" class="durak-ad">${T(s, "Çamlıca Durağı", "Çamlıca Stand")}</text></g>
</svg>`;
}

function rotaKarti(s) {
  const n = s.mesafe && s.mesafe[0];
  return `<div class="rota-kart" data-reveal>
  <div class="rk-ust">
    <span class="rk-baslik">${ikon("yol")}${n ? T(s, "Rota", "Route") : T(s, "Kars'ta nereye?", "Where to in Kars?")}</span>
    <span class="rk-durum"><span class="canli" aria-hidden="true"></span><span data-saat data-dil="${s.dil || "tr"}">${T(s, "7/24 açık", "Open 24/7")}</span></span>
  </div>
  ${rotaHaritasi(s, n && DUGUMLER.some((d) => d.yol === (s.ilgili || s.yol)) ? (s.ilgili || s.yol) : null)}
  ${n ? `<div class="rk-alt">
    <div class="rk-nokta"><small>Nereden</small><b>${esc(n[0].split(" → ")[0])}</b></div>
    <div class="rk-cizgi" aria-hidden="true"><span>${esc(n[1])}</span></div>
    <div class="rk-nokta sag"><small>Nereye</small><b>${esc(n[0].split(" → ")[1])}</b></div>
    <div class="rk-sure">${ikon("saat")}${esc(n[2])}</div>
  </div>` : `<p class="rk-not">${T(s, "Bir noktaya dokunun · şematik gösterim, mesafeler yaklaşıktır", "Tap a place to plan a ride · schematic, distances approximate")}</p>`}
</div>`;
}

// ---------- Parçalar ----------
const CSS = (readFileSync("src/font.css", "utf8") + readFileSync("src/style.css", "utf8")).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*\n\s*/g, "");
const JS = readFileSync("src/main.js", "utf8");

const plakaHtml = `<span class="plaka" aria-label="Plaka ${esc(c.plaka)}"><span class="plaka-tr">TR</span><span>${esc(c.plaka)}</span></span>`;
const logoHtml = `<span class="logo-isaret" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="logo-yazi"><b>Çamlıca</b><small>Taksi · Kars</small></span>`;

function takipKodu() {
  const t = c.takip;
  const id = t.ga4 || t.googleAdsId;
  if (!id) return "";
  const configs = [t.ga4, t.googleAdsId].filter(Boolean).map((x) => `gtag('config','${x}');`).join("");
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${configs}
window.__donusum={call:${JSON.stringify(t.googleAdsId && t.aramaDonusumEtiketi ? `${t.googleAdsId}/${t.aramaDonusumEtiketi}` : "")},whatsapp:${JSON.stringify(t.googleAdsId && t.whatsappDonusumEtiketi ? `${t.googleAdsId}/${t.whatsappDonusumEtiketi}` : "")}};</script>`;
}

function aramaButonlari(s, cls = "") {
  return `<div class="cta ${cls}">
  <a class="btn btn-ara" href="${telLink}" data-track="call"><span class="btn-ik">${ikon("tel")}</span><span class="btn-m"><b>${T(s, "Hemen Ara", "Call now")}</b><small>${esc(numara(s, c.telefonGorunen))}</small></span></a>
  <a class="btn btn-wa" href="${waLink(s.waMetin)}" data-track="whatsapp" rel="nofollow noopener" target="_blank"><span class="btn-ik">${WA_SVG}</span><span class="btn-m"><b>WhatsApp</b><small>${T(s, "Konum gönder", "Send location")}</small></span></a>
</div>`;
}

function digerHatlarSatiri(s) {
  if (!digerHatlar.length) return "";
  return `<p class="diger-hat"><span>${T(s, "Hat meşgulse", "Line busy?")}</span>${digerHatlar.map((h) => `<span class="hat-cift"><a href="tel:${h.telefon}" data-track="call">${ikon("tel")}${esc(numara(s, h.gorunen))}<small>${esc(etiket(s, h))}</small></a>${waMini(h)}</span>`).join("")}</p>`;
}

const googleRozet = (s, cls = "") => c.googlePuan
  ? `<a class="g-rozet ${cls}" href="${haritaLinki}" rel="noopener" target="_blank"><span class="g-yildiz">${ikon("yildiz")}</span><b>${esc(en(s) ? c.googlePuan.replace(",", ".") : c.googlePuan)}</b><span>${T(s, "Google puanı", "on Google")}</span></a>`
  : "";

function layout(s, govde) {
  const canonical = c.domain + (s.yol === "/" ? "/" : s.yol);
  const navLink = (yol, ad) => `<a href="${yol}"${yol === s.yol ? ' aria-current="page"' : ""}>${esc(ad)}</a>`;
  const hreflang = s.yol === "/" || s.yol === "/en"
    ? `<link rel="alternate" hreflang="tr" href="${c.domain}/">\n<link rel="alternate" hreflang="en" href="${c.domain}/en">\n<link rel="alternate" hreflang="x-default" href="${c.domain}/">`
    : "";
  const enNav = [["#services", "Services"], ["#vehicle", "Our taxi"], ["#book", "Book a ride"], ["#faq", "FAQ"]];
  return `<!doctype html>
<html lang="${s.dil || "tr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(s.baslik)}</title>
<meta name="description" content="${esc(s.aciklama)}">
<link rel="canonical" href="${canonical}">
${hreflang}
<meta name="robots" content="index,follow,max-image-preview:large">
${c.googleDogrulama ? `<meta name="google-site-verification" content="${esc(c.googleDogrulama)}">` : ""}
<meta name="theme-color" content="#0e1014">
<meta name="format-detection" content="telephone=yes">
<meta name="geo.region" content="TR-36">
<meta name="geo.placename" content="Kars">
<meta name="geo.position" content="${c.konum.lat};${c.konum.lng}">
<meta name="ICBM" content="${c.konum.lat}, ${c.konum.lng}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${T(s, "tr_TR", "en_US")}">
<meta name="application-name" content="${esc(c.marka)}">
<meta property="og:site_name" content="${esc(c.marka)}">
<meta property="og:title" content="${esc(s.baslik)}">
<meta property="og:description" content="${esc(s.aciklama)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${c.domain}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/font/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/font/plus-jakarta-sans-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.className="js"</script>
<style>${CSS}</style>
<script type="application/ld+json">${schemaFor(s)}</script>
${takipKodu()}
</head>
<body>
<a class="atla" href="#icerik">${T(s, "İçeriğe geç", "Skip to content")}</a>
<header class="ust-bar" data-ust>
  <div class="kap ust-ic">
    <a class="logo" href="${T(s, "/", "/en")}">${logoHtml}</a>
    <nav class="ust-nav" aria-label="${T(s, "Hizmetler", "Sections")}">
      ${en(s) ? enNav.map(([h, a]) => `<a href="${h}">${a}</a>`).join("") : anaSayfalar.slice(0, 5).map((h) => navLink(h.yol, h.kisa)).join("")}
      <a class="dil-link" href="${T(s, "/en", "/")}" hreflang="${T(s, "en", "tr")}" lang="${T(s, "en", "tr")}">${ikon("dunya")}${T(s, "EN", "TR")}</a>
    </nav>
    <a class="ust-tel" href="${telLink}" data-track="call" aria-label="${T(s, "Ara", "Call")} ${esc(numara(s, c.telefonGorunen))}"><span class="ust-tel-ik">${ikon("tel")}</span><span class="ust-tel-m"><small>${T(s, "7/24 çağrı", "24/7 taxi")}</small><b>${esc(numara(s, c.telefonGorunen))}</b></span></a>
    <details class="menu">
      <summary aria-label="${T(s, "Menü", "Menu")}">${ikon("menu", "m-ac")}${ikon("kapat", "m-kapa")}</summary>
      <div class="menu-panel">
        ${en(s)
          ? enNav.map(([h, a]) => `<a href="${h}">${ikon("ok")}${a}</a>`).join("")
          : `<a href="/"${s.yol === "/" ? ' aria-current="page"' : ""}>${ikon("sehir")}Şehir içi taksi</a>
        ${anaSayfalar.map((h) => `<a href="${h.yol}"${h.yol === s.yol ? ' aria-current="page"' : ""}>${ikon(h.ikon)}${esc(h.kisa)}</a>`).join("")}
        <p class="menu-ara-baslik">İlçeler ve şehir içi</p><div class="menu-cipler">${[...ilceSayfalari, ...sehirSayfalari].map((h) => `<a href="${h.yol}"${h.yol === s.yol ? ' aria-current="page"' : ""}>${esc(h.kisa)}</a>`).join("")}</div>
        <a href="/rehber"${s.yol.startsWith("/rehber") ? ' aria-current="page"' : ""}>${ikon("pusula")}Kars ulaşım rehberi</a>`}
        <a href="${T(s, "/en", "/")}" hreflang="${T(s, "en", "tr")}">${ikon("dunya")}${T(s, "English", "Türkçe")}</a>
        ${aramaButonlari(s, "cta-menu")}
        ${digerHatlar.length ? `<div class="menu-hatlar">${digerHatlar.map((h) => `<div class="hat-cift"><a href="tel:${h.telefon}" data-track="call">${ikon("tel")}<span><b>${esc(numara(s, h.gorunen))}</b><small>${esc(etiket(s, h))}</small></span></a>${waMini(h)}</div>`).join("")}</div>` : ""}
      </div>
    </details>
  </div>
</header>
<main id="icerik">
${govde}
</main>
<footer class="alt">
  <div class="dama" aria-hidden="true"></div>
  <div class="kap alt-ic">
    <div class="alt-marka-k">
      <a class="logo" href="${T(s, "/", "/en")}">${logoHtml}</a>
      <p>${T(s, "Kars merkezde, gece gündüz hizmet veren resmî taksi. Şehir içi, havalimanı, gar ve turistik transfer.", "Official licensed taxi in central Kars, day and night. City rides, airport, train station and tourist transfers.")}</p>
      <div class="alt-rozetler">${plakaHtml}${googleRozet(s, "g-rozet-koyu")}</div>
    </div>
    <div>
      <p class="alt-baslik">${T(s, "İletişim", "Contact")}</p>
      <address>
        <a class="alt-tel" href="${telLink}" data-track="call">${esc(numara(s, c.telefonGorunen))}</a>
        ${digerHatlar.map((h) => `<span class="alt-hat">${`<a href="tel:${h.telefon}" data-track="call">${esc(numara(s, h.gorunen))}</a>`} <small>${esc(etiket(s, h))}${h.whatsapp ? " · WhatsApp" : ""}</small></span>`).join("")}
        <span class="alt-bosluk">${esc(c.marka)}</span>
        <span>${esc(adresSatiri)}</span>
        <span>${T(s, "Her gün 00:00 – 24:00", "Open 24 hours, every day")}</span>
      </address>
    </div>
    <nav aria-label="${T(s, "Tüm hizmetler", "Pages")}">
      <p class="alt-baslik">${T(s, "Hizmetler", "Services")}</p>
      <ul>
        ${en(s)
          ? enNav.map(([h, a]) => `<li><a href="${h}">${a}</a></li>`).join("") + `<li><a href="/" hreflang="tr">Türkçe site</a></li>`
          : `<li><a href="/">Kars şehir içi taksi</a></li>${anaSayfalar.map((h) => `<li><a href="${h.yol}">${esc(h.h1)}</a></li>`).join("")}<li><a href="/en" hreflang="en">Kars Taxi (English)</a></li>`}
      </ul>
    </nav>
    ${en(s) ? "" : `<nav aria-label="İlçeler ve şehir içi">
      <p class="alt-baslik">İlçeler ve şehir içi</p>
      <ul>${[...ilceSayfalari, ...sehirSayfalari].map((h) => `<li><a href="${h.yol}">${esc(h.h1)}</a></li>`).join("")}<li><a href="/rehber">Kars ulaşım rehberi</a></li></ul>
    </nav>`}
    <div>
      <p class="alt-baslik">${T(s, "Bizi bulun", "Find us")}</p>
      <ul>
        <li><a href="${haritaLinki}" rel="noopener" target="_blank">${T(s, "Google Haritalar'da yol tarifi", "Directions on Google Maps")}</a></li>
        ${c.googleYorumLinki ? `<li><a href="${c.googleYorumLinki}" rel="noopener" target="_blank">${T(s, "Google'da yorum yazın", "Review us on Google")}</a></li>` : ""}
        <li><a href="/gizlilik">${T(s, "Gizlilik ve KVKK", "Privacy (Turkish)")}</a></li>
      </ul>
    </div>
  </div>
  <div class="kap alt-not"><span>© ${new Date().getFullYear()} ${esc(c.marka)}</span><span>Kars · ${T(s, "Türkiye", "Türkiye")}</span></div>
</footer>
<a class="yuzen-wa" href="${waLink(s.waMetin)}" data-track="whatsapp" rel="nofollow noopener" target="_blank" aria-label="WhatsApp">${WA_SVG}</a>
<div class="mobil-bar">
  <a href="${telLink}" data-track="call" class="mb-ara">${ikon("tel")}${T(s, "Hemen Ara", "Call now")}</a>
  <a href="${waLink(s.waMetin)}" data-track="whatsapp" class="mb-wa" rel="nofollow noopener" target="_blank">${WA_SVG}WhatsApp</a>
</div>
<script>${JS}</script>
</body>
</html>`;
}

function sssHtml(s) {
  if (!s.sss?.length) return "";
  return `<section class="bolum" id="faq" aria-labelledby="sss-b"><div class="kap sss-ic">
  <div class="sss-sol" data-reveal>
    <p class="etiket">${T(s, "Sık sorulanlar", "FAQ")}</p>
    <h2 id="sss-b">${T(s, "Aklınızdaki sorular", "Good to know")}</h2>
    <p class="bolum-giris">${T(s, "Cevabını bulamadığınız bir şey mi var? Arayın, hemen yanıtlayalım.", "Anything else? Send a WhatsApp message — a shared location needs no translation.")}</p>
    <a class="baglanti" href="${telLink}" data-track="call">${ikon("tel")}${esc(numara(s, c.telefonGorunen))}</a>
  </div>
  <div class="sss-liste" data-reveal>
  ${s.sss.map(([q, a], i) => `<details class="sss"${i === 0 ? " open" : ""}><summary>${esc(q)}<span class="sss-arti" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("\n  ")}
  </div>
</div></section>`;
}

function haritaHtml(s) {
  return `<section class="bolum" aria-labelledby="konum-b"><div class="kap"><div class="konum-kart" data-reveal>
  <div class="konum-bilgi">
    <p class="etiket">${T(s, "Durak", "Taxi stand")}</p>
    <h2 id="konum-b">${T(s, "Durağa gelmenize gerek yok", "No need to come to the stand")}</h2>
    <p class="bolum-giris">${T(s, "Arayın ya da WhatsApp'tan konum gönderin, aracı bulunduğunuz yere yönlendirelim.", "Call or share your location on WhatsApp and the taxi comes to you.")}</p>
    <ul class="konum-liste">
      <li>${ikon("pin")}<span><b>${esc(c.marka)}</b>${esc(adresSatiri)}</span></li>
      <li>${ikon("saat")}<span><b>${T(s, "Her gün, 24 saat", "24 hours, every day")}</b>${T(s, "Bayram ve tatillerde de açık", "Including public holidays")}</span></li>
      ${tumHatlar.map((h) => `<li>${ikon("tel")}<span><b><a href="tel:${h.telefon}" data-track="call">${esc(numara(s, h.gorunen))}</a></b>${esc(etiket(s, h))} · ${h.whatsapp ? T(s, "Çağrı + WhatsApp", "Call + WhatsApp") : T(s, "Yalnızca çağrı", "Calls only")}</span>${waMini(h)}</li>`).join("\n      ")}
    </ul>
    <a class="btn-ikincil" href="${haritaLinki}" rel="noopener" target="_blank">${T(s, "Yol tarifi al", "Get directions")} ${ikon("ok")}</a>
  </div>
  <div class="harita" data-harita="https://maps.google.com/maps?q=${encodeURIComponent(c.marka)}&ll=${c.konum.lat},${c.konum.lng}&z=16&hl=${s.dil || "tr"}&output=embed">
    <div class="harita-onizleme" aria-hidden="true">${ikon("pin")}</div>
    <button type="button" class="harita-yukle">${ikon("pin")}${T(s, "Haritayı göster", "Show map")}</button>
  </div>
</div></div></section>`;
}

function kahraman(s) {
  return `<section class="kahraman">
  <div class="kahraman-arka" aria-hidden="true"></div>
  <div class="kap kahraman-ic">
    <div class="kahraman-metin">
      ${s.tur === "rehber" ? `<nav class="yol-izi" aria-label="Konum"><a href="/">Kars Taksi</a>${ikon("ok")}<a href="/rehber">Rehber</a>${ikon("ok")}<span>${esc(s.kisa)}</span></nav>` : s.kisa ? `<nav class="yol-izi" aria-label="Konum"><a href="/">Kars Taksi</a>${ikon("ok")}<span>${esc(s.kisa)}</span></nav>` : ""}
      <p class="rozet"><span class="rozet-ik">${s.ikon ? ikon(s.ikon) : ikon("pin")}</span>${esc(s.tur === "rehber" ? "Ulaşım rehberi · " + tarihTr(s.guncelleme) : s.ust)}</p>
      <h1>${esc(s.h1)}${s.h1Vurgu ? ` <span class="vurgu">${esc(s.h1Vurgu)}</span>` : ""}</h1>
      <p class="giris">${esc(s.giris)}</p>
      ${aramaButonlari(s, "cta-kahraman")}
      ${digerHatlarSatiri(s)}
      <ul class="guven">
        ${c.googlePuan ? `<li>${googleRozet(s)}</li>` : ""}
        <li>${ikon("saat")}<span>${T(s, "<b>7/24</b> açık", "<b>24/7</b> open")}</span></li>
        <li>${plakaHtml}</li>
      </ul>
    </div>
    ${rotaKarti(s)}
  </div>
</section>`;
}

function hizmetKartlari(liste, sehirIci) {
  return `<div class="kartlar${sehirIci ? "" : " kartlar-3"}">
    ${sehirIci ? `<a class="kart" href="#nasil" data-reveal><span class="kart-ik">${ikon("sehir")}</span><h3>Şehir içi taksi</h3><p>Hastane, üniversite, çarşı, adliye — Kars merkezin her noktası.</p><span class="kart-alt"><span class="cip">Taksimetre</span><span class="kart-ok">${ikon("ok")}</span></span></a>` : ""}
    ${liste.map((h) => `<a class="kart" href="${h.yol}" data-reveal><span class="kart-ik">${ikon(h.ikon)}</span><h3>${esc(h.h1)}</h3><p>${esc(h.ozet)}</p><span class="kart-alt"><span class="cip">${esc(h.mesafe[0][1])} · ${esc(h.mesafe[0][2])}</span><span class="kart-ok">${ikon("ok")}</span></span></a>`).join("\n    ")}
    <a class="kart kart-cta" href="${telLink}" data-track="call" data-reveal><span class="kart-ik">${ikon("tel")}</span><h3>Listede yok mu?</h3><p>Kars içi ya da çevre ilçeler — nereye olursa arayın, konuşalım.</p><span class="kart-alt"><span class="cip">${esc(c.telefonGorunen)}</span><span class="kart-ok">${ikon("ok")}</span></span></a>
  </div>`;
}

function aracBolumu(s) {
  const maddeler = en(s)
    ? [["kalkan", "Licensed yellow taxi", "Official commercial plate, metered fares in the city."], ["bavul", "Room for luggage", "Suitcases, backpacks and ski gear fit in the back."], ["kar", "Knows winter roads", "Kars winters are long — we check road conditions before long trips."], ["kamera", "What you see is what arrives", "The taxi in these photos is the one that picks you up."]]
    : [["kalkan", "Resmî sarı taksi", "Ticari plakalı, şehir içinde taksimetreli."], ["bavul", "Bagaj derdi yok", "Valiz, sırt çantası ve kayak ekipmanı rahatça sığar."], ["kar", "Kars kışına alışkın", "Uzun yola çıkmadan önce yol ve hava durumunu kontrol ederiz."], ["kamera", "Fotoğraftaki araç gelir", "Sizi karşılayan taksi bu fotoğraflardaki araçtır."]];
  return `<section class="bolum arac-bolum" id="vehicle" aria-labelledby="arac-b"><div class="kap arac-ic">
  <div class="arac-foto" data-reveal>
    <figure class="foto-buyuk">
      <img src="/foto/taksi-36t0089-yol-800.webp" srcset="/foto/taksi-36t0089-yol-480.webp 480w, /foto/taksi-36t0089-yol-800.webp 800w" sizes="(min-width:960px) 420px, 70vw" width="800" height="1000" loading="lazy" decoding="async" alt="${T(s, `${c.plaka} plakalı sarı Ford taksi, taş zeminli yolda`, `Yellow Ford taxi with plate ${c.plaka}`)}">
    </figure>
    <figure class="foto-kucuk">
      <img src="/foto/taksi-36t0089-sehir-600.webp" srcset="/foto/taksi-36t0089-sehir-360.webp 360w, /foto/taksi-36t0089-sehir-600.webp 600w" sizes="(min-width:960px) 260px, 45vw" width="600" height="750" loading="lazy" decoding="async" alt="${T(s, `${c.plaka} plakalı taksi Kars şehir merkezinde, kaputunda Türk bayrağı`, `Taxi ${c.plaka} in central Kars with a Turkish flag on the bonnet`)}">
    </figure>
    ${c.googlePuan ? `<div class="foto-rozet">${googleRozet(s)}</div>` : ""}
    <div class="foto-plaka">${plakaHtml}</div>
  </div>
  <div class="arac-metin" data-reveal>
    <p class="etiket">${T(s, "Aracımız", "Our taxi")}</p>
    <h2 id="arac-b">${T(s, `Tanıyın: ${c.plaka}`, `Meet ${c.plaka}`)}</h2>
    <p class="bolum-giris">${T(s, "Kars'ın sokaklarında, havalimanında, Ani yolunda ve Sarıkamış'ın karlı virajlarında aynı sarı taksi.", "The same yellow taxi on Kars streets, at the airport, on the road to Ani and up to snowy Sarıkamış.")}</p>
    <ul class="arac-liste">
      ${maddeler.map(([ik, b, a]) => `<li><span class="oz-ik">${ikon(ik)}</span><div><b>${b}</b><span>${a}</span></div></li>`).join("\n      ")}
    </ul>
    ${c.googlePuan ? `<a class="baglanti" href="${haritaLinki}" rel="noopener" target="_blank">${ikon("yildiz")}${T(s, "Google'daki yorumları okuyun", "Read our Google reviews")}</a>` : ""}
  </div>
</div></section>`;
}

const YERLER_TR = ["Kars merkez", "Kars Havalimanı", "Kars Garı", "Kars Otogarı", "Sarıkamış", "Sarıkamış Kayak Merkezi", "Ani Ören Yeri", "Çıldır Gölü", "Kafkas Üniversitesi", "Kars Kalesi", "Kars Harakani Devlet Hastanesi", "Kafkas Üniversitesi Hastanesi", "Selim", "Digor", "Kağızman", "Arpaçay", "Akyaka", "Susuz"];
const YERLER_EN = ["Kars city centre", "Kars Airport (KSY)", "Kars Train Station", "Kars Bus Station", "Sarıkamış", "Sarıkamış Ski Resort", "Ani Ruins", "Lake Çıldır", "Kars Castle", "My hotel in Kars"];
const PLAN = {
  "/kars-havalimani-taksi": ["Kars Havalimanı", "Kars merkez"],
  "/sarikamis-taksi": ["Kars Havalimanı", "Sarıkamış Kayak Merkezi"],
  "/ani-oren-yeri-taksi": ["Kars merkez", "Ani Ören Yeri"],
  "/kars-tren-gari-taksi": ["Kars Garı", "Kars merkez"],
  "/kars-otogar-taksi": ["Kars Otogarı", "Kars merkez"],
  "/cildir-golu-taksi": ["Kars merkez", "Çıldır Gölü"],
};

function planlayici(s) {
  const [nereden, nereye] = PLAN[s.yol] || s.plan || ["", ""];
  const yerler = en(s) ? YERLER_EN : YERLER_TR;
  const kisi = [1, 2, 3, 4].map((k) => `<label class="seg"><input type="radio" name="kisi" value="${k}"${k === 1 ? " checked" : ""}><span>${k}</span></label>`).join("");
  return `<section class="bolum planla-bolum" id="book" aria-labelledby="planla-b"><div class="kap"><div class="planla-kart" data-reveal>
  <div class="planla-metin">
    <p class="etiket">${ikon("takvim")}${T(s, "Transfer planla", "Book a ride")}</p>
    <h2 id="planla-b">${T(s, "Yolculuğunuzu önceden ayırtın", "Plan your ride in advance")}</h2>
    <p>${T(s, "Formu doldurun, bilgiler WhatsApp'ta hazır mesaj olarak açılsın. Siz gönderin, biz dönüş yapalım.", "Fill in the form and it opens as a ready-made WhatsApp message. Send it and we’ll confirm.")}</p>
    <ul class="planla-liste">
      <li>${ikon("kalkan")}${T(s, "Bilgileriniz bu sitede saklanmaz", "Nothing is stored on this website")}</li>
      <li>${ikon("fis")}${T(s, "Şehir dışı fiyatı yola çıkmadan netleşir", "Out-of-town fares agreed before the trip")}</li>
      <li>${ikon("ucak")}${T(s, "Uçuş / tren numaranızı not olarak ekleyin", "Add your flight or train number as a note")}</li>
    </ul>
  </div>
  <form class="planla-form" data-planla data-wa="${c.whatsapp}" data-dil="${s.dil || "tr"}" novalidate>
    <div class="alan-cift">
      <label class="alan"><span>${T(s, "Nereden", "From")}</span><input name="nereden" list="yerler-${s.dil || "tr"}" required autocomplete="off" value="${esc(nereden)}" placeholder="${T(s, "Örn. Kars Havalimanı", "e.g. Kars Airport")}"></label>
      <button type="button" class="degistir" data-degistir aria-label="${T(s, "Yönleri değiştir", "Swap")}">${ikon("degis")}</button>
      <label class="alan"><span>${T(s, "Nereye", "To")}</span><input name="nereye" list="yerler-${s.dil || "tr"}" required autocomplete="off" value="${esc(nereye)}" placeholder="${T(s, "Örn. Sarıkamış", "e.g. Ani Ruins")}"></label>
    </div>
    <datalist id="yerler-${s.dil || "tr"}">${yerler.map((y) => `<option value="${esc(y)}">`).join("")}</datalist>
    <div class="alan-sira">
      <label class="alan"><span>${T(s, "Tarih", "Date")}</span><input type="date" name="tarih"></label>
      <label class="alan"><span>${T(s, "Saat", "Time")}</span><input type="time" name="saat"></label>
    </div>
    <fieldset class="alan"><legend>${T(s, "Kişi sayısı", "Passengers")}</legend><div class="seg-grup">${kisi}</div></fieldset>
    <label class="alan"><span>${T(s, "Not", "Note")} <small>${T(s, "(isteğe bağlı)", "(optional)")}</small></span><input name="not" autocomplete="off" placeholder="${T(s, "Uçuş no, bagaj, bekleme süresi…", "Flight no., luggage, waiting time…")}"></label>
    <p class="form-hata" data-hata hidden>${T(s, "Lütfen nereden ve nereye alanlarını doldurun.", "Please fill in From and To.")}</p>
    <button type="submit" class="btn btn-wa planla-gonder"><span class="btn-ik">${WA_SVG}</span><span class="btn-m"><b>${T(s, "WhatsApp'ta gönder", "Send on WhatsApp")}</b><small>${esc(numara(s, c.telefonGorunen))}</small></span></button>
    <p class="form-alt">${T(s, "Yazmak istemiyor musunuz?", "Prefer to call?")} <a href="${telLink}" data-track="call">${T(s, "Hemen arayın", "Call")} ${esc(numara(s, c.telefonGorunen))}</a></p>
  </form>
</div></div></section>`;
}

function ekBaglantilar(haric) {
  const cip = (h, alt) => h.yol === haric ? "" : `<li><a href="${h.yol}"><span class="ek-ik">${ikon(h.ikon)}</span><span><b>${esc(h.kisa)}</b><small>${esc(alt)}</small></span></a></li>`;
  return `<div class="ek-baglanti" data-reveal>
    <div class="ek-grup"><h3>${ikon("yol")}Kars'tan ilçelere taksi</h3><ul>${ilceSayfalari.map((h) => cip(h, h.ozet)).join("")}</ul></div>
    <div class="ek-grup"><h3>${ikon("sehir")}Şehir içinde</h3><ul>${sehirSayfalari.map((h) => cip(h, h.ozet)).join("")}</ul></div>
  </div>`;
}

function sonCta(s, baslik, alt) {
  return `<section class="son-cta"><div class="kap"><div class="son-kart" data-reveal>
  <div class="son-dama" aria-hidden="true"></div>
  <div class="son-metin">
    <p class="etiket">${ikon("saat")}${T(s, "Şu an açık", "Open now")}</p>
    <h2>${esc(baslik)}</h2>
    <p>${esc(alt)}</p>
  </div>
  <div class="son-sag">
    <a class="son-numara" href="${telLink}" data-track="call">${esc(numara(s, c.telefonGorunen))}</a>
    ${aramaButonlari(s, "cta-son")}
    ${digerHatlarSatiri(s)}
  </div>
</div></div></section>`;
}

function istatHtml(s) {
  return `<section class="istat-bolum"><div class="kap"><ul class="istat" data-reveal>
  <li><b>${T(s, "7/24", "24/7")}</b><span>${T(s, "Gece gündüz açık", "Day and night")}</span></li>
  <li><b>~8 km</b><span>${T(s, "Havalimanına", "to the airport")}</span></li>
  <li><b>~45 km</b><span>${T(s, "Ani Ören Yeri'ne", "to Ani Ruins")}</span></li>
  <li><b>~60 km</b><span>${T(s, "Sarıkamış'a", "to Sarıkamış")}</span></li>
</ul></div></section>`;
}

function anasayfaGovde(s) {
  const sezonlar = [
    ["dag", "Kasım – Mart", "Sarıkamış kayak sezonu", "Havalimanı ve gardan kayak otellerine transfer."],
    ["tren", "Kış ayları", "Turistik Doğu Ekspresi", "Gar çıkışında karşılama, otele ve Ani turuna."],
    ["kar", "Göl donduğunda", "Çıldır'da atlı kızak", "Buz üstü gezisi için gidiş-dönüş taksi."],
    ["ani", "Bahar – Sonbahar", "Ani ve Kars gezisi", "Ören yeri, kale ve tarihi taş binalar."],
  ];
  return `${kahraman(s)}
${istatHtml(s)}
<section class="bolum" aria-labelledby="hizmet-b"><div class="kap">
  <div class="bolum-ust" data-reveal>
    <div><p class="etiket">Hizmetler</p><h2 id="hizmet-b">Kars'ta nereye giderseniz</h2></div>
    <p class="bolum-giris">Şehir içinde taksimetreyle, şehir dışında fiyatı yola çıkmadan konuşarak.</p>
  </div>
  ${hizmetKartlari(anaSayfalar, true)}
  ${ekBaglantilar()}
</div></section>
${aracBolumu(s)}
<section class="bolum bolum-koyu" id="nasil" aria-labelledby="nasil-b"><div class="kap nasil-ic">
  <div data-reveal>
    <p class="etiket">Nasıl çalışır</p>
    <h2 id="nasil-b">Taksi çağırmak 30 saniye</h2>
    <ol class="adimlar">
      <li><span class="adim-no">1</span><div><b>Arayın ya da yazın</b><span>${esc(c.telefonGorunen)} numarasını arayın veya WhatsApp'a dokunun.</span></div></li>
      <li><span class="adim-no">2</span><div><b>Konumunuzu iletin</b><span>Adres tarif edin ya da WhatsApp'tan canlı konum paylaşın.</span></div></li>
      <li><span class="adim-no">3</span><div><b>Aracınız yolda</b><span>${esc(c.plaka)} plakalı taksi size en kısa sürede ulaşır.</span></div></li>
    </ol>
  </div>
  <div class="sohbet" data-reveal aria-label="WhatsApp yazışma örneği">
    <div class="sohbet-ust"><span class="sohbet-avatar">${logoHtml.split("</span>")[0]}</span></span><div><b>${esc(c.marka)}</b><small>genellikle hemen yanıt verir</small></div></div>
    <div class="sohbet-govde">
      <p class="balon gelen">Merhaba, Kars'ta taksi istiyorum. Konumum:</p>
      <div class="balon gelen konum-balon"><span class="mini-harita" aria-hidden="true">${ikon("pin")}</span><small>Canlı konum paylaşıldı</small></div>
      <p class="balon giden">Merhaba, konumunuzu aldık. ${esc(c.plaka)} plakalı aracımız yola çıktı 🚕</p>
    </div>
    <p class="sohbet-not">Örnek yazışma</p>
  </div>
</div></section>
<section class="bolum" aria-labelledby="neden-b"><div class="kap">
  <div class="bolum-ust" data-reveal>
    <div><p class="etiket">Neden biz</p><h2 id="neden-b">Kars'ı bilen, gece de açık</h2></div>
  </div>
  <div class="ozellik">
    <div data-reveal><span class="oz-ik">${ikon("ay")}</span><h3>Gece gündüz açık</h3><p>Gece yarısı inen uçak, sabaha karşı gelen otobüs — saatin önemi yok.</p></div>
    <div data-reveal><span class="oz-ik">${ikon("pusula")}</span><h3>Yerel ve deneyimli</h3><p>Kısa yolları, kış şartlarını ve turistik noktaları bilen hizmet.</p></div>
    <div data-reveal><span class="oz-ik">${ikon("fis")}</span><h3>Şeffaf ücret</h3><p>Şehir içinde taksimetre; şehir dışında fiyat yolculuktan önce netleşir.</p></div>
    <div data-reveal><span class="oz-ik">${ikon("yildiz")}</span><h3>Google'da ${esc(c.googlePuan || "")} puan</h3><p>Yolcularımızın yorumları Google Haritalar'da; siz de okuyun.</p></div>
  </div>
</div></section>
<section class="bolum bolum-krem" aria-labelledby="sezon-b"><div class="kap">
  <div class="bolum-ust" data-reveal>
    <div><p class="etiket">Kars'a gelen misafirler için</p><h2 id="sezon-b">Mevsim mevsim Kars</h2></div>
    <p class="bolum-giris">Tarihler hava koşullarına göre yıldan yıla değişebilir.</p>
  </div>
  <div class="sezon">
    ${sezonlar.map(([ik, zaman, bas, acik]) => `<div class="sezon-k" data-reveal><span class="sezon-ik">${ikon(ik)}</span><small>${zaman}</small><h3>${bas}</h3><p>${acik}</p></div>`).join("\n    ")}
  </div>
</div></section>
${rehberBolumu()}
${planlayici(s)}
${sssHtml(s)}
${haritaHtml(s)}
${sonCta(s, "Kars'ta taksi mi lazım?", "Şimdi arayın, aracınızı yola çıkaralım.")}`;
}

function hizmetGovde(s) {
  const digerleri = anaSayfalar.filter((h) => h.yol !== s.yol).slice(0, 5);
  return `${kahraman(s)}
<section class="bolum" aria-labelledby="mesafe-b"><div class="kap mesafe-ic">
  <div data-reveal>
    <p class="etiket">Mesafe ve süre</p>
    <h2 id="mesafe-b">Ne kadar sürer?</h2>
    <p class="bolum-giris">Süreler yol, trafik ve hava durumuna göre değişebilir. Şehir dışı yolculuklarda ücret yola çıkmadan netleşir.</p>
  </div>
  <ul class="guzergah" data-reveal>
    ${s.mesafe.map(([g, km, sure]) => { const [a, b] = g.split(" → "); return `<li><span class="g-ik">${ikon("yol")}</span><span class="g-yer"><b>${esc(a)}</b><span class="g-ok">${ikon("ok")}</span><b>${esc(b)}</b></span><span class="g-deger"><span>${esc(km)}</span><span>${esc(sure)}</span></span></li>`; }).join("\n    ")}
  </ul>
</div></section>
<section class="bolum bolum-krem" aria-labelledby="madde-b"><div class="kap">
  <div class="bolum-ust" data-reveal><div><p class="etiket">Hizmet detayı</p><h2 id="madde-b">Neler sunuyoruz</h2></div></div>
  <div class="ozellik">
    ${s.maddeler.map(([ik, b, a]) => `<div data-reveal><span class="oz-ik">${ikon(ik)}</span><h3>${esc(b)}</h3><p>${esc(a)}</p></div>`).join("\n    ")}
  </div>
  ${ilgiliRehber(s.yol)}
</div></section>
${planlayici(s)}
${sssHtml(s)}
${sonCta(s, `${s.h1} için hemen arayın`, `${c.durak} · ${c.plaka} · 7/24`)}
<section class="bolum" aria-labelledby="diger-b"><div class="kap">
  <div class="bolum-ust" data-reveal><div><p class="etiket">Diğer hizmetler</p><h2 id="diger-b">Başka nereye gidiyorsunuz?</h2></div></div>
  ${hizmetKartlari(digerleri, false)}
  ${ekBaglantilar(s.yol)}
</div></section>`;
}

// ---------- Ulaşım rehberleri ----------
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
function tarihTr(iso) { const [y, a, g] = iso.split("-").map(Number); return `${g} ${AYLAR[a - 1]} ${y}`; }

function rehberKart(h) {
  return `<a class="kart rehber-kart" href="${h.yol}" data-reveal><span class="kart-ik">${ikon(h.ikon)}</span><h3>${esc(h.h1)}</h3><p>${esc(h.kisaCevap.split(". ")[0])}.</p><span class="kart-alt"><span class="cip">${esc(h.mesafe[0][1])} · ${esc(h.mesafe[0][2])}</span><span class="kart-ok">${ikon("ok")}</span></span></a>`;
}

function rehberBolumu() {
  return `<section class="bolum" aria-labelledby="rehber-b"><div class="kap">
  <div class="bolum-ust" data-reveal>
    <div><p class="etiket">Ulaşım rehberi</p><h2 id="rehber-b">Kars'ta nasıl gidilir?</h2></div>
    <p class="bolum-giris">Havalimanından şehre, Ani'ye, Sarıkamış'a ve gardan otele: seçenekler, süreler ve ipuçları. <a class="baglanti" href="/rehber">Tüm rehberler ${ikon("ok")}</a></p>
  </div>
  <div class="kartlar">${REHBERLER.map(rehberKart).join("")}</div>
</div></section>`;
}

function ilgiliRehber(yol) {
  const h = REHBERLER.find((x) => x.ilgili === yol);
  if (!h) return "";
  return `<a class="ilgili-rehber" href="${h.yol}" data-reveal><span class="kart-ik">${ikon("pusula")}</span><span class="ilgili-metin"><small>Ulaşım rehberi</small><b>${esc(h.h1)}</b></span><span class="kart-ok">${ikon("ok")}</span></a>`;
}

function rehberGovde(s) {
  const hizmet = hizmetSayfalari.find((h) => h.yol === s.ilgili);
  const digerleri = REHBERLER.filter((h) => h.yol !== s.yol);
  return `${kahraman(s)}
<section class="bolum"><div class="kap makale-ic">
  <article class="makale">
    <div class="kisa-cevap">
      <p class="etiket">${ikon("saat")}Kısa cevap</p>
      <p>${esc(s.kisaCevap)}</p>
    </div>

    <h2>Seçeneklerin karşılaştırması</h2>
    <div class="tablo-sar"><table class="karsilastirma">
      <thead><tr><th scope="col">Seçenek</th><th scope="col">Süre</th><th scope="col">Artısı</th><th scope="col">Dikkat</th></tr></thead>
      <tbody>${s.tablo.map(([a, sure, arti, dikkat]) => `<tr><th scope="row">${esc(a)}</th><td data-etiket="Süre">${esc(sure)}</td><td data-etiket="Artısı">${esc(arti)}</td><td data-etiket="Dikkat">${esc(dikkat)}</td></tr>`).join("")}</tbody>
    </table></div>

    ${s.bolumler.map(([baslik, paragraflar]) => `<h2>${esc(baslik)}</h2>${paragraflar.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n    ")}

    <h2>Hangisini seçmeli?</h2>
    <ul class="secim-liste">${s.secim.map(([kosul, oneri]) => `<li><span>${esc(kosul)}</span>${ikon("ok")}<b>${esc(oneri)}</b></li>`).join("")}</ul>

    <h2>Pratik ipuçları</h2>
    <ul class="ipucu-liste">${s.ipuclari.map((i) => `<li>${ikon("kalkan")}<span>${esc(i)}</span></li>`).join("")}</ul>

    <div class="kaynaklar">
      <h2>Kaynaklar</h2>
      <ul>${s.kaynaklar.map(([ad, url]) => `<li><a href="${url}" rel="noopener" target="_blank">${esc(ad)}</a></li>`).join("")}</ul>
      <p class="dipnot">Son güncelleme: ${tarihTr(s.guncelleme)}. Mesafe ve süreler Google Haritalar'da Faikbey Caddesi'ndeki durağımızdan ölçülmüştür. Saat, ücret ve sefer bilgileri değişebilir; yolculuktan önce resmî kaynaklardan teyit edin.</p>
    </div>
  </article>
  <aside class="makale-yan">
    <div class="yan-kart">
      <p class="etiket">Bu yolculuk için</p>
      <h3>${esc(hizmet ? hizmet.h1 : "Çamlıca Taksi")}</h3>
      <ul class="yan-mesafe">${s.mesafe.map(([g, km, sure]) => `<li>${ikon("yol")}<span>${esc(g)}</span><b>${esc(km)} · ${esc(sure)}</b></li>`).join("")}</ul>
      ${aramaButonlari(s, "cta-yan")}
      ${hizmet ? `<a class="baglanti" href="${hizmet.yol}">Hizmet ayrıntıları ${ikon("ok")}</a>` : ""}
    </div>
    <nav class="yan-rehberler" aria-label="Diğer rehberler">
      <p class="etiket">Diğer rehberler</p>
      <ul>${digerleri.map((h) => `<li><a href="${h.yol}">${ikon(h.ikon)}<span>${esc(h.h1)}</span></a></li>`).join("")}</ul>
    </nav>
  </aside>
</div></section>
${planlayici(s)}
${sssHtml(s)}
${sonCta(s, "Yolculuğunuzu şimdi ayarlayalım", `${c.marka} · ${c.plaka} · 7/24`)}`;
}

function rehberHubGovde(s) {
  return `${kahraman(s)}
<section class="bolum" aria-labelledby="tum-rehber-b"><div class="kap">
  <div class="bolum-ust" data-reveal><div><p class="etiket">Rehberler</p><h2 id="tum-rehber-b">Nereye gidiyorsunuz?</h2></div>
  <p class="bolum-giris">Her rehberde seçeneklerin karşılaştırması, süreler, dikkat edilecekler ve resmî kaynaklar var.</p></div>
  <div class="kartlar kartlar-2">${REHBERLER.map(rehberKart).join("")}</div>
</div></section>
${sonCta(s, "Kars'ta taksi mi lazım?", "Havalimanı, gar, Ani, Sarıkamış — gece gündüz arayın.")}`;
}

// ---------- İngilizce sayfa ----------
const ingilizce = {
  yol: "/en",
  dil: "en",
  baslik: "Kars Taxi 24/7 | Airport, Ani Ruins & Sarıkamış Transfers",
  aciklama: `Licensed taxi in Kars, Turkey, day and night: Kars Airport pickups, Ani Ruins round trips, Sarıkamış ski transfers, train station. WhatsApp ${intl(c.telefonGorunen)}`,
  h1: "Kars Taxi",
  h1Vurgu: "day & night, at your door.",
  ust: "Çamlıca Taxi Stand · Central Kars",
  giris: "Airport and train station pickups, Ani Ruins round trips, Sarıkamış ski transfers and rides anywhere in Kars. Tip: WhatsApp is easiest — share your location, no Turkish needed.",
  waMetin: WA_EN,
  sss: [
    ["Can you pick me up at Kars Airport?", "Yes. Send your flight number on WhatsApp and we’ll meet you at arrivals, even if the flight is delayed. The airport is about 8 km from the city centre (around 15 minutes)."],
    ["How much does a taxi cost in Kars?", "Rides within the city use the official taxi meter. For out-of-town trips such as Ani, Sarıkamış or Lake Çıldır, the fare is agreed with you before departure."],
    ["Can you take me to Ani Ruins and wait?", "Yes. Ani is about 45 km from Kars (around 45 minutes). Most visitors spend 2–3 hours there; we agree the waiting time and total fare in advance."],
    ["Do you go to Sarıkamış ski resort?", "Yes — from the airport, the train station or your hotel in Kars. It’s about 60 km (around 1 hour); in snowy weather we check road conditions first."],
    ["I’m arriving on the Eastern Express (Doğu Ekspresi). Can you meet the train?", "Yes. Tell us your travel date and we’ll wait at Kars station for the actual arrival time."],
    ["I don’t speak Turkish. How do I book?", "Use the booking form or WhatsApp: write in English and share your live location. Short, simple messages work best."],
  ],
};

function ingilizceGovde(s) {
  const hizmetler = [
    ["ucak", "Kars Airport (KSY)", "Meet & greet at arrivals, flight tracking, late-night flights.", "~8 km · 15 min", "Kars Airport (KSY)"],
    ["ani", "Ani Ruins round trip", "Hotel pickup, waiting time included, back to Kars.", "~45 km · 45 min", "Ani Ruins"],
    ["dag", "Sarıkamış ski transfer", "From the airport or station straight to your ski hotel.", "~60 km · 1 h", "Sarıkamış Ski Resort"],
    ["tren", "Eastern Express", "Pickup at Kars train station when the Doğu Ekspresi arrives.", "~2–3 km to hotels", "Kars Train Station"],
    ["kar", "Lake Çıldır", "Horse-drawn sleighs on the frozen lake in winter.", "1–1.5 h each way", "Lake Çıldır"],
    ["sehir", "City rides", "Hotels, Kars Castle, museums, restaurants, bus station.", "Metered fare", "My hotel in Kars"],
  ];
  return `${kahraman(s)}
${istatHtml(s)}
<section class="bolum" id="services" aria-labelledby="hizmet-b"><div class="kap">
  <div class="bolum-ust" data-reveal>
    <div><p class="etiket">Services</p><h2 id="hizmet-b">Wherever you’re headed in Kars</h2></div>
    <p class="bolum-giris">Metered fares in the city. For out-of-town trips the price is agreed before you set off.</p>
  </div>
  <div class="kartlar kartlar-3">
    ${hizmetler.map(([ik, b, a, m, yer]) => `<a class="kart" href="#book" data-yer="${esc(yer)}" data-reveal><span class="kart-ik">${ikon(ik)}</span><h3>${b}</h3><p>${a}</p><span class="kart-alt"><span class="cip">${m}</span><span class="kart-ok">${ikon("ok")}</span></span></a>`).join("\n    ")}
  </div>
</div></section>
${aracBolumu(s)}
<section class="bolum bolum-koyu" aria-labelledby="nasil-b"><div class="kap">
  <div data-reveal>
    <p class="etiket">How it works</p>
    <h2 id="nasil-b">A taxi in three steps</h2>
    <ol class="adimlar adimlar-yatay">
      <li><span class="adim-no">1</span><div><b>Message or call</b><span>WhatsApp ${esc(intl(c.telefonGorunen))} — English is fine.</span></div></li>
      <li><span class="adim-no">2</span><div><b>Share your location</b><span>Send your live location or hotel name. No address needed.</span></div></li>
      <li><span class="adim-no">3</span><div><b>Your taxi arrives</b><span>Look for the yellow taxi with plate ${esc(c.plaka)}.</span></div></li>
    </ol>
  </div>
</div></section>
${planlayici(s)}
${sssHtml(s)}
${haritaHtml(s)}
${sonCta(s, "Need a taxi in Kars?", "Message us now — we’re open 24/7.")}`;
}

function gizlilikGovde() {
  return `<section class="bolum bolum-sade"><div class="kap dar metin">
  <p class="etiket">Yasal</p>
  <h1>Gizlilik ve KVKK Aydınlatma Metni</h1>
  <p>Bu internet sitesi ${esc(c.marka)} (${esc(adresSatiri)}) tarafından işletilmektedir.</p>
  <h2>Hangi verileri işliyoruz?</h2>
  <p>Sitedeki transfer planlama formu bilgileri sunucuya göndermez ve saklamaz; yalnızca cihazınızda WhatsApp mesajı olarak hazırlanır, göndermek sizin tercihinizdir. Bizi telefonla aradığınızda veya WhatsApp'tan yazdığınızda paylaştığınız ad, telefon numarası, konum ve yolculuk bilgileri yalnızca taksi hizmetini sağlamak amacıyla kullanılır ve üçüncü kişilerle paylaşılmaz.</p>
  <h2>Çerezler ve ölçüm</h2>
  <p>Sitenin performansını ve reklamların etkinliğini ölçmek için Google Analytics / Google Ads ölçüm araçları kullanılabilir. Bu araçlar anonim kullanım verisi toplar. Tarayıcı ayarlarınızdan çerezleri engelleyebilirsiniz.</p>
  <h2>Haklarınız</h2>
  <p>6698 sayılı KVKK'nın 11. maddesi kapsamındaki haklarınız için ${esc(c.telefonGorunen)} numarasından bize ulaşabilirsiniz.</p>
  <p class="dipnot">Son güncelleme: ${BUGUN}</p>
</div></section>`;
}

// ---------- Yazdır ----------
rmSync(OUT, { recursive: true, force: true });
const yaz = (yol, icerik) => { const p = join(OUT, yol); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, icerik); };

for (const s of sayfalar) {
  const dosya = s.yol === "/" ? "index.html" : `${s.yol.slice(1)}/index.html`;
  yaz(dosya, layout(s, s.anasayfa ? anasayfaGovde(s) : hizmetGovde(s)));
}
yaz("en/index.html", layout(ingilizce, ingilizceGovde(ingilizce)));
yaz("rehber/index.html", layout(REHBER_HUB, rehberHubGovde(REHBER_HUB)));
for (const h of REHBERLER) yaz(`${h.yol.slice(1)}/index.html`, layout(h, rehberGovde(h)));
const gizlilik = { yol: "/gizlilik", baslik: `Gizlilik ve KVKK | ${c.marka}`, aciklama: `${c.marka} gizlilik ve KVKK aydınlatma metni.`, waMetin: WA_GENEL };
yaz("gizlilik/index.html", layout(gizlilik, gizlilikGovde()).replace('content="index,follow,max-image-preview:large"', 'content="noindex,follow"'));
yaz("404.html", layout({ yol: "/404", baslik: `Sayfa bulunamadı | ${c.marka}`, aciklama: "Aradığınız sayfa bulunamadı.", waMetin: WA_GENEL },
  `<section class="bolum bolum-sade"><div class="kap dar metin"><p class="etiket">404</p><h1>Sayfa bulunamadı</h1><p>Ama taksi hâlâ bir telefon uzağınızda.</p>${aramaButonlari({ waMetin: WA_GENEL })}<p><a class="baglanti" href="/">Ana sayfaya dön ${ikon("ok")}</a></p></div></section>`)
  .replace('content="index,follow,max-image-preview:large"', 'content="noindex"'));

const haritaSayfalari = [...sayfalar.map((s) => [s.yol, s.anasayfa ? "1.0" : "0.8"]), ["/en", "0.8"], ["/rehber", "0.7"], ...REHBERLER.map((h) => [h.yol, "0.7"])];
yaz("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${haritaSayfalari.map(([yol, p]) => `  <url><loc>${c.domain}${yol === "/" ? "/" : yol}</loc><lastmod>${BUGUN}</lastmod><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);
yaz("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${c.domain}/sitemap.xml\n`);
yaz("site.webmanifest", JSON.stringify({
  name: c.marka, short_name: "Çamlıca Taksi", lang: "tr", start_url: "/", display: "standalone",
  background_color: "#0e1014", theme_color: "#0e1014",
  icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
}, null, 2));
for (const f of ["favicon.svg", "favicon.ico", "favicon-48.png", "favicon-96.png", "favicon-192.png", "og.png", "icon-512.png", "apple-touch-icon.png"]) {
  try { copyFileSync(join("public", f), join(OUT, f)); } catch { console.warn(`! public/${f} yok`); }
}
for (const klasor of ["foto", "font"]) {
  mkdirSync(join(OUT, klasor), { recursive: true });
  for (const f of readdirSync(join("public", klasor))) copyFileSync(join("public", klasor, f), join(OUT, klasor, f));
}

// Doldurulmamış bilgi uyarısı
const eksik = [];
if (/X{3}/.test(c.telefon + c.whatsapp)) eksik.push("telefon / whatsapp");
if (/\[/.test(c.adres.sokak + c.adres.mahalle)) eksik.push("durak adresi");
if (!c.googleHaritaLinki) eksik.push("googleHaritaLinki (İşletme Profili açılınca)");
if (!c.takip.googleAdsId) eksik.push("Google Ads ID (reklam başlayınca)");
console.log(`✓ ${sayfalar.length + 4 + REHBERLER.length} sayfa → ${OUT}/`);
if (eksik.length) console.log("! Eksik bilgiler:\n  - " + eksik.join("\n  - "));
