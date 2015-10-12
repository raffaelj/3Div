<?php
// error_reporting("E_ALL");

$infoMessage = array();
$checkedOutput = new stdClass();

function checkUserInput($obj){
	// Dateiname bereinigen und gegen Path Traversel schützen
	// z. B. Dateiname "../readme"
	$fileName = $obj->operation->sketchName;
	$fileName = strip_tags($fileName);//Code entfernen
	$fileName = trim($fileName);//Leerzeichen am Anfang und Ende löschen
	$fileName = basename($fileName); // ../ löschen
	// Sonderzeichen ersetzen, die nicht in Dateinamen dürfen
	$fileName = preg_replace('/[^A-Za-z0-9 _ .-]/', '', $fileName);
	$fileName = strtolower($fileName);//alles klein schreiben
	
	$obj->operation->sketchName = $fileName;
	
	// Block-Inhalte auf Schadcode überprüfen
	if(isset($obj->nodes)){
		foreach($obj->nodes as &$node){
			foreach($node as &$property){
				$property = strip_tags($property);
				$property = htmlspecialchars($property);
				$property = htmlentities($property);
			}
		}
	}
	
	// geprüftes Objekt zurückgeben
	return $obj;
}

$allowedOperations = array(
	"load", // gespeicherten Entwurf laden
	"import", // gespeicherten Entwurf in aktuellen Entwurf importieren
	"save", // aktuellen Entwurf speichern
	"autosave", // aktuellen Entwurf zwischenspeichern
);

$dbPath = "db/";

// JSON-String in Objekt umwandeln
$input = json_decode(file_get_contents('php://input'));
$checkedInput = checkUserInput($input);

$operation = $checkedInput->operation;
$sketchName = $operation->sketchName;
$interaction = $operation->interaction;

// Die eigentlichen Aktionen finden jetzt statt
if (in_array($interaction, $allowedOperations)){
	
	if ($interaction == "save"){
		// JSON-String in Datei schreiben
		$file = $dbPath . $sketchName . '.txt';
		$fp = fopen($file, 'w');
		fwrite($fp, json_encode($checkedInput));
		fclose($fp);
		$infoMessage[] = "Der JSON-String wurde in die Datei ".$sketchName.".txt abgespeichert.";
	}
	if ($interaction == "autosave"){
		// JSON-String in Datei schreiben
		$file = $dbPath . $sketchName . '_autosave.txt';
		$fp = fopen($file, 'w');
		fwrite($fp, json_encode($checkedInput));
		fclose($fp);
		$infoMessage[] = "Info: Der JSON-String wurde in die Datei ".$sketchName."_autosave.txt zwischengespeichert.";
	}
	if ($interaction == "load"){

		$file = $dbPath . $sketchName . '.txt';
		
		if (is_file($file)){
			$output = json_decode(file_get_contents($file));
			
			// Hier sollte nochmal die Datei auf Fehler oder Code Injection
			// geprüft werden
			$checkedOutput = checkUserInput($output);
			$infoMessage[] = "Info: Die Datei wurde geladen.";
			// print_r(json_encode($obj, JSON_FORCE_OBJECT));
		}
		else {
			$infoMessage[] = "Fehler: Die Datei konnte nicht gefunden werden.";
		}
	}
	if ($interaction == "import"){
		$infoMessage[] = "Info: Die Importfunktion ist noch nicht verfügbar.";
	}
	
}
else {
	$infoMessage[] = "Fehler: Die Interaktion ist nicht erlaubt.";
}

// Fehlermeldung als JSON-String zurückgeben
if (!empty($infoMessage)){
	$checkedOutput->message = $infoMessage;
}

// Am Ende geben wir das formatierte JSON-Objekt wieder zurück an 3div.js
print_r(json_encode($checkedOutput, JSON_FORCE_OBJECT));
?>