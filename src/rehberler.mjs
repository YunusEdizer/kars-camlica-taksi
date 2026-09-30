// Ulaşım rehberleri. Mesafe/süreler 16–17.09.2026'da Google Haritalar'da durağın konumundan ölçüldü;
// resmî bilgiler aşağıdaki "kaynaklar" listelerinde. Değişebilecek bilgiler (saat, ücret, sefer tarihi) için
// metinlerde kesin rakam verilmez, okuyucu resmî kaynağa yönlendirilir.

const GUNCELLEME = "2026-09-17";

export const REHBER_HUB = {
  yol: "/rehber",
  tur: "rehber-hub",
  kisa: "Rehber",
  ikon: "pusula",
  baslik: "Kars Ulaşım Rehberi | Havalimanı, Ani, Sarıkamış, Gar",
  aciklama: "Kars'a gelenler için ulaşım rehberi: havalimanından şehre, Ani Ören Yeri'ne, Sarıkamış Kayak Merkezi'ne ve Kars Garı'ndan otele nasıl gidilir?",
  h1: "Kars ulaşım rehberi",
  ust: "Kars'a gelen misafirler için",
  giris: "Havalimanından şehre, Ani'ye, Sarıkamış'a ve gardan otelinize nasıl gidersiniz? Seçenekleri, süreleri ve dikkat edilecekleri Kars'ta her gün yol yapan yerel taksi olarak yazdık.",
  waMetin: "Merhaba, Kars'ta taksi istiyorum. Konumum: ",
};

export const REHBERLER = [
  {
    yol: "/rehber/kars-havalimani-sehir-merkezi-ulasim",
    tur: "rehber",
    kisa: "Havalimanından şehre",
    ikon: "ucak",
    guncelleme: GUNCELLEME,
    baslik: "Kars Havalimanı'ndan Şehir Merkezine Nasıl Gidilir?",
    aciklama: "Kars Harakani Havalimanı'ndan şehir merkezine servis, taksi ve araç kiralama: mesafe, süre ve hangi seçeneğin kime uygun olduğu. Güncel ulaşım rehberi.",
    h1: "Kars Havalimanı'ndan şehir merkezine nasıl gidilir?",
    giris: "Kars Harakani Havalimanı'na (KSY) indiniz; şimdi şehre, otelinize ya da doğrudan Sarıkamış'a geçmeniz gerekiyor. Seçenekleri tek tek karşılaştırdık.",
    kisaCevap: "Kars Harakani Havalimanı şehir merkezine 6–8 km uzaklıkta; yol arabayla yaklaşık 15 dakika sürer. Havalimanında uçuş saatlerine göre çalışan servis, taksi ve araç kiralama seçenekleri bulunur. Bagajınız çoksa, gece iniyorsanız ya da doğrudan otelinize veya Sarıkamış'a gidecekseniz taksi en pratik seçenektir.",
    mesafe: [["Havalimanı → Kars merkez", "~8 km", "~15 dk"]],
    plan: ["Kars Havalimanı", "Kars merkez"],
    ilgili: "/kars-havalimani-taksi",
    waMetin: "Merhaba, Kars Havalimanı'ndan taksi istiyorum. Uçuş no / saat: ",
    tablo: [
      ["Havalimanı servisi", "Uçuşa göre kalkar", "Ekonomik", "Belirli noktalara bırakır, kapıya kadar gitmez. Saat ve ücreti inişten önce teyit edin."],
      ["Taksi", "~15 dk", "Kapıdan kapıya, bagajla rahat, gece de", "Servisten pahalı; şehir içinde taksimetre çalışır."],
      ["Araç kiralama", "~15 dk", "Ani, Çıldır, Sarıkamış'ı kendi programınızla gezme", "Kışın kar ve buzlu yol; otelde park yeri."],
    ],
    bolumler: [
      ["Havalimanı servisi", [
        "DHMİ'nin Kars Harakani Havalimanı sayfasında, havalimanı ile şehir arasında servis hizmeti veren firma olarak Vergül Turizm listeleniyor. Servisler uçuş saatlerine göre çalışır ve yolcuları şehir merkezindeki belirli noktalara bırakır.",
        "Sefer saatleri, ücret ve bırakış noktaları değişebildiği için özellikle gece geç saatte iniyorsanız servisin çalışıp çalışmadığını inişten önce firmayla teyit etmenizi öneririz.",
      ]],
      ["Taksi", [
        "Havalimanı çıkışında taksi bulunur. Önceden ayırtırsanız uçuş numaranıza göre karşılanır, rötarda da beklenirsiniz. Şehir içi yolculuk taksimetreyle ücretlendirilir.",
        "Otelinize kapıdan kapıya gitmenin yanında, şehre uğramadan doğrudan Sarıkamış'a (~1 saat) ya da Ani Ören Yeri'ne (~50 dk) geçmek için de en hızlı yoldur.",
      ]],
      ["Araç kiralama", [
        "Havalimanında araç kiralama ofisleri bulunur. Kars çevresini — Ani, Çıldır Gölü, Sarıkamış — kendi programınızla gezmek istiyorsanız mantıklı bir seçenektir.",
        "Kasım–Mart arasında kar, buz ve kısa gün ışığı sürüşü zorlaştırabilir; kış lastiğini ve yol durumunu yola çıkmadan kontrol edin.",
      ]],
    ],
    secim: [
      ["Tek başınıza, az bagajla ve gündüz iniyorsanız", "havalimanı servisi yeterli olabilir."],
      ["Aileyle, bagajla, gece ya da kışın iniyorsanız", "önceden ayırtılmış taksi en rahatı."],
      ["Havalimanından doğrudan Sarıkamış veya Ani'ye gidecekseniz", "taksi transferi zaman kazandırır."],
      ["Birkaç gün boyunca çevreyi gezecekseniz", "araç kiralamayı düşünebilirsiniz."],
    ],
    ipuclari: [
      "Uçuş numaranızı önceden iletirseniz rötarda da iniş saatinize göre beklenirsiniz.",
      "Kars kışın çok soğuk olabilir; dışarıda araç aramak yerine aracın hazır beklemesini sağlayın.",
      "Sarıkamış'a gidecekseniz şehre uğramadan havalimanından doğrudan yola çıkabilirsiniz.",
    ],
    sss: [
      ["Kars Havalimanı şehir merkezine ne kadar uzak?", "DHMİ'ye göre yaklaşık 6 km; Faikbey Caddesi'ndeki durağımızdan ölçtüğümüz yol yaklaşık 8 km ve arabayla 15 dakika civarı."],
      ["Havalimanından şehre otobüs ya da servis var mı?", "Evet, uçuş saatlerine göre çalışan havalimanı servisi bulunur. Güncel saatleri ve ücreti inişten önce servis firmasına sormanızı öneririz."],
      ["Gece inersem taksi bulabilir miyim?", "Havalimanında taksi bulunur; gece geç saatlerde önceden ayırtmak en güvenlisidir. Çamlıca Taksi 7/24 hizmet verir."],
    ],
    kaynaklar: [["DHMİ — Kars Harakani Havalimanı ulaşım", "https://www.dhmi.gov.tr/sayfalar/havalimani/kars/Ulasim.aspx"]],
  },
  {
    yol: "/rehber/kars-ani-oren-yeri-ulasim",
    tur: "rehber",
    kisa: "Kars'tan Ani'ye",
    ikon: "ani",
    guncelleme: GUNCELLEME,
    baslik: "Kars'tan Ani Ören Yeri'ne Nasıl Gidilir? Ulaşım Rehberi",
    aciklama: "Kars'tan Ani Ören Yeri'ne taksi, günübirlik tur, kiralık araç ve minibüsle ulaşım: süre, dönüş sorunu, ziyaret süresi ve pratik ipuçları.",
    h1: "Kars'tan Ani Ören Yeri'ne nasıl gidilir?",
    giris: "UNESCO Dünya Mirası Listesi'ndeki Ani, Kars'a gelenlerin en çok görmek istediği yer. Ancak ulaşımı planlamazsanız dönüşte zorlanabilirsiniz.",
    kisaCevap: "Ani Ören Yeri, Kars şehir merkezinin yaklaşık 45 km doğusunda, Ocaklı köyü yanındadır; yol arabayla 40–45 dakika sürer. Düzenli toplu taşıma çok sınırlı olduğu için ziyaretçilerin çoğu bekleme dahil gidiş-dönüş taksiyle, günübirlik turla ya da kiralık araçla gider.",
    mesafe: [["Kars merkez → Ani Ören Yeri", "~46 km", "~40 dk"]],
    plan: ["Kars merkez", "Ani Ören Yeri"],
    ilgili: "/ani-oren-yeri-taksi",
    waMetin: "Merhaba, Ani Ören Yeri için gidiş-dönüş taksi istiyorum. Tarih / kişi sayısı: ",
    tablo: [
      ["Taksi (bekleme dahil)", "~40–45 dk", "Otelden alış, gezi sonunda dönüş garantisi", "Bekleme süresini ve fiyatı yola çıkmadan netleştirin."],
      ["Günübirlik tur", "Programa göre", "Rehberli anlatım", "Sabit saat ve program; genelde başka duraklar da içerir."],
      ["Kiralık araç", "~40–45 dk", "Tamamen esnek", "Kışın yol koşulları; köy yolunda dikkatli sürüş."],
      ["Köy minibüsü", "Değişken", "Ekonomik", "Sefer çok az, saatleri değişken; ziyaret sonrası dönüş garantisi yok."],
    ],
    bolumler: [
      ["Neden çoğu ziyaretçi taksiyle gidiyor?", [
        "Ani, sınır bölgesinde bir köy yolunun sonunda yer alır. Bölgedeki minibüsler köy halkının ihtiyacına göre çalışır, ziyaretçi saatine göre değil. Farklı kaynaklarda farklı sefer saatleri geçmesinin sebebi de bu; saatler sık değişebilir.",
        "Minibüsle gitmeyi düşünüyorsanız güncel saati otelinize ya da Kars otogarına sorun ve dönüşü mutlaka planlayın. Taksiyle gittiğinizde ise araç siz gezerken bekler ve sizi otelinize geri getirir.",
      ]],
      ["Ani'de ne kadar zaman ayırmalı?", [
        "Ören yeri geniş ve açık bir alana yayılır. Öne çıkan yapıları yürüyerek görmek için ziyaretçilerin çoğu 2–3 saat ayırır.",
        "Rahat ayakkabı giyin; yazın şapka ve su, kışın sıkı giysi alın. Alan rüzgâra açıktır ve gölgelik az.",
      ]],
      ["Giriş ücreti ve ziyaret saatleri", [
        "Ani Ören Yeri Kültür ve Turizm Bakanlığı'na bağlıdır. Giriş ücreti, MüzeKart geçerliliği ve mevsime göre değişen ziyaret saatleri için gitmeden önce Bakanlığın müze sitesini kontrol edin.",
      ]],
      ["Ani'yi Kars şehir turuyla birleştirmek", [
        "Sabah Ani'ye gidip öğleden sonra Kars Kalesi, Taş Köprü ve Baltık tarzı binaların bulunduğu merkez sokakları gezmek, tek günde Kars'ın öne çıkan yerlerini görmenin en verimli yoludur.",
      ]],
    ],
    secim: [
      ["Kendi hızınızda gezmek ve dönüşü garantilemek istiyorsanız", "bekleme dahil taksi."],
      ["Tarihi anlatımla gezmek istiyorsanız", "rehberli günübirlik tur."],
      ["Birkaç gün boyunca çevreyi gezecekseniz", "kiralık araç."],
      ["Bütçe öncelikliyse ve saatleriniz esnekse", "köy minibüsü — dönüşü önceden planlayarak."],
    ],
    ipuclari: [
      "Ani'ye sabah erken gitmek, özellikle yazın sıcaktan ve kışın erken kararan havadan korur.",
      "Taksiyle giderken bekleme süresini (örneğin 2,5 saat) baştan konuşun.",
      "Sınır bölgesi olduğu için alandaki uyarı ve yasak işaretlerine uyun.",
    ],
    sss: [
      ["Kars ile Ani arası kaç km?", "Google Haritalar'a göre Kars merkezdeki durağımızdan Ani Ören Yeri'ne yol yaklaşık 46 km ve arabayla 40 dakika civarı."],
      ["Ani'ye toplu taşıma var mı?", "Düzenli toplu taşıma çok sınırlıdır; köy minibüslerinin saatleri değişkendir ve ziyaret sonrası dönüş garantisi yoktur."],
      ["Taksi Ani'de bekler mi?", "Evet. Gezi süresini baştan konuşursanız taksi siz gezerken bekler ve sizi geri getirir."],
    ],
    kaynaklar: [["T.C. Kültür ve Turizm Bakanlığı — Müzeler ve ören yerleri", "https://muze.gov.tr/"]],
  },
  {
    yol: "/rehber/sarikamis-kayak-merkezi-ulasim",
    tur: "rehber",
    kisa: "Sarıkamış'a ulaşım",
    ikon: "dag",
    guncelleme: GUNCELLEME,
    baslik: "Sarıkamış Kayak Merkezi'ne Nasıl Gidilir? Kars'tan Ulaşım",
    aciklama: "Kars Havalimanı, Kars merkez ve trenle Sarıkamış Kayak Merkezi'ne ulaşım: taksi, minibüs, Doğu Ekspresi ve kiralık araç; süre ve kış yolu ipuçları.",
    h1: "Sarıkamış Kayak Merkezi'ne nasıl gidilir?",
    giris: "Sarıkamış'ın kristal karı her kış kayakseverleri Kars'a getiriyor. Uçak, tren ya da otobüsle geldikten sonra kayak merkezine nasıl ulaşacağınızı karşılaştırdık.",
    kisaCevap: "Sarıkamış Kayak Merkezi, Kars merkezden karayoluyla yaklaşık 57 km uzaklıktadır; yol arabayla 50 dakika ile 1 saat arası sürer. Kars'tan Sarıkamış'a minibüs ve otobüsle, Doğu Ekspresi ile de Sarıkamış istasyonuna ulaşmak mümkün. Ancak kayak ekipmanıyla, özellikle havalimanından doğrudan otele gitmek için taksi transferi en pratik yoldur.",
    mesafe: [["Kars merkez → Sarıkamış Kayak Merkezi", "~57 km", "~50 dk"]],
    plan: ["Kars Havalimanı", "Sarıkamış Kayak Merkezi"],
    ilgili: "/sarikamis-taksi",
    waMetin: "Merhaba, Sarıkamış'a taksi transferi istiyorum. Tarih / kişi sayısı: ",
    tablo: [
      ["Taksi transferi", "~50 dk – 1 sa", "Havalimanı ya da gardan doğrudan otele, ekipmanla rahat", "Fiyatı yola çıkmadan konuşun."],
      ["Minibüs / otobüs", "Aktarmalı", "Ekonomik", "Önce Sarıkamış merkeze iner, kayak merkezine ayrıca ulaşım gerekir; ekipmanla zahmetli."],
      ["Doğu Ekspresi", "Tren programına bağlı", "Manzaralı yolculuk", "Sarıkamış istasyonuna iner; istasyondan otele ayrıca araç gerekir, varış saati kayak programına uymayabilir."],
      ["Kiralık araç", "~50 dk – 1 sa", "Esnek", "Kar lastiği şart; yoğun karda yol kapanabilir, otel otoparkını sorun."],
    ],
    bolumler: [
      ["Kars Havalimanı'ndan doğrudan Sarıkamış'a", [
        "Uçakla geliyorsanız Kars şehir merkezine uğramanız gerekmez. Havalimanından Sarıkamış otellerine yol yaklaşık 1 saattir; önceden ayırttığınız taksi uçuş saatinize göre sizi karşılar ve ekipmanınızla birlikte otelinize bırakır.",
      ]],
      ["Trenle geliyorsanız", [
        "Doğu Ekspresi, Kars'a varmadan önce Sarıkamış istasyonunda da durur. Sarıkamış'ta inerseniz kayak merkezine kısa bir araç yolculuğu kalır. Tren saatleri sezona göre değişebilir; güncel sefer bilgisi için TCDD Taşımacılık'ı kontrol edin.",
        "Turistik Doğu Ekspresi ile Kars'a kadar geldiyseniz Kars Garı'ndan Sarıkamış'a taksiyle yaklaşık 1 saatte geçebilirsiniz.",
      ]],
      ["Minibüs ve otobüsle", [
        "Kars'tan Sarıkamış'a minibüs ve otobüs seferleri bulunur. Bu seçenek ekonomiktir, ancak Sarıkamış merkezinden kayak merkezine ve otelinize ayrıca ulaşmanız gerekir. Kayak ekipmanı ve valizle aktarma yapmak yorucu olabilir.",
      ]],
      ["Kış yolu için önemli notlar", [
        "Kars–Sarıkamış yolu kışın kar ve buzlanmaya açıktır; yoğun kar yağışında yollar geçici olarak kapanabilir. Yola çıkmadan önce Karayolları Genel Müdürlüğü'nün yol durumu bilgisine bakın ve kış şartlarına uygun araçla gidin.",
      ]],
    ],
    secim: [
      ["Uçakla gelip ekipmanla doğrudan otele gidecekseniz", "havalimanından taksi transferi."],
      ["Trenle geliyorsanız ve saat uygunsa", "Sarıkamış istasyonunda inip kısa taksi yolculuğu."],
      ["Tek başınıza ve az eşyayla geliyorsanız", "minibüs / otobüs."],
      ["Kış şartlarında sürüş deneyiminiz varsa", "kiralık araç."],
    ],
    ipuclari: [
      "Kayak sezonunda dönüş transferinizi de önceden ayırtın; sezon sonunda talep yoğun olur.",
      "Kayak merkezinin açılış tarihi kar durumuna bağlıdır; gitmeden tesisten teyit edin.",
      "Kısa kış günlerinde karanlıkta uzun yola çıkmamak için yolculuğu gündüz saatlerine planlayın.",
    ],
    sss: [
      ["Kars Havalimanı'ndan Sarıkamış'a ne kadar sürer?", "Normal yol koşullarında yaklaşık 1 saat. Kar yağışında süre uzayabilir."],
      ["Sarıkamış'a tren var mı?", "Evet. Doğu Ekspresi Sarıkamış istasyonunda durur; güncel sefer saatleri için TCDD Taşımacılık'ı kontrol edin."],
      ["Sarıkamış kayak sezonu ne zaman?", "Kar durumuna göre değişmekle birlikte genellikle Aralık ile Mart arasıdır; güncel açılış tarihini tesisten teyit edin."],
    ],
    kaynaklar: [
      ["TCDD Taşımacılık — sefer ve bilet bilgisi", "https://www.tcddtasimacilik.gov.tr/"],
      ["Karayolları Genel Müdürlüğü — yol durumu", "https://www.kgm.gov.tr/"],
    ],
  },
  {
    yol: "/rehber/dogu-ekspresi-kars-gar-ulasim",
    tur: "rehber",
    kisa: "Doğu Ekspresi ile varış",
    ikon: "tren",
    guncelleme: GUNCELLEME,
    baslik: "Doğu Ekspresi ile Kars'a Varınca: Gardan Otele Ulaşım",
    aciklama: "Doğu Ekspresi ya da Turistik Doğu Ekspresi ile Kars Garı'na vardığınızda şehir merkezine, otelinize, Ani'ye ve Sarıkamış'a nasıl gidersiniz? Pratik rehber.",
    h1: "Doğu Ekspresi ile Kars'a varınca: gardan otele ulaşım",
    giris: "Uzun ve manzaralı bir tren yolculuğunun ardından Kars Garı'ndasınız. Şehir merkezine, otelinize ve sonraki durağınıza nasıl geçeceğinizi özetledik.",
    kisaCevap: "Kars Garı şehir merkezine çok yakındır: merkezdeki Faikbey Caddesi'ne arabayla 3–5 dakika, yürüyerek 10–15 dakika. Valizle, gece ya da karlı havada taksi en rahat seçenektir. Aynı gün Ani'ye veya Sarıkamış'a geçecekseniz gardan doğrudan transfer ayarlayabilirsiniz.",
    mesafe: [["Kars Garı → Kars merkez", "~1 km", "3–5 dk"]],
    plan: ["Kars Garı", "Kars merkez"],
    ilgili: "/kars-tren-gari-taksi",
    waMetin: "Merhaba, Kars Garı'nda karşılama için taksi istiyorum. Tren / tarih: ",
    tablo: [
      ["Yürüyerek", "10–15 dk", "Ücretsiz", "Valizle, gece ve karlı havada zorlaşır."],
      ["Taksi", "3–5 dk", "Kapıya kadar, bagajla rahat", "Tren gecikirse önceden ayarlanmış taksi bekler."],
      ["Otel servisi", "Değişir", "Bazı oteller sunar", "Önceden otelinize sorun."],
    ],
    bolumler: [
      ["Doğu Ekspresi mi, Turistik Doğu Ekspresi mi?", [
        "Doğu Ekspresi Ankara ile Kars arasında düzenli sefer yapan trendir. Turistik Doğu Ekspresi ise kış sezonunda, haftanın belirli günlerinde, yol üzerindeki şehirlerde uzun molalar vererek çalışır; 2025–2026 sezonunda seferler Aralık sonundan Mart başına kadar sürdü.",
        "Yeni sezonun tarihleri, saatleri ve bilet satışları TCDD Taşımacılık tarafından açıklanır.",
      ]],
      ["Gardan şehir merkezine", [
        "Kars Garı şehir merkezinin hemen yanındadır. Hafif eşyayla ve gündüz yürüyerek merkeze rahatça ulaşılır. Kışın −20 °C'yi bulan soğuklarda, karlı zeminde valizle yürümek ise zorlaşır; bu durumda kısa bir taksi yolculuğu çok daha rahattır.",
      ]],
      ["Tren gecikirse", [
        "Uzun yolculuklarda gecikme olabilir. Taksinizi önceden ayırtıp tren ve tarih bilgisini iletirseniz, trenin gerçek varış saatine göre gar çıkışında beklenirsiniz.",
      ]],
      ["Kars'ta sonraki durağınız", [
        "Kars'ta kalacağınız süreye göre Ani Ören Yeri (~40 dk), Kars şehir turu, Çıldır Gölü'nde atlı kızak (~1 sa 15 dk) ya da Sarıkamış (~1 saat) planlayabilirsiniz. Dönüş treni için otelinizden gara zamanında yetişmeyi de unutmayın.",
      ]],
    ],
    secim: [
      ["Hafif eşyayla ve gündüz vardıysanız", "yürüyerek merkeze gidebilirsiniz."],
      ["Valizle, gece ya da karlı havada", "taksi."],
      ["Aynı gün Ani, Çıldır veya Sarıkamış'a geçecekseniz", "gardan doğrudan transfer."],
    ],
    ipuclari: [
      "Tren bilgisini (tarih ve sefer) önceden iletin; gecikmede de beklenirsiniz.",
      "Kış sezonunda Kars'ta gece sıcaklıkları çok düşük olabilir; sıkı giyinin.",
      "Dönüş treni için otelden çıkış saatini trafiği ve kar durumunu hesaba katarak planlayın.",
    ],
    sss: [
      ["Kars Garı şehir merkezine uzak mı?", "Hayır. Merkezdeki durağımıza arabayla yaklaşık 3 dakika, yürüyerek 10–15 dakikadır."],
      ["Turistik Doğu Ekspresi ne zaman çalışır?", "Kış sezonunda çalışır; 2025–2026 sezonunda seferler Aralık sonundan Mart başına kadar sürdü. Yeni sezon tarihleri için TCDD Taşımacılık'ı takip edin."],
      ["Gar çıkışında taksi bulabilir miyim?", "Evet; yoğun tren varışlarında beklememek için önceden ayırtmanız önerilir."],
    ],
    kaynaklar: [
      ["TCDD Taşımacılık — sefer ve bilet bilgisi", "https://www.tcddtasimacilik.gov.tr/"],
      ["Ulaştırma ve Altyapı Bakanlığı — Turistik Doğu Ekspresi duyurusu", "https://www.uab.gov.tr/haberler/turistik-dogu-ekspresi-yeni-sezona-hazir"],
    ],
  },
];
