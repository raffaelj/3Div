<img alt="3Div-Logo" src="img/3div_logo_100.png" style="float:right;margin:0px 0px 10px 10px" />

## 3Div - Hilfeseite

Mit der Taste <kbd>H</kbd> oder mit einem Klick auf das Fragezeichen oben rechts im Browserfenster kannst du diese Hilfeseite immer wieder aufrufen.

## Anleitung

- [Installation siehe unten](#installation)
- neue Objekte können über das Formularfeld eingefügt werden
- mit der Maus können die Objekte bewegt werden

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

### Bekannte Fehler
- Wenn das Raster ausgeblendet ist, lassen sich die Objekte nicht mehr mit dem Lasso auswählen und beim Verschieben mit der Maus werden die Blöcke an den oberen Rand verschoben --> html, body und main haben keine Höhe, weshalb sich die Berechnung der Position des Elements auf nichts bezieht.
- Zu viele Objekte auf einmal zu verschieben oder auch das 3D-Rendering in der 3D-Ansicht zwingen ältere Computer schonmal in die Knie und wenn es doof läuft, stürzt der Browser ab.
  - --> regelmäßig zwischenspeichern!
  - --> parallel javascriptlastige Browserspiele im nächsten Tab spielen zu müssen erhöht das Risiko, dass der Browser überlastet ist. 

## Installation

- Für die 3D-Ansicht wird zunächst der Browser [Firefox](https://www.mozilla.org/de/firefox/new/) benötigt. Seit der Version 47 ist die integrierte 3D-Darstellung leider abgeschafft worden.
- Entweder lädst du dir eine alte Version des [Firefox Portable 46](https://sourceforge.net/projects/portableapps/files/Mozilla%20Firefox%2C%20Portable%20Ed./Mozilla%20Firefox%2C%20Portable%20Edition%2046.0.1/FirefoxPortable_46.0.1_German.paf.exe/download) herunter oder du
- installierst als nächstes das Addon [Tilt 3D](https://addons.mozilla.org/de/firefox/addon/tilt/).
- Nach der Installation kannst über die Navigation "Extras" --> "Web-Entwickler" --> "Tilt" die 3D-Ansicht aktivieren.
- Leider hat das Addon einen Fehler, weshalb das Tastaturkürzel nicht funktioniert. Um dies zu ändern muss zunächst das Add-on [Menu Wizard](https://addons.mozilla.org/de/firefox/addon/s3menu-wizard/) installiert werden. Dort kannst du dann den neuen Shortcut, z. B. <kbd>Strg</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>M</kbd> erstellen. Anschließend lässt sich Tilt auch mit dem Kürzel starten.



Autor des 3Div-Scripts: [Raffael Jesche](http://www.raffael.one)
Quellcode: [3Div](https://github.com/raffaelj/3div) - [Fork me on Github](https://github.com/raffaelj/3div)

[Impressum](http://www.raffael.one/impressum) [Datenschutz](http://www.raffael.one/datenschutz)