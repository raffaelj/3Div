<?php
for ($i=1;$i<=400;$i++){
echo 'div[data-ddiv_layer="'.$i.'"] *{z-index:'.$i.';}'."\r\n";
}
?>