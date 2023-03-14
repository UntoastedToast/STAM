<?php

// Read the JSON file and decode it into a PHP object
$json = file_get_contents('data/Grafittis.json');
$obj = json_decode($json, true);

// Check if the "graffiti" array exists and is not null
if (isset($obj['graffiti']) && $obj['graffiti'] !== null) {
  // Filter out null values from the "graffiti" array
  $obj['graffiti'] = array_filter($obj['graffiti'], function($val) {
    return $val !== null;
  });

  // Reindex the "graffiti" array with numeric keys starting from 0
  $obj['graffiti'] = array_values($obj['graffiti']);

  // Encode the updated object back into JSON
  $json = json_encode($obj);

  // Write the updated JSON back to the file
  file_put_contents('data/Grafittis.json', $json);

  // Send a success response
  echo json_encode(array('success' => true));
} else {
  // Send an error response
  echo json_encode(array('success' => false, 'error' => 'Failed to read JSON file or "graffiti" array is missing'));
}

?>