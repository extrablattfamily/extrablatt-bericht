
/* EXTRABLATT – Professionelle Fazit-Erweiterung */
(() => {
  "use strict";

  const STORAGE = "extrablatt-fazits-v2";
  const boxes = new Map();

  const bad = new Set([
    "Standard nicht eingehalten",
    "Beschädigt / kaputt",
    "Gerissen",
    "Nicht vorhanden",
    "Fehlt auf dem Buffet",
    "Nicht richtig präsentiert",
    "Falscher Artikel / falsches Geschirr",
    "Nicht sauber"
  ]);

  const value = el => String(el?.value || "").trim();
  const unique = arr => [...new Set(arr.filter(Boolean))];

  function collect(root) {
    const positive = [];
    const problems = [];
    const notes = [];

    root.querySelectorAll(".item").forEach(item => {
      if (item.matches(
        ".produkt-zeile, .bestell-eintrag, .massnahme-eintrag"
      )) return;

      const point = item.querySelector(".item-title")?.textContent?.trim();
      const status = item.querySelector("select")?.value;

      if (point && status === "Standard eingehalten") {
        positive.push(point);
      } else if (point && bad.has(status)) {
        problems.push(point + " – " + status);
      }
    });

    root.querySelectorAll('input[type="checkbox"]:checked')
      .forEach(cb => {
        if (cb.closest(".produkt-zeile")) return;
        positive.push(
          cb.dataset.label || cb.parentElement?.textContent?.trim()
        );
      });

    root.querySelectorAll(".produkt-zeile").forEach(item => {
      if (item.querySelector('input[type="checkbox"]')?.checked) {
        problems.push("Fehlender Artikel: " + item.dataset.artikel);
      }
    });

    root.querySelectorAll(".bestell-eintrag").forEach(item => {
      problems.push("Nachbestellung: " + item.dataset.artikel);
    });

    root.querySelectorAll("textarea").forEach(el => {
      if (el.classList.contains("generated-fazit")) return;
      if (el.closest(
        ".produkt-zeile, .bestell-eintrag, .massnahme-eintrag"
      )) return;

      if (value(el)) notes.push(value(el));
    });

    return {
      positive: unique(positive),
      problems: unique(problems),
      notes: unique(notes)
    };
  }

  function list(items, max = 8) {
    return items.slice(0, max).map(x => "„" + x + "“").join("; ");
  }

  function write(title, data) {
    const { positive, problems, notes } = data;

    if (!positive.length && !problems.length && !notes.length) {
      return "Für diesen Bereich liegen noch keine ausreichenden dokumentierten Beobachtungen vor. Eine abschließende Bewertung ist derzeit nicht möglich.";
    }

    const parts = [
      "Im Bereich " + title + " wurden die dokumentierten Kontrollpunkte und ergänzenden Beobachtungen ausgewertet. Die Bewertung berücksichtigt ausschließlich die tatsächlich erfassten Angaben."
    ];

    if (positive.length) {
      parts.push(
        "Positiv hervorzuheben sind folgende bestätigte Standards und Kontrollpunkte: " +
        list(positive) + "."
      );
    }

    if (problems.length) {
      parts.push(
        "Im Rahmen der Kontrolle wurden folgende Abweichungen beziehungsweise offene Bedarfe dokumentiert: " +
        list(problems) + "."
      );
    }

    if (notes.length) {
      parts.push(
        "Ergänzende Beobachtungen und Hinweise:\n" +
        notes.join("\n\n")
      );
    }

    if (problems.length) {
      parts.push(
        "Die festgestellten Punkte sollten mit den zuständigen Mitarbeitern beziehungsweise der Betriebsleitung besprochen werden. Erforderliche Maßnahmen sind entsprechend ihrer Dringlichkeit festzulegen und ihre Umsetzung ist nachzuverfolgen."
      );
    } else {
      parts.push(
        "Die dokumentierten positiven Ergebnisse sollten im laufenden Betrieb gesichert und regelmäßig überprüft werden. Nicht bewertete Kontrollpunkte gelten dabei nicht automatisch als geprüft."
      );
    }

    return parts.join("\n\n");
  }

  function save() {
    try {
      const data = {};
      boxes.forEach((textarea, key) => {
        data[key] = textarea.value;
      });
      localStorage.setItem(STORAGE, JSON.stringify(data));
    } catch (e) {
      console.warn("Fazit konnte nicht gespeichert werden.", e);
    }
  }

  function addFazit(parent, title, key) {
    const box = document.createElement("div");
    box.className = "fazit-generator";
    box.style.cssText =
      "border:1px solid #C8102E;border-radius:10px;" +
      "padding:14px;margin:18px 0;background:white;";

    const heading = document.createElement("h3");
    heading.textContent = "Professionelles Fazit – " + title;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "✦ Fazit erstellen / aktualisieren";

    const textarea = document.createElement("textarea");
    textarea.className = "generated-fazit";
    textarea.rows = 10;
    textarea.placeholder = "Hier erscheint das bearbeitbare Fazit.";

    button.addEventListener("click", () => {
      if (value(textarea) && !confirm(
        "Das vorhandene Fazit durch eine neue Auswertung ersetzen?"
      )) return;

      textarea.value = write(title, collect(parent));
      save();
    });

    textarea.addEventListener("input", save);

    box.append(heading, button, textarea);
    parent.appendChild(box);
    boxes.set(key, textarea);
  }

  // Fazit für jede Untergruppe und jeden Hauptbereich
  pages.slice(0, 12).forEach((page, index) => {
    const groups = [...page.querySelectorAll("details.group")];

    groups.forEach((group, groupIndex) => {
      if (group.querySelector(".report-notes")) return;

      const title = group.querySelector("summary")?.textContent?.trim();
      if (!title) return;

      addFazit(group, title, "group-" + index + "-" + groupIndex);
    });

    addFazit(page, categories[index][0], "section-" + index);
  });

  // Gesamtfazit
  const finalBox = document.createElement("div");
  finalBox.style.cssText =
    "border:2px solid #C8102E;border-radius:12px;" +
    "padding:16px;margin:20px 0;background:white;";

  const finalTitle = document.createElement("h3");
  finalTitle.textContent = "Ausführliches Gesamtfazit";

  const finalButton = document.createElement("button");
  finalButton.type = "button";
  finalButton.textContent = "✦ Gesamtfazit erstellen / aktualisieren";

  const finalText = document.createElement("textarea");
  finalText.className = "generated-fazit";
  finalText.rows = 18;
  finalText.placeholder = "Gesamtbewertung aller dokumentierten Bereiche";

  finalButton.addEventListener("click", () => {
    if (value(finalText) && !confirm(
      "Das bisherige Gesamtfazit ersetzen?"
    )) return;

    const parts = [];
    let positives = 0;
    let problems = 0;

    pages.slice(0, 12).forEach((page, index) => {
      const data = collect(page);

      if (!data.positive.length &&
          !data.problems.length &&
          !data.notes.length) return;

      positives += data.positive.length;
      problems += data.problems.length;

      parts.push(
        categories[index][0] + "\n" +
        write(categories[index][0], data)
      );
    });

    if (!parts.length) {
      finalText.value =
        "Es liegen noch keine dokumentierten Prüfergebnisse vor.";
      save();
      return;
    }

    const opening =
      "GESAMTFAZIT DES BETRIEBSBESUCHS\n\n" +
      "Die Gesamtbewertung basiert auf den im Rahmen des Betriebsbesuchs dokumentierten Beobachtungen, Kontrollpunkten und ergänzenden Bemerkungen. Nicht ausgefüllte Bereiche wurden nicht als geprüft bewertet.\n\n";

    const conclusion =
      "\n\nABSCHLIESSENDE BEWERTUNG UND EMPFEHLUNGEN\n\n" +
      (problems
        ? "Aus den dokumentierten Feststellungen ergibt sich Handlungsbedarf in den genannten Bereichen. Die erforderlichen Korrekturen sollten nach Dringlichkeit priorisiert, den zuständigen Personen zugeordnet und bei einer Nachkontrolle auf ihre Wirksamkeit überprüft werden."
        : "In den dokumentierten Bewertungen wurden keine ausdrücklich als Abweichung gekennzeichneten Kontrollpunkte erfasst. Dies ersetzt keine vollständige Prüfung der nicht bewerteten Bereiche.") +
      "\n\nDie Einhaltung der CE-Standards sollte durch regelmäßige Kontrollen, klare Verantwortlichkeiten und eine kontinuierliche Begleitung der Mitarbeiter nachhaltig sichergestellt werden.";

    finalText.value = opening + parts.join("\n\n") + conclusion;
    save();
  });

  finalText.addEventListener("input", save);
  finalBox.append(finalTitle, finalButton, finalText);
  pages[12].appendChild(finalBox);
  boxes.set("gesamt", finalText);

  // Gespeicherte Fazits laden
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    boxes.forEach((el, key) => {
      if (typeof saved[key] === "string") el.value = saved[key];
    });
  } catch (e) {
    console.warn("Fazits konnten nicht geladen werden.", e);
  }

  // Fazits zusätzlich in den PDF-Bericht übernehmen
  berichtErstellen.addEventListener("click", event => {
    event.stopImmediatePropagation();

    const outputs = [...boxes.values()];
    const originalValues = outputs.map(el => el.value);

    // Doppelte Aufnahme über die vorhandene Sammelfunktion vermeiden
    outputs.forEach(el => { el.value = ""; });

    try {
      erstelleBetriebsbericht();
    } finally {
      outputs.forEach((el, i) => {
        el.value = originalValues[i];
      });
    }

    const report = document.getElementById("report");
    const photoSection = [...report.querySelectorAll("h2")]
      .find(h => h.textContent === "Fotodokumentation")
      ?.closest("section");

    const extra = document.createElement("section");
    extra.className = "bericht-abschnitt";

    const heading = document.createElement("h2");
    heading.textContent = "Professionelle Abschnittsauswertungen";
    extra.appendChild(heading);

    boxes.forEach((el, key) => {
      if (key === "gesamt" || !value(el)) return;

      const title = document.createElement("h3");
      title.textContent =
        el.closest(".fazit-generator")
          ?.querySelector("h3")?.textContent ||
        "Abschnittsfazit";

      const text = document.createElement("p");
      text.textContent = el.value;
      extra.append(title, text);
    });

    if (extra.querySelector("p")) {
      report.insertBefore(extra, photoSection || null);
    }

    if (value(finalText)) {
      const section = document.createElement("section");
      section.className = "bericht-abschnitt";

      const title = document.createElement("h2");
      title.textContent = "Ausführliches Gesamtfazit";

      const text = document.createElement("p");
      text.textContent = finalText.value;

      section.append(title, text);
      report.insertBefore(section, photoSection || null);
    }
  }, true);

  // Auch die getrennt gespeicherten Fazits löschen
  datenLoeschen.addEventListener("click", () => {
    if (!localStorage.getItem("extrablatt-betriebsbericht")) {
      localStorage.removeItem(STORAGE);
    }
  });
})();
