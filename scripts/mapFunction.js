
var isOpen = false;
var graffitiSammlung;
var markerGraffitiArray;
var newGraffiti;
var formData;

deleteTheNulls();
// GET DATA 
var requestGraffiti = new XMLHttpRequest();
requestGraffiti.open('GET', "data/Grafittis.json", true);

requestGraffiti.responseType = 'json';
requestGraffiti.send();

requestGraffiti.onload = function () {
    graffitiSammlung = requestGraffiti.response;
    printData(graffitiSammlung.graffiti);
}



// BASIC MAP
var map = L.map('map').setView([50.9413, 6.9558], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([50.9413, 6.9558]).addTo(map);



//create new Graffiti
function createNewGraffiti() {
    var form = document.getElementById("form");

    formData = new FormData(form);
    //get the Metat data from the file/Picture and the GPS
    ///////////////// LOG UND LAT VERTAUSCHEN//////////////////////////////
    var longitude = 0;
    var latitude = 0;
    var filename;

    var fileInput = document.getElementById("GraffitiPic");
    filename = fileInput.value.split("\\").pop();

    var reader = new FileReader();
    reader.readAsArrayBuffer(fileInput.files[0]); // read the file as an array buffer
    reader.onload = function (event) {

        var exif = EXIF.readFromBinaryFile(event.target.result); // parse the Exif metadata
        var lat = exif.GPSLatitude;
        var latRef = exif.GPSLatitudeRef;
        var lng = exif.GPSLongitude;
        var lngRef = exif.GPSLongitudeRef;
        // convert GPS coordinates to decimal format
        var latDecimal = lat[0] + lat[1] / 60 + lat[2] / 3600;
        if (latRef == "S") {
            latDecimal *= -1;
        }
        var lngDecimal = lng[0] + lng[1] / 60 + lng[2] / 3600;
        if (lngRef == "W") {
            lngDecimal *= -1;
        }
        console.log("latitude: " + lngDecimal);
        console.log("longitude: " + latDecimal);
        latitude = lngDecimal;
        longitude = latDecimal;

        var date = filename;
        var picturetaken = date.replace(/(\d{4})(\d{2})(\d{2})_.*/, '$1-$2-$3');

        // Get the data from the form
        var lettering = form.elements["lettering"].value;
        var artistCrew = form.elements["artist"].value;
        var yearofcreation = form.elements["year"].value;
        var motiv = form.elements["motiv"].value;
        var comment = form.elements["comment"].value;
        var style = form.elements["styleRadio"].value;


        // Create a new object
        newGraffiti = {
            picturepath: "GraffitiBilder/" + filename,
            lettering: lettering,
            artistCrew: artistCrew,
            dateofcreation: picturetaken,
            yearofcreation: yearofcreation,
            motiv: motiv,
            comment: comment,
            style: style,
            longitude: longitude,
            latitude: latitude,
        };

        addGrafittiToDatabase();

    };



}

// add a Grafitti
function addGrafittiToDatabase() {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Image uploaded successfully!");

            // Send an XHR request to the server to add the new object
            var xhr2 = new XMLHttpRequest();
            xhr2.open("POST", "php/GraffitiServer.php", false);
            xhr2.setRequestHeader("Content-Type", "application/json");
            xhr2.onreadystatechange = function () {
                if (xhr2.readyState === XMLHttpRequest.DONE) {
                    if (xhr2.status === 200) {
                        console.log("Graffiti added successfully");
                    } else {
                        console.error("Failed to add graffiti");
                    }
                }
            };
            xhr2.send(JSON.stringify(newGraffiti));
        }
    };
    console.log("hallo4");
    xhr.open("POST", "php/BildAbspeichern.php", false);
    console.log("hallo5");
    xhr.send(formData);

    document.getElementById("submitForm").remove();
    printData(graffitiSammlung.graffiti);


    location.reload();
}

function deleteTheNulls() {
    // Create a new XMLHttpRequest object
    var xhr3 = new XMLHttpRequest();
    // Set up the request method and URL
    xhr3.open('POST', 'php/removeTheNulls.php');

    // Set the content type of the request to JSON
    xhr3.setRequestHeader('Content-Type', 'application/json');

    // Define the request payload (if needed)
    var payload = JSON.stringify({});

    // Set up a callback function to handle the response
    xhr3.onreadystatechange = function () {
        if (xhr3.readyState === 4 && xhr3.status === 200) {
            var response = JSON.parse(xhr3.responseText);
            if (response.success) {
                console.log('JSON file updated successfully');
            } else {
                console.error('Failed to update JSON file:', response.error);
            }
        }
    };

    // Send the request with the payload (if needed)
    xhr3.send(payload);
}


/////////////////////////////////////////////////////////////////////////////

function printData(graffitiArray) {

    graffitiArray = graffitiArray.filter(element => element !== null);
    //DELET ALL Layer
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    //create a new one
    var graffitiLength = graffitiArray.length;
    var i;
    var markerGraffitiArray = [graffitiLength];
    for (i = 0; i < graffitiLength; i++) {

        markerGraffitiArray[i] = L.marker([graffitiArray[i].longitude, graffitiArray[i].latitude]).addTo(map);

        // Create a popup with the feature properties
        var popupContent = "";
        popupContent += "<img class = 'popupImg' src='" + graffitiArray[i].picturepath + "' alt='Image description'><br> ";
        popupContent += "Lettering: " + graffitiArray[i].lettering;
        popupContent += " Artist / Crew: " + graffitiArray[i].artistCrew + "<br>";
        popupContent += "Graffiti made in: " + graffitiArray[i].yearofcreation + "<br>";
        popupContent += "Picture taken on: " + graffitiArray[i].dateofcreation + "<br>";
        popupContent += "Motiv: " + graffitiArray[i].motiv + "<br>";
        popupContent += "Comment: " + graffitiArray[i].comment + "<br>";
        popupContent += "Style: " + graffitiArray[i].style + "<br>";
        markerGraffitiArray[i].bindPopup(popupContent);

    }

}
function addForm() {

    if (!isOpen) {
        isOpen = true;
        var div = document.createElement('div');
        div.id = "submitForm";
        div.innerHTML =
            "<form id='form' enctype='multipart/form-data' method='POST' action='php/GraffitiServer.php'><label for='file'>Upload Picture</label><input type='file' name='file' id='GraffitiPic'><br><br><label for='lettering'>Lettering</label><input type='text' name='lettering'><br><br><label for='artist'>Artist/Crew</label><input type='text' name='artist'><br><br><label for='year'>Made in the Year:</label><select id='year' name='year'><option value='unknown'>Unknown</option><option value=2013>2013</option><option value=2014>2014</option><option value=2015>2015</option><option value=2016>2016</option><option value=2017>2017</option><option value=2018>2018</option><option value=2019>2019</option><option value=2020>2020</option><option value=2021>2021</option><option value=2022>2022</option><option value=2023>2023</option></select><br><br><label for='motiv'>Motiv</label><input type='text' name='motiv'><br><br><label for='comment'>Comment</label><input type='text' name='comment'><br><br><div><h1>Style</h1><input type='radio' class='form-check-input' id='bubble' name='styleRadio' value='bubble'><label class='form-check-style' for='check1'>Bubble Style</label><input type='radio' class='form-check-input' id='throughup' name='styleRadio' value='throughup'><label class='form-check-style' for='check2'>Through Up</label><input type='radio' class='form-check-input' id='blockbuster' name='styleRadio' value='blockbuster'><label class='form-check-style' for='check3'>Blockbuster</label><input type='radio' class='form-check-input' id='character' name='styleRadio' value='character'><label class='form-check-style' for='check4'>Characters</label><input type='radio' class='form-check-input' id='bw' name='styleRadio' value='bw'><label class='form-check-style' for='check5'>black and white</label><input type='radio' class='form-check-input' id='freewall' name='styleRadio' value='freewall'><label class='form-check-style' for='check6'>Freewall</label><input type='radio' class='form-check-input' id='official' name='styleRadio' value='official'><label class='form-check-style' for='check7'>Official Contest</label><input type='radio' class='form-check-input' id='somethingelse' name='styleRadio' value='somethingelse' checked><label class='form-check-style' for='check8'>Something else</label></div> <div><h1>Rating</h1><p>Skala</p></div><button type='submit' id='submit' onclick='createNewGraffiti()'>Hinzufügen</button></form>"
            ;
        document.body.appendChild(div);
    } else {

        isOpen = false;
        document.getElementById("submitForm").remove();
    }
}

/*
<label for='year'>Made in the Year:</label><select id='year' name='year'><option value='unknown'>Unknown</option><!-- Loop through years from 1988 to 2023 --><?php for ($i = 1988; $i <= 2023; $i++) {echo '<option value=\'$i\'>$i</option>';}?></select>
<option value=2013'>2013</option><option value=2014'>2014</option><option value=2015'>2015</option><option value=2016'>2016</option><option value=2017'>2017</option><option value=2018'>2018</option><option value=2019'>2019</option><option value=2020'>2020</option><option value=2021'>2021</option><option value=2022'>2022</option><option value=2023'>2023</option>
*/

function uploadFile() {
    var form = document.forms[0];
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("File uploaded successfully!");
        }
    };

    xhr.open("POST", form.action, true);
    xhr.send(formData);
}

///////////////
function searchArtist() {
    var artist = document.getElementById('search').value;
    event.preventDefault();

    if (artist == null || artist == "") {

        printData(graffitiSammlung.graffiti);

    } else {
        var graffitiArray = graffitiSammlung.graffiti.filter(element => element !== null);
        var filteredGraffitiArray = graffitiArray.filter(obj => obj.artistCrew.toLowerCase() === artist.toLowerCase()
            || obj.lettering.toLowerCase() === artist.toLowerCase());
        printData(filteredGraffitiArray);

    }


}

