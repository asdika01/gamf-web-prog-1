<?php
@ini_set('output_buffering', 'off');
@ini_set('zlib.output_compression', false);

header("Access-Control-Allow-Origin: *");
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

$start = time();
$duration = 15;

echo "retry: 1000\n";
while (time() - $start < $duration) {
    echo "data: " . date('H:i:s') . "\n\n";
    ob_flush();
    flush();
    sleep(1);
}