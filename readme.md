3Div
====

Idee
----
3Div ist ein 2D-Editor für die 3D-Untersuchung von Firefox, bzw. das leider nicht mehr weiterentwickelte Firefox-Addon Tilt.

Die Idee dahinter ist, auf spielerische Weise Quellcodes zu erkunden und gleichzeitig 3D-Modelle zu erstellen. Das Script selbst dient dabei als Basis um in verschiedene Richtungen damit weiter arbeiten zu können, z. B.:

- Mozilla X-Ray-Goggles -> Inhalte der HTML-Elemente verändern
- Benutzung der Firefox-Entwickler-Tools
 - Inhalte und Styles bearbeiten
 - Javascript-Konsole
- Export für Blender
- animierte Gifs aus Screenshots der 3D-Animation erstellen

Die [Anleitung](docs/manual.md) ist in den Docs-Ordner verschoben.

### To Do
3Div ist mein erstes Javascript-Projekt, weshalb die Entwicklung nur langsam vorangeht und noch einige Fehler zu beheben, Sicherheitslücken zu schließen und Features hinzuzufügen sind.

- [ ] selektierte Elemente kopieren <kbd>Strg</kbd> + <kbd>C</kbd> und <kbd>Strg</kbd> + <kbd>V</kbd>
- [ ] Rückgängig <kbd>Strg</kbd> + <kbd>Z</kbd>
- [ ] Direkteingabe um Objekt zu ändern --> bis jetzt Firefox-Entwickler-Tools
- [ ] verwendete Farben speichern/auslesen und wiederverwenden --> bis jetzt Firefox-Entwickler-Tools-ColorPicker + externe Hex2Dec-Umrechnung
- [ ] Autosave
- [ ] Präsentations-Galerie --> angefangen auf http://raffaelj.github.io
- [x] grobe Dokumentation
- [ ] ausführliche Dokumentation
- [ ] Option: Bilder einfügen
- [ ] Option: Text einfügen --> bis jetzt umständlich über FF-Entwickler-Tools (kopierten Text als Kindelement einfügen)
- [ ] Nutzerverwaltung
- [x] Objekt löschen
- [x] Kreisfunktion
- [ ] Wendelfunktion
- [ ] Kugelfunktion
- [x] resizable --> Developer-Tools
- [x] Quellcode serverseitig ausgeben, sodass er mit <kbd>Strg</kbd>+<kbd>U</kbd> sichtbar ist --> Reload nötig
- [x] Tastaturkürzel
- [ ] benutzerdefiniertes CSS hinzufügen
- [ ] Node-Reihenfolge ändern --> "oben"/Überlagerung auf selber Ebene
- [ ] Layer-Ebene am Ende --> "oben"/Überlagerung auf verschiedenen Ebenen
- [x] Autoload Demo-Datei
- [x] Warnung beim Verlassen der seite
- [ ] Raster-Icon als reines CSS-Icon --> momentan noch in 3D-Ansicht sichtbar
- [ ] Formular in Javascript auslagern
- [ ] jQuery gegen reines Javascript ersetzen
- [x] auf Github veröffentlichen
- [ ] Lizenz --> auf jeden Fall Open Source und freie Nutzung, aber welche der zig möglichen Lizenzen...?
- [ ] Modul: Gif-Animationen erstellen
- [ ] Modul: Basics HTML und CSS
- [ ] Impressum
- [ ] Datenschutz-Hinweise
- [ ] Hausordnung -> nichts illegales veröffentlichen, kein Mobbing etc.

Autor des 3Div-Scripts: Raffael Jesche
Quellcode: [3Div](https://github.com/raffaelj/3div) - [Fork me on Github](https://github.com/raffaelj/3div)
