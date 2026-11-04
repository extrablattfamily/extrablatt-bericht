
/* EXTRABLATT – Professionelle Textbausteine */
(() => {
  "use strict";

  const STORE = "extrablatt-textbausteine-v1";

  const templates = [
    ["Rezepturen", "Negativ", "Die Zubereitung entsprach nicht vollständig der vorgegebenen Rezeptur. Zutaten und Mengen sind im Extranet über das iPad zu überprüfen."],
    ["Rezepturen", "Positiv", "Die Rezeptur wurde korrekt umgesetzt. Zutaten, Mengen und Präsentation entsprachen den Vorgaben."],
    ["Rezepturen", "Maßnahme", "Die Mitarbeiter sind auf die verbindlichen Rezepturen und Mengenangaben im Extranet hinzuweisen."],

    ["Salat", "Negativ", "Der Salat wurde nicht entsprechend der vorgegebenen Rezeptur zubereitet. Die Mengenangaben müssen im Extranet kontrolliert werden."],
    ["Salat", "Positiv", "Der Salat wurde frisch und entsprechend der Rezeptur zubereitet und ansprechend präsentiert."],

    ["Bruschetta", "Negativ", "Die Bruschetta entsprach hinsichtlich Zubereitung oder Präsentation nicht vollständig dem vorgegebenen Standard."],
    ["Bruschetta", "Positiv", "Die Bruschetta wurde gemäß Rezeptur zubereitet und ansprechend angerichtet."],

    ["Burger", "Negativ", "Der Burger wurde nicht vollständig nach Rezeptur zubereitet. Aufbau, Zutaten und Präsentation sind zu überprüfen."],
    ["Burger", "Positiv", "Der Burger wurde korrekt zubereitet und entsprechend dem vorgegebenen Standard präsentiert."],

    ["Pommes", "Negativ", "Die Pommes frites wurden nicht mit der vorgesehenen Portionsschaufel portioniert. Eine einheitliche Portionsgröße ist sicherzustellen."],
    ["Pommes", "Positiv", "Die Pommes frites wurden mit der vorgesehenen Portionsschaufel gleichmäßig portioniert und in guter Qualität ausgegeben."],
    ["Pommes", "Maßnahme", "Für jede Portion ist die vorgesehene Portionsschaufel zu verwenden."],

    ["Pizza", "Negativ", "Die Pizza entsprach hinsichtlich Belag, Backergebnis oder Präsentation nicht vollständig den Vorgaben."],
    ["Pizza", "Positiv", "Die Pizza wurde nach Rezeptur belegt, gleichmäßig gebacken und ansprechend präsentiert."],
    ["Pizza", "Maßnahme", "Backtemperatur, Backzeit und Belag sind anhand der aktuellen Vorgaben zu überprüfen."],

    ["Buffet", "Negativ", "Das Buffet wurde nicht rechtzeitig nachgefüllt. Die Verfügbarkeit und Präsentation der Speisen müssen laufend kontrolliert werden."],
    ["Buffet", "Positiv", "Das Buffet war vollständig, sauber und ansprechend aufgebaut. Die Speisen wurden rechtzeitig nachgefüllt."],
    ["Buffet", "Maßnahme", "Die Zuständigkeiten für Buffetkontrolle und Nachfüllen sind klar festzulegen."],

    ["Hygiene", "Negativ", "Im kontrollierten Arbeitsbereich wurden Reinigungsmängel festgestellt. Die geltenden Hygiene- und Reinigungsstandards sind einzuhalten."],
    ["Hygiene", "Positiv", "Der kontrollierte Arbeitsbereich war sauber, ordentlich und gut organisiert."],
    ["Hygiene", "Maßnahme", "Der Reinigungsplan ist mit dem Team zu besprechen und seine Umsetzung regelmäßig zu kontrollieren."],

    ["Lager", "Negativ", "Die Lagerung und Kennzeichnung einzelner Produkte entsprach nicht vollständig den Vorgaben."],
    ["Lager", "Positiv", "Die Produkte waren übersichtlich, ordnungsgemäß und entsprechend den Vorgaben gelagert."],
    ["Lager", "Maßnahme", "Kennzeichnung, Datierung und Lagerordnung sind regelmäßig zu kontrollieren."],

    ["Mitarbeiter", "Negativ", "Die Kommunikation und Abstimmung zwischen den Mitarbeitern war teilweise unzureichend. Aufgaben und Zuständigkeiten müssen klarer verteilt werden."],
    ["Mitarbeiter", "Positiv", "Die Kommunikation und Zusammenarbeit zwischen den Mitarbeitern funktionierte sehr gut. Die Arbeitsabläufe waren gut aufeinander abgestimmt."],
    ["Mitarbeiter", "Maßnahme", "Kurze Teamabsprachen und eine eindeutige Aufgabenverteilung sollen die Zusammenarbeit verbessern."],

    ["Küche", "Negativ", "Die Arbeitsabläufe in der Küche waren nicht optimal aufeinander abgestimmt. Dadurch entstanden vermeidbare Verzögerungen."],
    ["Küche", "Positiv", "Die Küchenabläufe waren gut organisiert. Die Mitarbeiter arbeiteten strukturiert und unterstützten sich gegenseitig."],

    ["Geräte", "Negativ", "Das überprüfte Gerät wurde nicht entsprechend den vorgegebenen Einstellungen oder Arbeitsabläufen genutzt."],
    ["Geräte", "Positiv", "Die überprüften Geräte waren sauber und wurden entsprechend den geltenden Vorgaben verwendet."],
    ["Geräte", "Maßnahme", "Die Mitarbeiter sind erneut in die korrekte Bedienung und Reinigung der Geräte einzuweisen."],

    ["Service", "Negativ", "Die Abstimmung zwischen Service und Küche war nicht durchgehend ausreichend. Bestellungen und Rückmeldungen müssen klarer kommuniziert werden."],
    ["Service", "Positiv", "Die Zusammenarbeit zwischen Service und Küche verlief reibungslos und gut koordiniert."],

    ["Wirtschaftlichkeit", "Negativ", "Bei der Portionierung wurden Abweichungen festgestellt, die zu einem erhöhten Wareneinsatz führen können."],
    ["Wirtschaftlichkeit", "Positiv", "Die beobachteten Portionierungen entsprachen den Vorgaben und unterstützten einen kontrollierten Wareneinsatz."],
    ["Wirtschaftlichkeit", "Maßnahme", "Portionsgrößen und Rezepturmengen sind regelmäßig mit den Mitarbeitern zu kontrollieren."],

    ["Toiletten", "Negativ", "Im Sanitärbereich wurden Reinigungs- oder Ausstattungsmängel festgestellt."],
    ["Toiletten", "Positiv", "Der Sanitärbereich war sauber, gepflegt und vollständig ausgestattet."],

    ["Außenbereich", "Negativ", "Der Außenbereich entsprach hinsichtlich Sauberkeit oder Präsentation nicht vollständig den Erwartungen."],
    ["Außenbereich", "Positiv", "Der Außenbereich vermittelte einen gepflegten und einladenden ersten Eindruck."]
  ];

  const normalize = s =>
    String(s || "")
      .toLocaleLowerCase("de")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const safeLoad = () => {
    try {
      const v = JSON.parse(localStorage.getItem(STORE) || "[]");
      return Array.isArray(v)
        ? v.filter(x =>
            x &&
            typeof x.text === "string" &&
            typeof x.category === "string"
          )
        : [];
    } catch {
      return [];
    }
  };

  let own = safeLoad();

  const sections = [
    ...document.querySelectorAll(".fazit-generator")
  ];

  if (!sections.length) {
    console.warn(
      "Textbausteine: fazit.js muss vorher geladen werden."
    );
    return;
  }

  const categories = [
    ...new Set(templates.map(t => t[0]))
  ];

  const categoryFor = title => {
    const t = normalize(title);

    const matches = {
      Rezepturen: ["rezeptur", "spezial"],
      Salat: ["salat"],
      Bruschetta: ["bruschetta"],
      Burger: ["burger"],
      Pommes: ["pommes", "fritteuse"],
      Pizza: ["pizza"],
      Buffet: ["buffet", "fruhstuck"],
      Hygiene: ["hygiene", "reinigung", "sauberkeit", "haccp"],
      Lager: ["lager", "kuhl", "froster", "tk"],
      Mitarbeiter: ["mitarbeiter", "personal", "team", "kommunikation"],
      Küche: ["kuche", "zubereitung"],
      Geräte: ["gerat", "rational", "unox", "moretti", "technik"],
      Service: ["service", "gast", "bedienung"],
      Wirtschaftlichkeit: ["wirtschaft", "wareneinsatz", "personalkosten", "kennzahl"],
      Toiletten: ["toilette", "sanitar", "wc"],
      Außenbereich: ["außen", "aussen", "fassade", "eingang"]
    };

    return categories.filter(c =>
      matches[c]?.some(k => t.includes(normalize(k)))
    );
  };

  const style = document.createElement("style");

  style.textContent = `
    .tb-panel {
      margin-top:14px;
      border-top:1px solid #ddd;
      padding-top:12px;
      font:inherit;
    }
    .tb-panel summary {
      cursor:pointer;
      font-weight:700;
      color:#C8102E;
      padding:8px 0;
    }
    .tb-panel select,
    .tb-panel input,
    .tb-panel textarea {
      box-sizing:border-box;
      max-width:100%;
      width:100%;
      padding:10px;
      margin:5px 0;
      border:1px solid #bbb;
      border-radius:7px;
      font:inherit;
    }
    .tb-panel button {
      background:#C8102E;
      color:white;
      border:0;
      border-radius:7px;
      padding:10px 12px;
      margin:6px 5px 6px 0;
      font:inherit;
      cursor:pointer;
    }
    .tb-list {
      max-height:340px;
      overflow:auto;
    }
    .tb-entry {
      display:flex;
      gap:8px;
      align-items:flex-start;
      padding:9px 2px;
      border-bottom:1px solid #eee;
      font-size:14px;
    }
    .tb-entry input {
      width:auto;
      flex:none;
      margin-top:4px;
    }
    .tb-entry small {
      display:block;
      color:#666;
      margin-bottom:3px;
    }
    .tb-panel .tb-muted {
      color:#666;
      font-size:13px;
    }
    .generated-fazit {
      white-space:pre-wrap;
    }
  `;

  document.head.appendChild(style);

  sections.forEach(section => {
    const textarea = section.querySelector(
      "textarea.generated-fazit"
    );

    if (!textarea || section.querySelector(".tb-panel")) return;

    const heading =
      section.querySelector("h3")?.textContent || "";

    const matching = categoryFor(heading);

    const details = document.createElement("details");
    details.className = "tb-panel";

    const summary = document.createElement("summary");
    summary.textContent =
      "✦ Professionelle Textbausteine auswählen";

    const filter = document.createElement("select");
    const choices = ["Alle Bereiche", ...categories];

    choices.forEach(c => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      filter.appendChild(o);
    });

    if (matching.length) filter.value = matching[0];

    const type = document.createElement("select");

    ["Alle Bewertungen", "Positiv", "Negativ", "Maßnahme"]
      .forEach(c => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        type.appendChild(o);
      });

    const list = document.createElement("div");
    list.className = "tb-list";

    const note = document.createElement("p");
    note.className = "tb-muted";
    note.textContent =
      "Nur tatsächlich beobachtete Aussagen auswählen. Mehrfachauswahl möglich.";

    const render = () => {
      list.replaceChildren();

      const all = [
        ...templates.map(([category, tone, text]) => ({
          category,
          tone,
          text
        })),
        ...own
      ];

      all.filter(x =>
        (filter.value === "Alle Bereiche" ||
         x.category === filter.value) &&
        (type.value === "Alle Bewertungen" ||
         x.tone === type.value)
      ).forEach(x => {
        const label = document.createElement("label");
        label.className = "tb-entry";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = x.text;

        const wrap = document.createElement("span");
        const small = document.createElement("small");
        small.textContent = x.tone + " · " + x.category;

        const txt = document.createElement("span");
        txt.textContent = x.text;

        wrap.append(small, txt);
        label.append(cb, wrap);
        list.appendChild(label);
      });
    };

    filter.addEventListener("change", render);
    type.addEventListener("change", render);

    const insert = document.createElement("button");
    insert.type = "button";
    insert.textContent =
      "Ausgewählte Sätze ins Fazit übernehmen";

    insert.addEventListener("click", () => {
      const chosen = [
        ...list.querySelectorAll(
          'input[type="checkbox"]:checked'
        )
      ].map(c => c.value);

      if (!chosen.length) {
        alert("Bitte zuerst mindestens einen Satz auswählen.");
        return;
      }

      const existing = textarea.value.trim();

      const additions = [...new Set(chosen)]
        .filter(s => !existing.includes(s));

      if (!additions.length) {
        alert("Die ausgewählten Sätze stehen bereits im Fazit.");
        return;
      }

      textarea.value = [
        existing,
        additions.join("\n\n")
      ].filter(Boolean).join("\n\n");

      textarea.dispatchEvent(
        new Event("input", { bubbles: true })
      );

      list.querySelectorAll(
        'input[type="checkbox"]:checked'
      ).forEach(c => {
        c.checked = false;
      });
    });

    const ownTitle = document.createElement("strong");
    ownTitle.textContent = "Eigenen Textbaustein speichern";

    const custom = document.createElement("textarea");
    custom.rows = 3;
    custom.placeholder = "Eigene Formulierung …";

    const save = document.createElement("button");
    save.type = "button";
    save.textContent = "Eigenen Satz speichern";

    save.addEventListener("click", () => {
      const text = custom.value.trim();

      if (!text) {
        return alert("Bitte zuerst einen Satz eingeben.");
      }

      const category =
        filter.value === "Alle Bereiche"
          ? (matching[0] || "Rezepturen")
          : filter.value;

      const tone =
        type.value === "Alle Bewertungen"
          ? "Maßnahme"
          : type.value;

      if (own.some(x =>
        x.text === text && x.category === category
      )) {
        return alert("Dieser Satz ist bereits gespeichert.");
      }

      own.push({ category, tone, text });

      try {
        localStorage.setItem(STORE, JSON.stringify(own));
      } catch {
        own.pop();
        alert("Speichern auf diesem Gerät nicht möglich.");
        return;
      }

      custom.value = "";
      render();
    });

    details.append(
      summary,
      note,
      filter,
      type,
      list,
      insert,
      ownTitle,
      custom,
      save
    );

    section.appendChild(details);
    render();
  });
})();
