(function(){
  // Arama ve WhatsApp tıklamalarını GA4 + Google Ads dönüşümü olarak kaydet
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("[data-track]");
    if (!a || typeof window.gtag !== "function") return;
    var tur = a.getAttribute("data-track");
    gtag("event", tur === "call" ? "telefon_arama" : "whatsapp_tikla", { sayfa: location.pathname });
    var hedef = window.__donusum && window.__donusum[tur];
    if (hedef) gtag("event", "conversion", { send_to: hedef });
  });

  // Görünüme girince yumuşak belirme
  var ogeler = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(girdiler){
      girdiler.forEach(function(g){ if (g.isIntersecting) { g.target.classList.add("gorundu"); io.unobserve(g.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    ogeler.forEach(function(o, i){ o.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(o); });
  } else ogeler.forEach(function(o){ o.classList.add("gorundu"); });

  // Kaydırınca üst bar kenarlığı
  var ust = document.querySelector("[data-ust]");
  var kaydir = function(){ ust.classList.toggle("kaydi", scrollY > 8); };
  addEventListener("scroll", kaydir, { passive: true }); kaydir();

  // Menü: bağlantıya tıklanınca veya dışarı tıklanınca kapansın
  var menu = document.querySelector(".menu");
  if (menu) document.addEventListener("click", function(e){ if (menu.open && (!menu.contains(e.target) || e.target.closest(".menu-panel a"))) menu.open = false; });

  // Kars saati ile canlı durum
  var saatEl = document.querySelectorAll("[data-saat]");
  function saat(){
    var s = new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" }).format(new Date());
    var h = +s.slice(0, 2);
    saatEl.forEach(function(e){
      var not = e.getAttribute("data-dil") === "en"
        ? (h < 6 ? "Open all night" : h >= 21 ? "Open tonight" : "Open now") + " · Kars " + s
        : (h < 6 ? "Gece de açığız" : h >= 21 ? "Akşam da açığız" : "Şu an açık") + " · " + s;
      e.textContent = not;
    });
  }
  if (saatEl.length) { saat(); setInterval(saat, 30000); }

  // Transfer planlayıcı: formu WhatsApp mesajına çevirir, hiçbir yere göndermez
  var form = document.querySelector("[data-planla]");
  if (form) {
    var dilEn = form.getAttribute("data-dil") === "en";
    var tarih = form.elements.tarih;
    var bugun = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    tarih.min = bugun;
    var hata = form.querySelector("[data-hata]");

    form.querySelector("[data-degistir]").addEventListener("click", function(){
      var a = form.elements.nereden, b = form.elements.nereye, t = a.value;
      a.value = b.value; b.value = t;
    });

    // Haritadaki nokta veya hizmet kartına tıklanınca "Nereye" alanını doldur
    document.addEventListener("click", function(e){
      var y = e.target.closest && e.target.closest("[data-yer]");
      if (!y || !y.getAttribute("data-yer")) return;
      form.elements.nereye.value = y.getAttribute("data-yer");
      if (!form.elements.nereden.value) form.elements.nereden.value = dilEn ? "Kars city centre" : "Kars merkez";
    });

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var nereden = form.elements.nereden.value.trim(), nereye = form.elements.nereye.value.trim();
      form.elements.nereden.setAttribute("aria-invalid", !nereden);
      form.elements.nereye.setAttribute("aria-invalid", !nereye);
      hata.hidden = !!(nereden && nereye);
      if (!nereden || !nereye) { (nereden ? form.elements.nereye : form.elements.nereden).focus(); return; }

      var t = tarih.value ? tarih.value.split("-").reverse().join(".") : "";
      var saatV = form.elements.saat.value;
      var kisi = (form.querySelector("input[name=kisi]:checked") || {}).value || "1";
      var not = form.elements.not.value.trim();
      var satirlar = dilEn
        ? ["Hello, I'd like to book a taxi.", "From: " + nereden, "To: " + nereye, (t || saatV) && "Date/time: " + [t, saatV].filter(Boolean).join(" "), "Passengers: " + kisi, not && "Note: " + not]
        : ["Merhaba, transfer ayırtmak istiyorum.", "Nereden: " + nereden, "Nereye: " + nereye, (t || saatV) && "Tarih/saat: " + [t, saatV].filter(Boolean).join(" "), "Kişi: " + kisi, not && "Not: " + not];
      var metin = satirlar.filter(Boolean).join("\n");
      if (typeof window.gtag === "function") {
        gtag("event", "transfer_planla", { nereye: nereye });
        var hedef = window.__donusum && window.__donusum.whatsapp;
        if (hedef) gtag("event", "conversion", { send_to: hedef });
      }
      window.open("https://wa.me/" + form.getAttribute("data-wa") + "?text=" + encodeURIComponent(metin), "_blank", "noopener");
    });
  }

  // Hareket azaltma tercihinde SVG animasyonlarını durdur
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) document.querySelectorAll("svg").forEach(function(s){ s.pauseAnimations && s.pauseAnimations(); });

  // Harita yalnızca istenince yüklenir (sayfa hızı için)
  var h = document.querySelector("[data-harita]");
  if (h) h.querySelector("button").addEventListener("click", function(){
    var f = document.createElement("iframe");
    f.src = h.getAttribute("data-harita");
    f.title = "Durak konumu haritası";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    h.replaceChildren(f);
  });
})();
