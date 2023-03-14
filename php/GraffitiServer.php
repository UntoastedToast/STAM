<?php


if($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Read the existing JSON file and decode it into a PHP array
  $json_file = file_get_contents('../data/Grafittis.json');
  $data = json_decode($json_file, true);

  // Get the request payload and decode it into a PHP array
  $payload = file_get_contents('php://input');
  $new_object = json_decode($payload, true);

  // Add the new PHP array to the existing PHP array
  array_push($data['graffiti'], $new_object);

  // Encode the updated PHP array back into JSON
  $updated_json = json_encode($data);

  // Write the updated JSON back to the file
  file_put_contents('../data/Grafittis.json', $updated_json);

  // Send a success response
  http_response_code(200);
} else {
  // Send an error response
  http_response_code(400);
}


?>