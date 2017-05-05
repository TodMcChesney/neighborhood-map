
// This function initializes the map
// It is called via the google maps api script tag in the html
function initMap() {
    'use strict';

    var map;

    // Constructor to create a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 35.5951,
            lng: -82.5515
        },
        zoom: 12
    });
}
