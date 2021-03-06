<?php
/**
 * User: shanky
 * Date: 2/3/19
 * Time: 1:17 PM
 */

header('Content-type: application/json');
$data = scandir('./data/bio_summary');
$keywords = explode(" ", $_GET["keywords"]);
$final_data = [];
function isUsed($sourceStr, $searchPat)
{
    if (preg_match("~\b$searchPat\b~", $sourceStr)) {
        return true;
    } else {
        return false;
    }
}

for ($i = 0; $i < sizeof($data); $i++) {
    if ($data[$i] != '.' && $data[$i] != '..') {
        $content = file_get_contents("./data/bio_summary/" . $data[$i]);
        for ($j = 0; $j < sizeof($keywords); $j++) {

            if ($keywords[$j] == '' || isUsed($content, $keywords[$j]) !== false) {
                array_push($final_data, [$data[$i], explode("\n\n", $content)]);
                break;
            }
        }
    }
}
echo json_encode($final_data);
?>