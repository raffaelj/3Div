// 3Div
//
// Ein 2D-Editor um 3D-HTML-Seiten zu erstellen, die mit der 3D-Untersuchung 
// des beliebten Browsers Firefox sichtbar werden
//
// Autor: Raffael Jesche
// Lizenz: keine Ahnung, Open Source, kommt noch
// Version: ? irgendwas weit unter 1, vlt. 0.2.1alpha oder so...
// mehr Infos folgen auch noch
// 
// Das ist mein erstes Javascript-Projekt und ich lerne noch. Daher sieht der 
// Code an einigen Stellen sicherlich amüsant aus...
//
// Außerdem ist es mein erstes Open-Source-Projekt, weshalb ich mich erstmal 
// schlau machen muss, wie denn der gute Stil unter Entwicklern aussieht, was 
// Kommentare, Lizenzierung, Versionierung etc. aussieht. Bisher habe ich nur 
// für eigene Zwecke mit mal schnell dahingeschriebenem oder -kopiertem Code
// gearbeitet.
// 
// Das Script ist noch nicht für den Live-Einsatz geeignet, da nur eine schwache
// Überprüfung von Benutzereingaben stattfindet und noch ein Login-System 
// hinzukommen soll.

// Warnung beim Schließen der Seite
window.onbeforeunload = function() {
    return 'Hast du auch alles abgespeichert?';
}

// Query-String auslesen
// Quelle: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function create3Div(){
	var d = document;
	//Zeichenfläche erstellen
	var artboard = d.createElement("main");
	artboard.dataset.ddiv_layer = "1";
	artboard.dataset.ddiv_artboard = "artboard";
	d.body.appendChild(artboard);
	
	// Sidebar mit Formular importieren
	// var sidebar = d.createElement("aside");
	// sidebar.id = "ddiv_sidebar";
	// d.body.appendChild(sidebar);
	// add3DivForm("ddiv_sidebar");
	
	// Overlay erstellen
	var overlay = d.createElement("aside");
	overlay.id = "ddiv_overlay";
	d.body.appendChild(overlay);
	overlay = d.getElementById("ddiv_overlay");
	
	var iconSidebar = d.createElement("span");
	iconSidebar.id = "ddiv_icon_hide";
	iconSidebar.classList.add("ddiv_icon_hide");
	iconSidebar.title = "Seitenleiste aus-/einblenden";
	iconSidebar.innerHTML = "&nbsp;";
	overlay.appendChild(iconSidebar);
	
	var iconHelp = d.createElement("span");
	iconHelp.id = "ddiv_icon_help";
	iconHelp.classList.add("ddiv_icon_help");
	iconHelp.title = "Hilfe aus-/einblenden";
	iconHelp.innerHTML = "&nbsp;";
	overlay.appendChild(iconHelp);
	
	var iconGrid = d.createElement("span");
	iconGrid.id = "ddiv_icon_grid";
	iconGrid.classList.add("ddiv_icon_grid");
	iconGrid.title = "Rasteransicht aus-/einblenden - verschieben von Objekten mit der Maus ist dann nicht mehr möglich";
	iconGrid.innerHTML = "&nbsp;";
	overlay.appendChild(iconGrid);
	
	// helpContainer
	var helpContainer = d.createElement("div");
	helpContainer.id = "ddiv_help_container";
	overlay.appendChild(helpContainer);
	
	var iconClose = d.createElement("span");
	iconClose.id = "ddiv_icon_close";
	iconClose.classList.add("ddiv_icon_close");
	iconClose.title = "Hilfefenster schließen";
	iconClose.innerHTML = "&nbsp;";
	
	var helpContent = d.createElement("div");
	helpContent.id = "ddiv_help_content";
	
	helpContainer = d.getElementById("ddiv_help_container");
	// console.log(helpContainer);
	helpContainer.appendChild(iconClose);
	helpContainer.appendChild(helpContent);
	
	// Query-Sting lesen, um verlinkten Entwurf zu laden
	// wenn kein Entwurf verlinkt, wird "demo" geladen
	var file = getQueryVariable("file");
	if (file == false){
		document.getElementById("ddiv_form_sketch_name").value = "demo";
	}
	else {
		document.getElementById("ddiv_form_sketch_name").value = file;
	}
	
	// Datei beim Start laden
	phpToNodeList();
	
	// Hilfe einmalig beim Start laden
	txtRequestToHelp("docs/manual.md");
}

create3Div();

// beim lokalen Entwickeln
if (document.location.hostname == "localhost") {
	hideHelp();// Hilfe beim Start ausblenden
	window.onbeforeunload = null;// Warnung beim Seite schließen deaktivieren
}

// Zeichenfläche: <main>
var artboard = document.querySelector("[data-ddiv_artboard]");
// console.log(artboard);

// Node-Id-Nr. wird ab dem ersten Element vergeben und mit jedem neuen um 1
// hochgezählt
var ddivNodeId = 0;
var ddivGroupId = 0;

// Klassenname für selektierte Objekte
var selectClass = "ui-selected";

// Einstellungen für das Costum Grid (Raster) -> siehe jQuery-Drag-Funktion
var anRasterEinrasten = false;
var raster = [20,20];//Rasterbreite x: raster[0], Rasterhöhe y: raster[1] 

// Alle Blöcke (Nodes/Knoten) innerhalb der Zeichenfläche
function allNodes(){
	var nodes = artboard.children;
	console.log(nodes);
}


function eraseArtboard(){
	artboard.innerHTML = "";
	ddivNodeId = 0;
	console.log("Zeichenfläche geleert.");
}


// Laden / Speichern ///////////////////////////////////////////////////////////


function nodesToObj(){
	// relevante Infos abfragen
	// x left, y top, z layer, b width, h height, 
	// windungen, radius, n Blöcke auf Kreisachse
	// elem, farbe backgroundColor
	// gruppiert (Objekt-Id), Gruppen-Name (Objekt-Name)
	// inhalt Text
	// Id
	
	//nl is a NodeList
	var nl = artboard.querySelectorAll("[data-ddiv_id]");
	// var nl = artboard.querySelectorAll("*");
	// console.log("nl.length: " + nl.length);
	
	var obj = {
		"operation" : {
			"sketchName" : document.getElementById("ddiv_form_sketch_name").value,
			"interaction" : "save"
		},
		"message" : {},
		"nodes" : {}
	};
	for (var i = 0, ll = nl.length ; i != ll ; i++){
		var n = nl[i],
			x = n.offsetLeft,
			y = n.offsetTop,
			z = parseInt(n.parentNode.dataset.ddiv_layer),
			b = n.offsetWidth,
			h = n.offsetHeight,
			elem = n.nodeName.toLowerCase(),
			color = n.style.backgroundColor,
			id = parseInt(n.dataset.ddiv_id),
			inner = n.innerHTML,
			groupId = parseInt(n.dataset.ddiv_groupid)
		;
		
		obj.nodes[i] = {
			"id": id,
			"elem": elem,
			"x": x,
			"y": y,
			"z": z,
			"b": b,
			"h": h,
			"color": color,
			"inner": inner
			};
		if (groupId){
			obj.nodes[i].groupid = groupId;
		}
	};
	// console.log(obj);
	return obj;
}

function createNodeFromTxt(data){
	// console.log('data["nodes"]:');
	// console.log(data["nodes"]);
	var groupIdsFromTxt = [];
	var nodes = data["nodes"];
	for (var key in nodes){
		// console.log("aktuelles Objekt:");
		// console.log(nodes[key]);
		var creationProps = {"layers" : 1}
		// if (nodes[key].groupid){
			// groupIdsFromTxt[key] = nodes[key].groupid;
		// }
		paintNewNode(nodes[key], creationProps);
	}
	// console.log(groupIdsFromTxt);
	// console.log(uniq_fast(groupIdsFromTxt));
	setNewGroupIds("set");
	// console.log("aktuelle ddivGroupId: " + ddivGroupId);
}

function setNewGroupIds(set){
	var groups = document.querySelectorAll('[data-ddiv_groupid]'),
		groupIds = [],
		allGroupIds = [];
	if (groups.length > 0){
		for (var i = groups.length-1; i>=0;i--){
			groupIds[i] = groups[i].dataset.ddiv_groupid;
			if (set == "set"){
				groups[i].dataset.ddiv_groupid = "temp" + groups[i].dataset.ddiv_groupid;
			}
		}
		allGroupIds = uniq_fast(groupIds);
		// console.log(allGroupIds);
	}
	
	if (set == "set"){
		// neue Ids beginnend bei 1 setzen
		ddivGroupId = 0;
		for (var i = 0; i < allGroupIds.length; i++){
			var nodes = document.querySelectorAll('[data-ddiv_groupid="temp'+allGroupIds[i]+'"]');
			// console.log(nodes);
			// console.log("allGroupIds[i]: " + allGroupIds[i]);
			ddivGroupId++;
			// console.log("ddivGroupId: " + ddivGroupId);
			// for (var ii = nodes.length-1 ; ii >= 0 ; ii--){
			for (var ii = 0 ; ii < nodes.length ; ii++){
				nodes[ii].dataset.ddiv_groupid = ddivGroupId;
			}
		}
		
		//ruft sich selbst nochmal mit get-Parameter auf
		setNewGroupIds("get");
	}
	
}

// Speichern
// Nodelist wird als JSON-String in sketchName.txt gespeichert
function nodeListToPhp(){
	var nl = nodesToObj(),
		data,
		url = 'schnittstelle.php';
	data = nl;
	// console.log("nl:");
	// console.log(nl);
	jsonRequest(url, data);
}

// Laden
function phpToNodeList(){
	var url = 'schnittstelle.php',
		obj = {
			"operation" : {
				"sketchName" : document.getElementById("ddiv_form_sketch_name").value,
				"interaction" : "load"
			},
			"massage" : {}
		}
	// console.log(obj);
	jsonRequest(url, obj);
}

function jsonRequest(url, obj){
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {// Success!
			
			var data = JSON.parse(request.responseText);
			console.log("empfange JSON-data");
			// console.log(data);
			if (obj.operation.interaction == "load"){
				eraseArtboard();
				createNodeFromTxt(data);
				
				// Objekt neu einlesen und selektierbar + verschiebbar machen
				makeDraggable();
				makeSelectable();
				makeClickable();
			}
			
			// Fehlermeldungen anzeigen
			if (data.message !== undefined){
				for (var key in data.message){
					console.log(data.message[key]);
				}
			}
		} else {
			console.log('We reached our target server, but it returned an error');
		}
	};
	request.onerror = function() {
		console.log("There was a connection error of some sort");
	};
	request.send(JSON.stringify(obj));
}



// Objekt-Funktionen ///////////////////////////////////////////////////////////

function clickInsertObject(){
	var nodeProps = {
		"elem" : document.forms["ddiv_form"]["elem"].value,
		"x" : parseInt(document.forms["ddiv_form"]["x"].value),
		"y" : parseInt(document.forms["ddiv_form"]["y"].value),
		"z" : parseInt(document.forms["ddiv_form"]["z"].value),
		"b" : parseInt(document.forms["ddiv_form"]["b"].value),
		"h" : parseInt(document.forms["ddiv_form"]["h"].value),
		"color" : document.forms["ddiv_form"]["color"].value,
		"inner" : document.forms["ddiv_form"]["ddiv_form_inner_html"].value,
		
		"radius" : parseInt(document.forms["ddiv_form"]["radius"].value),
		"steps" : parseInt(document.forms["ddiv_form"]["ddiv_form_steps"].value),
	}
	var creationProps = {
		"layers" : parseInt(document.forms["ddiv_form"]["layers"].value),
		"objectType" : document.forms["ddiv_form"]["object_type"].value
	}
	
	// Name
	// Windungen
	
	checkObjectTypeOfNewNode(creationProps, nodeProps);
}

function checkObjectTypeOfNewNode(creationProps, nodeProps){
	console.log("Objekttyp ist: " + creationProps.objectType);
	if (creationProps.objectType == "cuboid"){
		paintCuboid(nodeProps, creationProps);
	}
	if (creationProps.objectType == "circle"){
		paintCircle(nodeProps, creationProps);
	}
	
	// Objekt neu einlesen und selektierbar + verschiebbar machen
	makeDraggable();
	makeSelectable();
	makeClickable();
	refreshSelectData();
}

function paintCuboid(nodeProps, creationProps){
	if (creationProps.layers > 1){
		nodeProps.groupid = ++ddivGroupId;
	}
		for (var i = 0; i < creationProps.layers; i++){
			// checkIfLayerExists(nodeProps.z);
			// document.querySelector('[data-ddiv_layer="' + nodeProps.z + '"]').appendChild(createNewNode(nodeProps));
			paintNewNode(nodeProps, creationProps);
			// console.log("Quader auf Ebene " + nodeProps.z + " eingefügt");
			nodeProps.z++;
	}
}

function paintNewNode(nodeProps, creationProps){
	checkIfLayerExists(nodeProps.z);
	document.querySelector('[data-ddiv_layer="' + nodeProps.z + '"]').appendChild(createNewNode(nodeProps));
}

// Block aus Formulardaten erstellen
// benötigt Formulardaten
// gibt neues Element zurück
// Anwendung: elem.appendChild(createNewNode());
function createNewNode(nodeProps){
	var newNode = document.createElement(nodeProps.elem);
	newNode.className = "block";
	newNode.style.left = nodeProps.x + "px";
	newNode.style.top = nodeProps.y + "px";
	newNode.style.width = nodeProps.b + "px";
	newNode.style.height = nodeProps.h + "px";
	newNode.style.background = nodeProps.color;
	newNode.dataset.ddiv_id = ++ddivNodeId;
	if (nodeProps.groupid){
		// console.log(nodeProps.groupid);
		newNode.dataset.ddiv_groupid = nodeProps.groupid;
		// newNode.dataset.ddiv_groupid = ++ddivGroupId;
	}
	
	if (nodeProps.inner !== undefined ){
		newNode.innerHTML = nodeProps.inner;
	}
	
	return newNode;
}

// Prüfe, ob Ebene z existiert
// wenn nicht, wird Funktion zum Ebenen erstellen aufgerufen
function checkIfLayerExists(z){
	// var layer = document.getElementById("layer" + z);
	var layer = document.querySelector('[data-ddiv_layer="'+z+'"]');
	if (!layer){//Ebene existiert nicht
		createNewLayer(z);
	}
}

// neue Ebene erstellen
// wenn Ebene 1 (layer1) nicht existiert, wird diese auf
// Zeichenfläche (artboard) erstellt.
// Erstellt alle fehlenden Ebenen, bis aktuelle Ebene z erreicht ist.
function createNewLayer(z){
	if (z > 0 && !document.querySelector('[data-ddiv_layer="1"]')){
		var LayerOne = document.createElement("div");
		LayerOne.dataset.ddiv_layer = 1;
		artboard.appendChild(LayerOne);
		// console.log("Ebene 1 hinzugefügt");
	}
	if (z > 1) {
		var max = minMaxEbene("[data-ddiv_layer]");
		// if (max == null){max = 0;}
		// console.log("höchste Ebene: " + max);
		var i;
		for (i = max; i < z; i++){
			var newLayer = document.createElement("div");
			newLayer.dataset.ddiv_layer = (i + 1);
			// newLayer.id = "layer" + (i + 1);
			// document.getElementById("layer" + i).appendChild(newLayer);
			document.querySelector('[data-ddiv_layer="' + i + '"]').appendChild(newLayer);
			// console.log("Ebene " + (i + 1) + " hinzugefügt");
		}
	}
}

// höchste existierende Ebene herausfinden
// var max = minMaxEbene("[data-ddiv_layer]");
// Quelle: http://stackoverflow.com/a/14776074
function minMaxEbene(selektor) {
	var min=null, max=null;
	var layers = document.querySelectorAll(selektor),
	l = layers.length, i, current;
	for (i = 0; i < l; i++){
		current = layers[i];
		var id = parseInt(current.dataset.ddiv_layer, 10);
		if ((min===null) || (id < min)) { min = id; }
		if ((max===null) || (id > max)) { max = id; }
	}
	// return {min:min, max:max};
	return max;
}





// Funktionen für Ansicht (Raster etc.) ////////////////////////////////////////

// Raster ein-/ ausblenden
function toggleGrid(){
	// var main = document.getElementById("main");
	if (artboard.classList.contains("grid")){
		artboard.classList.remove("grid");
		artboard.style.height = null;
		// document.body.style.height = null;
	}
	else {
		artboard.classList.add("grid");
		artboard.style.height = viewport()["height"] + "px";
		// document.body.style.height = viewport()["height"] + "px";
	}
}

// Hilfsfunktionen /////////////////////////////////////////////////////////////

// Viewport auslesen
// Quelle: http://stackoverflow.com/a/11744120
// Anwendung:
// elem.style.height = viewport()["height"] + "px";
function viewport(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	return {width:x , height:y};
}

// PHP - array_unique
// Quelle: http://stackoverflow.com/a/9229821
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}


// Formularverhalten in Seitenleiste ///////////////////////////////////////////

// Fieldsets bei Klick ein-/ ausklappen
// funktioniert nur, wenn erstes Kindelement des Fieldsets <legend> ist.
var fieldsets = document.querySelectorAll("fieldset > legend");
Array.prototype.forEach.call(fieldsets, function(el, i){
	el.addEventListener('click', function(event){
		var children = el.parentNode.children;
		for (var i = 1; i < children.length; i++){
			if (children[i].style.display == ""){
				children[i].style.display = "none";
			} else {
				children[i].style.display = "";
			}
		}
	});
});

// Overlay-Klick-Icons /////////////////////////////////////////////////////////

// Seitenleiste ein-/ ausklappen
document.getElementById("ddiv_icon_hide").addEventListener('click', function(){
	var sidebar = document.querySelector("#ddiv_sidebar");
	sidebar.classList.toggle("ddiv_invisible");
});

// Raster ein-/ausblenden
document.getElementById("ddiv_icon_grid").addEventListener('click', toggleGrid);

// Hilfe ein-/ausblenden
document.getElementById("ddiv_icon_help").addEventListener('click', showHelp);
document.getElementById("ddiv_icon_close").addEventListener('click', showHelp);


// Buttons ---------------------------------------------------------------//////

// Default-Verhalten der Klick-Buttons deaktivieren
var buttons = document.body.getElementsByTagName("button");
for (var key in buttons){
	if (buttons.hasOwnProperty(key)){
		buttons[key].addEventListener('click', function(event){
			event.preventDefault();
		});
	}
}

// Button "Objekt einfügen" geklickt
document.getElementById("ddiv_form_add_object").addEventListener('click', clickInsertObject);

// Button Raster einblenden
// document.getElementById("ddiv_form_grid").addEventListener('click', toggleGrid);

// Button Laden
document.getElementById("ddiv_form_load_file").addEventListener('click', phpToNodeList);

// Button Speichern
document.getElementById("ddiv_form_safe_file").addEventListener('click', nodeListToPhp);




// jQuery-Kram --> selectable, draggable ///////////////////////////////////////
// soll noch gegen die notwendigen Funktionen ersetzt werden
// um nicht das komplette jQuery im Hintergrund laufen lassen zu müssen



function makeDraggable(){
	//Quelle: http://jsfiddle.net/6f9zW/86/ (Modifizierung von: http://words.transmote.com/wp/20130714/jqueryui-draggable-selectable/)
	// this creates the selected variable
	// we are going to store the selected objects in here
	var selected = $([]),
		offset = {top:0, left:0}; 
	
	$( "[data-ddiv_id]" ).draggable({
		// addClasses: false,
		// appendTo: "body",
		containment: "[data-ddiv_artboard]",//Objekt, welches gerade verschoben wird, lässt sich nicht über den Seitenrand verschieben
		// cursor: "move",
		// cursorAt: {bottom:0}
		// delay: 300,
		// disabled: true,
		// distance: 5,
		// grid: [50,50],//Raster [x,y], in welchen Pixel-Schritten verschoben werden kann
		// opacity: 0.4,
		// snap: true,// Default: false, an anderen Blöcken einrasten
		// snapMode: "both",// Default: "both" | "inner", "outer", "both"
		snapTolerance: 10,//default:20, wenn Objekt in die Nähe (z. B. 5px Abstand) verschoben wird, rastet es automatisch ein
		// console.log(rasterToleranz);
		start: function(ev, ui) {
			// console.log("start draggable");
			if ($(this).hasClass(selectClass)){
				selected = $(".ui-selected").each(function() {
				   var element = $(this);
				   element.data("offset", element.offset());
				});
			}
			else {
				selected = $([]);
				$("[data-ddiv_id]").removeClass(selectClass);//Selektion bei allen anderen löschen
				$(this).addClass(selectClass);//Selektion sichtbar machen
			}
			offset = $(this).offset();
		},//Ende start:function({})
		
		drag: function(ev, ui) {
			// console.log("dragging...");
			// console.log("ui");
			// console.log(ui);
			
			// Custom grid, Quelle: http://stackoverflow.com/a/20712561 , bzw: http://jsfiddle.net/8RnBf/38/
			if (anRasterEinrasten == true){
				var snapTolerance = $(this).draggable('option', 'snapTolerance');
				var topRemainder = ui.position.top % raster[1];
				// console.log(topRemainder);
				var leftRemainder = ui.position.left % raster[0];
				
				if (topRemainder <= snapTolerance) {
					ui.position.top = ui.position.top - topRemainder;
				}
				
				if (leftRemainder <= snapTolerance) {
					ui.position.left = ui.position.left - leftRemainder;
				}
			}// Ende costumGrid
			
			
			var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
			// take all the elements that are selected expect $("this"), which is the element being dragged and loop through each.
			selected.not(this).each(function() {
				 // create the variable for we don't need to keep calling $("this")
				 // element = current element we are on
				 // off = what position was this element at when it was selected, before drag
				 var element = $(this), off = element.data("offset");
				element.css({top: off.top + dt, left: off.left + dl});
			});
		}//Ende drag:function({})
	});//Ende $( "[data-ddiv_id]" ).draggable({})
	//Ende Quelle: http://jsfiddle.net/6f9zW/86/ (Modifizierung von: http://words.transmote.com/wp/20130714/jqueryui-draggable-selectable/)
}//Ende makeDraggable()

function makeSelectable(){
	$( "[data-ddiv_artboard]" ).selectable({
	// document.querySelector( "[data-ddiv_artboard]" ).selectable({
			filter:"[data-ddiv_id]",//Alle Elemente mit dem Data-Attribut "id" werden selektierbar
			cancel:"aside",//beim Klick auf aside wird nicht automatisch alles deselektiert
			appendTo:"[data-ddiv_artboard]",
			
			selecting: function(event, ui){
				// console.log("Lasso --> selektieren...");
				
				//Group-ID aus aktuellem Element setzen
				var groupId = ui.selecting.dataset.ddiv_groupid;
				
				if (event.shiftKey == true){//Shift-Taste gedrückt
					// if (groupId !== null){
					if (groupId !== 'undefined'){
						console.log("groupId: " + groupId);
						$("[data-ddiv_groupid=" + groupId + "]").addClass(selectClass);//alle Blöcke mit selber Gruppen-ID selektieren
					}
				}//Ende Shift-Taste gedrückt
			},//Ende selecting:function()
		});//Ende $( "[data-ddiv_artboard]" ).selectable({})
}


function makeClickable(){
	var selected;
	var groupId,
		grouped;
	var nodes = document.querySelectorAll("[data-ddiv_id]");
	console.log("Anzahl Nodes: " + nodes.length);
	// for (var key = 0; key < nodes.length; key++){
	for (var key = nodes.length-1; key >= 0; key--){
		nodes[key].addEventListener('click', function(event){
			var that = this;
			// console.log(that);
			
			if (that.dataset.ddiv_groupid !== undefined){
				groupId = that.dataset.ddiv_groupid;
				// console.log("groupId: " + groupId);
			}
			
			console.log("geklickt, ID: " + that.dataset.ddiv_id);
				
			//Shift-Taste gedrückt --> gesamtes Objekt selektieren
			if (event.shiftKey == true){
				if (groupId !== undefined){
					console.log("Shift + Klick, Group-ID: " + groupId);
					
					//alle Blöcke mit selber Gruppen-ID selektieren
					grouped = document.querySelectorAll('[data-ddiv_groupid="' + groupId + '"]');
					
					if (that.classList.contains(selectClass)){
						for (var i = 0; i < grouped.length; i++){
							// console.log(grouped[i]);
							grouped[i].classList.remove(selectClass);
						}
					}
					else {
						for (var i = 0; i < grouped.length; i++){
							// console.log(grouped[i]);
							grouped[i].classList.add(selectClass);
						}
					}
					
				}
			}
				
			// Strg + Klick
			else if (event.ctrlKey == true){
				
				//ist bereits selektiert --> Selektion löschen
				if (that.classList.contains(selectClass)) {
					console.log("Strg + Klick (bereits selektiert):")
					that.classList.remove(selectClass);
				}
				
				//ist noch nicht selektiert --> Selektions-Klasse hinzu
				else {
					console.log("Strg + Klick (wird selektiert):")
					that.classList.add(selectClass);
				}
			}
			
			// nur Klick
			else {
				console.log("Klick (zum selektieren, alle anderen deselektieren):")
				
				//alle anderen deselektieren
				selected = document.getElementsByClassName(selectClass);
				console.log("Anzahl selektierte Nodes vor Klick: " + selected.length);
				// for (var i = 0; i < selected.length; i++){
				for (var i = selected.length -1; i >= 0; i--){
					selected[i].classList.remove(selectClass);
				}
				
				//Selektions-Klasse hinzufügen
				that.classList.add(selectClass);
				console.log("Anzahl selektierte Nodes nach Klick: " + selected.length);			
			}
			
			selected = undefined;
			groupId = undefined;
			
			refreshSelectData();
			// $("[data-ddiv_artboard]").data(selectClass).refresh();
			// $("[data-ddiv_artboard]").data(selectClass)._mouseStop(null);
		});
	}
}// Ende makeClickable

function refreshSelectData(){
	var data = document.querySelectorAll(selectClass);
	for (var i = data.length-1; i >= 0; i--){
		data[i].refresh();
		data[i]._mouseStop(null);
	}
}
		
$(document).ready(function(){
	makeDraggable();
	makeSelectable();
	makeClickable();
	toggleGrid();
});



// weitere Bearbeitungsfunktionen //////////////////////////////////////////////

// Tastatureingaben lesen
document.addEventListener('keydown', keyPressed);
function keyPressed(event){
	event = event || window.event;
	var key = event.keyCode;
	// console.log("Tasten-Nummer: " + key);
	
	// Tasten-Events nicht in Formularfeldern ausführen
	if (event.target.nodeName != 'INPUT'){
		
		// Nodes löschen:
		if (key == 46) deleteSelectedNodes();//  46 = Entf
		
		// Artboard löschen / Neuer Entwurf
		if (key == 78) eraseArtboard();//  78 = n (new)
			
		// Laden
		if (key == 76) phpToNodeList();// 76 = l (load)
		// Speichern
		if (key == 83) nodeListToPhp();// 83 = s (save)
		
		// Raster ein-/ausblenden
		// if (key == 71) toggleGrid();// 71 = g (grid)
		
		// Gruppieren
		if (key == 71) groupNodes();// 71 = g (group)
		
		// Hilfe einblenden
		if (key == 72 ) showHelp();// 72 = h (help)
		if (key == 27) hideHelp();// 27 = Esc
		
		// auf z-Achse verschieben
		if (key == 85) switchLayer("up");// 85 = u --> up
		if (key == 68) switchLayer("down");// 68 = d --> down
		
		// auf x- u. y-Achsen verschieben
		if (key == 37) moveObject("left");// 37 = Pfeil links
		if (key == 39) moveObject("right");// 39 = Pfeil rechts
		if (key == 38) moveObject("top");// 38 = Pfeil hoch
		if (key == 40) moveObject("bottom");// 40 = Pfeil runter
	}
}



// Lösche alle selektierten Elemente

// Remove-Funktion erstellen
// Quelle: http://stackoverflow.com/a/18120786
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function deleteSelectedNodes(){
	var selected = document.getElementsByClassName(selectClass);
	console.log(selected.length + " Elemente wurden gelöscht.");
	selected.remove();
}



// Objekte auf z-Achse verschieben
function layerOf(id){
	var node = document.querySelector('[data-ddiv_id="'+id+'"]'),
		layer = node.parentNode;
		return layer;
}

function switchLayer(direction){
	var layer,
		z,
		layerUp,
		selected = document.getElementsByClassName(selectClass),
		id = [];
	
	for (var i=0; i < selected.length; i++){
		id[i] = selected[i].dataset.ddiv_id;
	}
	// console.log(id);
	for (var ii = 0; ii < id.length; ii++){
		
		layer = layerOf(id[ii]);
		z = parseInt(layer.dataset.ddiv_layer);
		
		//up
		if (direction == "up"){
			checkIfLayerExists(z+1);
			layerUp = document.querySelector('[data-ddiv_layer="'+(z+1)+'"]');
			selected = document.querySelector(['[data-ddiv_id="'+id[ii]+'"]']);
			layerUp.appendChild(selected);
			console.log("Objekt mit Id: " + id[ii] + " von Ebene " + z + " in " + (z+1) + " verschoben");
		}
		
		// down
		else if (direction == "down"){
			selected = document.querySelector(['[data-ddiv_id="'+id[ii]+'"]']);
			if (z > 1){
				layer.parentNode.appendChild(selected);
				console.log("Objekt mit Id: " + id[ii] + " von Ebene " + z + " in " + (z-1) + " verschoben");
			}
			else {
				console.log("Das Objekt mit Id: " + id[ii] + " ist schon auf Ebene 1 und kann nicht weiter runter.");
			}
		}
	}
}

// Objekte auf x- und y-Achsen bewegen
function moveObject(direction){
	var selected = document.getElementsByClassName(selectClass);
	
	for (var i=0;i<selected.length;i++){
		var x = selected[i].offsetLeft,
			y = selected[i].offsetTop;
			
		if (direction == "left") x--;
		if (direction == "right") x++;
		if (direction == "top") y--;
		if (direction == "bottom") y++;
		
		selected[i].style.left = x + "px";
		selected[i].style.top = y + "px";
	}
}


// Kreisfunktionen ///////////////////////////////////////////////////////////

function paintCircle(nodeProps, creationProps){
	var newNodes = {}
	var groupId = ++ddivGroupId;
	console.log("Kreisschichten: " + creationProps.layers);
	console.log("KreisSteps: " + nodeProps.steps);
	
	// Kreis-Startkoordinaten anpassen
	var startX = nodeProps.x + nodeProps.radius / 2 - nodeProps.b / 2,
		startY = nodeProps.y + nodeProps.radius / 2 - nodeProps.h / 2;
	
	// Anzahl Blöcke auf Kreisachse --> 0 = auto
	if (nodeProps.steps == 0){
		nodeProps.steps = Math.round((nodeProps.radius * 2 + nodeProps.b * 2) / nodeProps.b) * 2
	}
	
	// Kreiskoordinaten berechnen
	var centerCoords = circle(startX, startY, nodeProps.radius, nodeProps.steps);
	
	// Anzahl Ebenen --> Schlauch
	for (var i = 0; i < creationProps.layers; i++){
		// Prüfe, ob Ebene existiert
		checkIfLayerExists(nodeProps.z + i);
	
		// Blöcke einfügen
		for (var key in centerCoords){
			nodeProps.x = centerCoords[key].x;
			nodeProps.y = centerCoords[key].y;
			nodeProps.groupid = groupId;
			document.querySelector('[data-ddiv_layer="' + (nodeProps.z + i) + '"]').appendChild(createNewNode(nodeProps));
		}
		// nodeProps.z = nodeProps.z + i;
	}
	
}

function circle(centerX, centerY, radius, steps){
	var coords = {};
	
	for (var i = 0; i < steps; i++) {
		var phase = 2 * Math.PI * i / steps;
		coords[i] = {
			"x" : Math.round((centerX + radius * Math.cos(phase))),
			"y" : Math.round((centerY + radius * Math.sin(phase)))
		}
	}
	return coords;
}


// gruppieren
function groupNodes(){
	var selected = document.getElementsByClassName(selectClass);
	// var selected = document.querySelectorAll(selectClass);
	// console.log(selected.length);
	// console.log(selected);
	var groupId = ++ddivGroupId;
	for (var i = 0; i < selected.length; i++){
		selected[i].dataset.ddiv_groupid = groupId;
	}
	console.log("aktuelle ddivGroupId: " + ddivGroupId);
	
}

// Markdown implementieren
// Quelle: https://github.com/chjj/marked
// ./js/marked.min.js
// Verwendung: marked("Markdown-Text")
// Verwendung mit txtRequest:
// var file = "text_in_markdown.txt";
// txtRequestToHelp(file);
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  smartypants: false
});

// Hilfe einblenden
function showHelp(){
	document.getElementById("ddiv_help_container").classList.toggle("ddiv_invisible");
}
function hideHelp(){
	if (!document.getElementById("ddiv_help_container").classList.contains("ddiv_invisible")){
		document.getElementById("ddiv_help_container").classList.add("ddiv_invisible");
	}
}

function txtRequestToHelp(url){
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {// Success!
			
			var data = marked(request.responseText);
			console.log("empfange TXT-data");
			// console.log(data);
			document.getElementById("ddiv_help_content").innerHTML = data;
			
		} else {
			console.log('We reached our target server, but it returned an error');
		}
	};
	request.onerror = function() {
		console.log("There was a connection error of some sort");
	};
	request.send();
}
