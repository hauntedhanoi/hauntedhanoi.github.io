/* Haunted Hanoi — language toggle, nav, reveal, analytics, registration form */
(function () {
  "use strict";
  var C = window.HH_CONFIG || {};
  var root = document.documentElement;

  /* ---------- Language ---------- */
  function setLang(l, save) {
    if (l !== "en" && l !== "vi") l = "en";
    root.lang = l;
    if (save) { try { localStorage.setItem("hh-lang", l); } catch (e) {} }
    var t = root.getAttribute("data-title-" + l);
    if (t) document.title = t;
    var d = root.getAttribute("data-desc-" + l);
    var m = document.querySelector('meta[name="description"]');
    if (d && m) m.setAttribute("content", d);
    document.querySelectorAll("[data-en][data-vi]").forEach(function (el) { el.textContent = el.getAttribute("data-" + l); });
    document.querySelectorAll("[data-ph-en]").forEach(function (el) { el.setAttribute("placeholder", el.getAttribute("data-ph-" + l)); });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === l)); });
  }
  setLang(root.lang, false);
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set"), true); });
  });

  /* ---------- Mobile nav ---------- */
  var mb = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if (mb && nav) {
    mb.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", String(o));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var rv = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && rv.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- Year ---------- */
  document.querySelectorAll(".yr").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Analytics (GoatCounter: no cookies, no personal data) ---------- */
  if (C.goatcounter) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + C.goatcounter + ".goatcounter.com/count");
    document.head.appendChild(s);
  }

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      var done = function () {
        var old = b.innerHTML;
        b.textContent = root.lang === "vi" ? "Đã sao chép" : "Copied";
        setTimeout(function () { b.innerHTML = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, function () {});
      else { var t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} document.body.removeChild(t); }
    });
  });

  /* ---------- Registration form ---------- */
  var form = document.getElementById("regForm");
  if (form) {
    var status = document.getElementById("formStatus");
    var card = document.getElementById("formCard");
    var done = document.getElementById("formDone");
    var btn = form.querySelector("button[type=submit]");
    var msg = function (en, vi, err) {
      status.className = "form-status" + (err ? " err" : "");
      status.textContent = root.lang === "vi" ? vi : en;
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      status.textContent = "";
      if (form.elements.company && form.elements.company.value) { showDone(); return; } /* honeypot */
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var g = function (n) { var el = form.elements[n]; return el ? (el.value || "").trim() : ""; };
      var contact = (form.querySelector("input[name=contactMethod]:checked") || {}).value || "";
      var data = {
        name: g("name"), email: g("email"), phone: g("phone"), instagram: g("instagram"),
        contactMethod: contact, groupSize: g("groupSize"), timeframe: g("timeframe"),
        language: g("language"), origin: g("origin"), interest: g("interest"), needs: g("needs"),
        heardFrom: g("heardFrom"),
        updates: form.elements.updates && form.elements.updates.checked ? "Yes" : "No",
        consent: "Yes", uiLang: root.lang
      };

      var F = C.form || {};
      if (F.action && F.fields) {
        var body = new URLSearchParams();
        Object.keys(data).forEach(function (k) { if (F.fields[k]) body.append(F.fields[k], data[k]); });
        btn.disabled = true;
        msg("Sending…", "Đang gửi…");
        fetch(F.action, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
          .then(showDone)
          .catch(function () {
            btn.disabled = false;
            msg("Something went wrong. Please email me directly at " + (C.email || "") + ".", "Có lỗi xảy ra. Bạn vui lòng email trực tiếp cho mình: " + (C.email || "") + ".", true);
          });
      } else {
        /* Fallback while the Google Form is not connected yet: open the visitor's email app */
        var lines = [
          "Name: " + data.name, "Email: " + data.email, "Phone / Zalo: " + data.phone, "Instagram: " + data.instagram,
          "Preferred contact: " + data.contactMethod, "Group size: " + data.groupSize, "Rough timing: " + data.timeframe,
          "Language: " + data.language, "From: " + data.origin, "", "What draws me to the walk:", data.interest, "",
          "Anything to know:", data.needs, "", "Heard about it via: " + data.heardFrom, "Updates: " + data.updates
        ];
        window.location.href = "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent("Haunted Hanoi — walk interest") + "&body=" + encodeURIComponent(lines.join("\n"));
        msg("Your email app should open with your details. Just press send.", "Ứng dụng email sẽ mở với thông tin của bạn. Bạn chỉ cần bấm gửi.");
      }
    });

    function showDone() {
      card.classList.add("sent");
      done.classList.add("show");
      done.setAttribute("tabindex", "-1");
      done.focus({ preventScroll: true });
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})();
