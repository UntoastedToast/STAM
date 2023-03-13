<?php
    // Process the file upload
    $target_dir = "GraffitiBilder/";
    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["file"]["tmp_name"]);
        if($check !== false) {
            echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            echo "File is not an image.";
            $uploadOk = 0;
        }
    }

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo "". htmlspecialchars( basename( $_FILES["file"]["name"])). "";

            // Save the data to the database
            $lettering = $_POST['lettering'];
            // ...insert code to connect to the database and insert the data...

        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
?>