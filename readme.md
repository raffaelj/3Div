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

Anleitung
---------
- neue Objekte können über das Formularfeld eingefügt werden
- mit der Maus können die Objekte bewegt werden

ANLEITUNG FÜR 3D-ANSICHT FEHLT NOCH
Bis dahin Anleitung auf der [Mozilla-Hilfe-Seite](https://developer.mozilla.org/de/docs/Tools/3D_untersuchung)


### Tastaturkürzel:
<kbd>H</kbd> = help, Hilfe ein-/ausblenden

<kbd>Entf</kbd> = Entfernen, selektierte Objekte löschen
<kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd> = Pfeiltasten, selektierte Objekte auf x-, y-Achse verschieben
<kbd>U</kbd> <kbd>D</kbd> = up, down, Objekt auf z-Achse verschieben

<kbd>G</kbd> = group, selektierte Objekte gruppieren
<kbd>Strg</kbd> + Links-Klick = angeklicktes Element zur/von Selektion hinzufügen/entfernen
<kbd>Shift</kbd> + Klick = gesamte Gruppe des angeklickte Elements selektieren

<kbd>N</kbd> = new, alle Objekte löschen, neues Dokument beginnen
<kbd>L</kbd> = load, Dokument laden
<kbd>S</kbd> = save, Dokument speichern

### Bekannte Fehler
- Wenn das Raster ausgeblendet ist, lassen sich die Objekte nicht mehr mit dem Lasso auswählen und beim Verschieben mit der Maus werden die Blöcke an den oberen Rand verschoben --> html, body und main haben keine Höhe, weshalb sich die Berechnung der Position des Elements auf nichts bezieht.
- Zu viele Objekte auf einmal zu verschieben oder auch das 3D-Rendering in der 3D-Ansicht zwingen ältere Computer schonmal in die Knie und wenn es doof läuft, stürzt der Browser ab.
  - --> regelmäßig zwischenspeichern!
  - --> parallel javascriptlastige Browserspiele im nächsten Tab spielen zu müssen erhöht das Risiko, dass der Browser überlastet ist. 

### Farbschema
der 3D-Darstellung im Firefox-Inspektor (3D-/Seitenansicht)
#### bereits aktiviert
 - span - #67E46F - grün
 - div - #5DC8CD - türkis
 - a - #123EAB - dunkelblau
 - img - #FFB473 - orange
 - table - #FF0700 - rot
 - p - #888 - grau
 - ul - #4671D5 - mittel-dunkelblau
 
#### weitere
 - html - #FFF - grau
 - head/body - #E667AF - hellgrau
 - title - #CD0074 - magenta
 - script - #A64B00 - braun
 - style - #FF9640 - orange
 - tbody - dunkelgrau
 - th - dunkelgrau
 - tr - #FF4540 - helleres rot
 - td - #FF7673 - noch helleres rot
 - li - #6C8CD5 - hellblau
 - iframe - #85004B - dunkles lila
 - other s. u. - #666 - dunkelgrau
 - dl, dt, dd - dunkelgrau
 - ol - dunkelgrau
 - menu, dir - dunkelgrau
 - h1 - rosa
 - h2-h5 - Abstufungen rosa -> lila
 - h5 - lila
 - article, header, footer, aside - dunkelgrau
 - form - dunkelgrau
 - input, fieldset, label - dunkelgrau
 - sup, sub, abbr, cite, acronym, blockquote, code, address - dunkelgrau
 - strong - dunkelgrau

### To Do
3Div ist mein erstes Javascript-Projekt, weshalb die Entwicklung nur langsam vorangeht und noch einige Fehler zu beheben, Sicherheitslücken zu schließen und Features hinzuzufügen sind.
- [ ] selektierte Elemente kopieren
- [ ] Rückgängig
- [ ] Direkteingabe um Objekt zu ändern --> bis jetzt Firefox-Entwickler-Tools
- [ ] Autosave
- [ ] Präsentations-Galerie
- [ ] Dokumentation
- [ ] Option: Bilder einfügen
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
- [ ] auf Github veröffentlichen
- [ ] Lizenz --> auf jeden Fall Open Source, aber welche der zig möglichen Lizenzen...?