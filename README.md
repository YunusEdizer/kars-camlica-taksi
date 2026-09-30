# Kars Çamlıca Taksi — Web Sitesi + Google Görünürlük Planı

36 T 0089 plakalı, Kars Çamlıca Taksi Durağı için statik ve çok hızlı web sitesi.

```bash
node build.mjs          # dist/ klasörünü üretir, eksik bilgileri listeler
node tools/kontrol.mjs  # başlık/açıklama uzunluğu, tekrar, şema ve kırık bağlantı kontrolü
npx vercel deploy --prod --scope yunus-emre-s-projects3   # yayın
```

Bütün işletme bilgileri **`site.config.json`** içinde. Oradaki bilgi değişince tüm sayfalar, Google yapısal verisi, site haritası ve paylaşım görselleri birlikte güncellenir.

## Mevcut durum (16.09.2026)

| | |
|---|---|
| Google İşletme Profili | **Var:** "Kars Merkez Çamlıca Taksi", 4,8 puan, kategori Taksi · [haritada aç](https://www.google.com/maps?cid=2235030596299504336) |
| Profildeki telefon | 0536 616 89 35 (taksinin hattı, WhatsApp yok) |
| Profildeki site | camlicataksikars.com → şu an **Wix** üzerinde eski site |
| Konum | 40.6082555, 43.100122 · Faikbey Caddesi (mahalle teyit edilecek: komşu kayıtlarda İstasyon / Ortakapı) |
| Hatlar | 0531 273 35 85 (WhatsApp) · 0541 285 29 15 (WhatsApp) · 0536 616 89 35 (yalnızca çağrı) |

Sitede aramalar ve WhatsApp **0531**'e gider. Google yapısal verisinde ana telefon, profille birebir eşleşsin diye şimdilik **0536** (`profilTelefonu`). Profildeki ana numara 0531 yapılırsa `profilTelefonu` da 0531 yapılıp yeniden derlenmeli.

Kalan tek ayar: `takip.*` (GA4 / Google Ads kimlikleri, reklam başlayınca).

## Sayfalar (her biri ayrı bir aramayı hedefler)

| Adres | Hedef aramalar |
|---|---|
| `/` | kars taksi, kars taksi numarası, kars taksi durağı, kars gece taksi |
| `/kars-havalimani-taksi` | kars havalimanı taksi, harakani havalimanı taksi |
| `/sarikamis-taksi` | kars sarıkamış taksi, sarıkamış kayak transfer |
| `/ani-oren-yeri-taksi` | ani harabeleri taksi, kars ani nasıl gidilir |
| `/kars-tren-gari-taksi` | kars gar taksi, doğu ekspresi kars taksi |
| `/kars-otogar-taksi` | kars otogar taksi |
| `/cildir-golu-taksi` | çıldır gölü taksi, çıldır atlı kızak ulaşım |
| `/selim-taksi` · `/digor-taksi` · `/kagizman-taksi` · `/arpacay-taksi` · `/akyaka-taksi` · `/susuz-taksi` | kars selim taksi, digor taksi, kağızman kars taksi … (ilçe ↔ Kars) |
| `/kars-hastane-taksi` | kars hastane taksi, harakani devlet hastanesi taksi |
| `/kafkas-universitesi-taksi` | kafkas üniversitesi taksi, kampüs/yurt taksi |
| `/kars-sehir-turu-taksi` | kars şehir turu, kars gezisi taksi |
| `/kars-gece-taksi` | kars gece taksi, gece açık taksi |
| `/en` | kars taxi, kars airport taxi, ani ruins taxi (İngilizce) |
| `/rehber` + 4 rehber | kars havalimanından şehre nasıl gidilir, kars ani nasıl gidilir, sarıkamış kayak merkezine nasıl gidilir, doğu ekspresi kars gar ulaşım |

Mesafe/süreler 16.09.2026'da Google Haritalar'da durağın konumundan ölçüldü (ilçe sayfaları: `src/ek-sayfalar.mjs`).

Teknik SEO hazır: her sayfada ayrı başlık/açıklama, `LocalBusiness + TaxiStand` + `FAQPage` + `BreadcrumbList` yapısal verisi, 7/24 çalışma saati, hizmet bölgeleri, canonical, sitemap.xml, robots.txt, Open Graph paylaşım görseli ve coğrafi meta etiketleri. Sayfalar harici font ya da kütüphane yüklemez; harita yalnızca tıklanınca açılır. Arama ve WhatsApp tıklamaları Google Ads dönüşümü olarak ölçülür.

---

## 1) Yayın (1. gün)

1. **camlicataksikars.com kimin hesabında?** Alan adı şu an Wix'e bağlı (DNS 185.230.63.x). Wix hesabına ya da alan adının kayıtlı olduğu firmaya erişim lazım. Alan adı Wix'ten alındıysa DNS kayıtları Wix panelinden düzenlenebilir veya alan adı Cloudflare/başka bir firmaya transfer edilebilir.
2. Vercel'de yeni proje → bu klasör (build komutu ve çıktı klasörü `vercel.json` içinde tanımlı).
3. Vercel'e `www.camlicataksikars.com` ve `camlicataksikars.com` ekle; DNS'te A kaydı ve `www` CNAME'i Vercel'in verdiği değerlere çevir. **Wix'teki site aboneliği DNS geçişi doğrulanmadan iptal edilmesin.**
4. **Google Search Console** → alan adı mülkü ekle (Cloudflare'de TXT kaydıyla doğrula) → `sitemap.xml` gönder → ana sayfa için "Dizine eklenmesini iste".
5. **Bing Webmaster Tools** → Search Console'dan içe aktar.

## 2) MEO — Google İşletme Profili (en önemli adım)

"Kars taksi" aramasında en üstte çıkan **harita kutusudur**. Taksi aramalarının çoğu buradan arama yapar, siteye bile girmez.

**Profil zaten var — yeni profil AÇILMAYACAK** (ikinci profil, yinelenen kayıt sayılır ve ikisini de zayıflatır). Önce profili kimin yönettiği bulunmalı: taksici kendi Google hesabıyla business.google.com'a girip profili görüyorsa sorun yok. Görmüyorsa Haritalar'da profilde **"Bu işletmenin sahibi misiniz?"** ile sahiplik istenir.

1. **İşletme adı:** "Kars Merkez Çamlıca Taksi" olarak kalsın, daha fazla kelime eklenmesin.
2. **Birincil kategori:** `Taksi hizmeti`. **Ek kategoriler:** `Havalimanı servisi`, `Taksi durağı` (listede çıkarsa).
3. Adres şu an "Çamlıca Taksi, Merkez" gibi eksik görünüyor: **Faikbey Cd., 36000 Merkez/Kars** olarak düzeltilsin (site ile aynı; mahalle kesinleşince ikisine birden eklenecek). Konum noktası doğru. Hizmet bölgesi olarak Kars, Sarıkamış, Selim, Digor, Arpaçay, Kağızman, Susuz, Akyaka ekle.
4. Saatler: her gün 24 saat açık. **Ana telefon: 0531 273 35 85** (WhatsApp'lı hat) önerilir, 0541 ve 0536 ek telefon olarak girilsin. Web sitesi: `https://www.camlicataksikars.com`.
5. **Doğrulama** (sahiplik istenirse): Google büyük ihtimalle video ister. Tek çekimde: durak tabelası → sokak adı / çevre → taksi ve plakası → durak içi / telsiz-telefon → kişinin durağa erişimi (anahtar vb.).
6. **Fotoğraflar (en az 10):** plakası görünen taksi (dış), araç içi, durak tabelası, durağın cadde görünümü, şoför (isterse), kışın karlı yolda araç, havalimanında karşılama.
7. **Hizmetler** bölümüne site sayfalarındaki 7 hizmeti ekle.
8. **Soru-Cevap / ürünler:** "Gece hizmet var mı?", "Sarıkamış'a gidiyor musunuz?" gibi.
9. **Yorumlar = sıralama.** Her yolcuya kartvizit/araç içi QR ile yorum linki verilsin. Hedef: ilk ay 20, 3. ay 50+ yorum. Her yoruma cevap verilsin. ⚠️ Sahte yorum ya da yoruma karşılık indirim yasaktır, profil kapanır.
10. Haftada 1 **Google gönderisi** (kış yolu duyurusu, Sarıkamış sezonu, bayramda açığız vb.).

### Aynı bilgiyi başka yerlere de yaz

Ad, adres ve telefon her yerde **birebir aynı** olmalı:
Apple Business Connect (iPhone Haritalar), Yandex Haritalar (Rusya/Gürcistan'dan gelen turistler çok kullanır), Bing Places, Foursquare, Facebook sayfası, Instagram profili, varsa Kars rehber siteleri. Otellerin resepsiyonlarına kartvizit bırakmak da çok işe yarar.

## 3) Google Ads — "şimdi taksi lazım" aramaları için

Kars'ta rekabet düşük olduğu için tıklama ücretleri büyükşehirlere göre ucuz olur.

**Kampanya 1 — Arama (Aramaya yönelik)**
- Hedef: *Telefon aramaları*. Teklif: önce "Dönüşümleri artır", 30 dönüşümden sonra "Hedef EBM".
- **Konum:** Kars ili + Kars Harakani Havalimanı çevresi. Konum seçeneği: **"Hedef konumlarınızda bulunan veya bu konumlarla düzenli olarak ilgilenen kişiler"**. İstanbul'dan "kars havalimanı taksi" arayan turisti de yakalar.
- **Zaman:** 7/24 (gece aramalarında rakip yok, teklifi +%20 artır).
- **Anahtar kelimeler (sıralı eşleme):** `"kars taksi"`, `"kars taksi numarası"`, `"kars taksi durağı"`, `"kars havalimanı taksi"`, `"kars sarıkamış taksi"`, `"sarıkamış taksi"`, `"ani harabeleri taksi"`, `"kars gar taksi"`, `"kars otogar taksi"`, `[taksi kars]`
- **Negatif kelimeler:** `plaka satılık`, `taksi plakası`, `iş ilanı`, `şoför aranıyor`, `taksimetre fiyat`, `ehliyet`, `dolmuş`, `otobüs saatleri`, `ikinci el`
- **Başlıklar (≤30 karakter):** `Kars Taksi 7/24 Açık` · `Hemen Arayın, Kapınızdayız` · `Çamlıca Taksi Durağı` · `Kars Havalimanı Taksi` · `Sarıkamış Transfer` · `Plaka 36 T 0089` · `Gece Gündüz Hizmet`
- **Açıklamalar (≤90 karakter):** `Kars merkez, havalimanı, gar ve otogar. Bir telefonla aracınız yolda.` · `Sarıkamış ve Ani transferi. Şehir dışında fiyat yola çıkmadan netleşir.`
- **Öğeler:** Arama öğesi (telefon), Konum öğesi (İşletme Profili bağla), Site bağlantıları (7 hizmet sayfası).

**Kampanya 2 — Yalnızca arama reklamı (Call-only)**, mobil, aynı kelimeler. Kullanıcı reklama dokunduğunda siteye değil **doğrudan telefona** gider.

**Bütçe önerisi:** Günlük küçük bir bütçeyle başla, 2 hafta sonra arama başına maliyete göre artır. **Kasım–Mart** (Sarıkamış kayak sezonu + Turistik Doğu Ekspresi) bütçeyi 2–3 katına çıkar, yazın düşür.

**Dönüşüm ölçümü:** Ads'de "Web sitesindeki telefon numarasına yapılan tıklamalar" ve "WhatsApp tıklaması" dönüşümlerini oluştur. Kimlik (`AW-...`) ve etiketleri `site.config.json` → `takip` içine yaz, `node build.mjs` çalıştır. Site gerisini kendisi yapar.

## 4) İlk 90 gün takvimi

| Zaman | İş |
|---|---|
| 1. hafta | Site yayında, Search Console, İşletme Profili başvurusu + doğrulama videosu |
| 2. hafta | Profil onayı → fotoğraflar, hizmetler; Apple/Yandex/Bing kayıtları; Ads kampanyaları açılır |
| 3–4. hafta | Yorum toplama başlar (araç içi QR kart); oteller ve pansiyonlara kartvizit |
| 2. ay | Search Console'dan gelen aramalara göre sayfa metinleri güncellenir; Ads negatif kelimeleri temizlenir |
| 3. ay (Kasım) | Kış sezonu: Sarıkamış/Çıldır sayfaları öne çıkarılır, Ads bütçesi artırılır, haftalık Google gönderisi |

> Google hiçbir işletmeye organik sıralamada "1. sıra" garantisi vermez; kimse de garanti edemez. Ancak Kars'ta rekabet düşük olduğu için doğru kurulmuş bir İşletme Profili, düzenli yorumlar ve bu site ile harita sonuçlarında üst sıralara çıkmak gerçekçi bir hedeftir. Google Ads ise ilk günden en üstte görünmeyi sağlar.

---

## 5) Rekabet durumu (Google Haritalar, "taksi" · Kars merkez, 16.09.2026)

| Sıra | İşletme | Puan (yorum) |
|---|---|---|
| 1 | Kars Çarşı Taksi | 5,0 (249) |
| 2 | Kars Taksi Durağı | 5,0 (313) |
| 3 | Kars Merkez Taksi | 4,8 (155) |
| 4 | KARS TAKSİ | 5,0 (37) |
| 5 | Kars Gündoğdu Taksi (Faikbey Cd. — aynı cadde) | 5,0 (47) |
| … | Kars Konak, "Karsta taksi 7/24 (sarı suv)", Dilek, Kars Taksi ×2, Çiçek, Kars Otogar Taksi | 13–80 |
| **~13** | **Kars Merkez Çamlıca Taksi** | **4,8 (18)** |

Sonuçlar arayanın konumuna göre değişir; tablo tek bir anlık görüntüdür.

**Asıl açık yorum sayısı:** ilk üçün 155–313 yorumu var, bizim 18. Harita sıralamasında yakınlık + alaka + **bilinirlik (yorum sayısı/sıklığı)** belirleyici.

Hedefler:
- 30 gün: 60 yorum · 90 gün: 150 yorum · 6 ay: 300+ yorum (her yolcuya QR kart, haftada ~15 yorum)
- Her yoruma aynı hafta içinde cevap
- Yorum linki: İşletme Profili → "Daha fazla yorum alın" → `g.page/r/...` linki `site.config.json` → `googleYorumLinki` alanına yazılacak

Not: Rakiplerin bir kısmı işletme adına anahtar kelime eklemiş ("Kars Otogar Taksi - Kars Taksi", "Karsta taksi 7/24 (sarı suv)"). Bu Google kurallarına aykırıdır; Haritalar'da "Düzenleme önerin" ile gerçek tabela adı bildirilebilir. Aynısını biz yapmayacağız — profil askıya alınır.
