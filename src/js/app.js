/* exported initMap, errorMap */

// Global variables
var map;

// Locations data model
var model = [
    {
        title: 'Sierra Nevada Brewery',
        location: {
            lat: 35.430382,
            lng: -82.548919
        }
    },
    {
        title: 'New Belgium Brewery',
        location: {
            lat: 35.586875,
            lng: -82.572707
        }
    },
    {
        title: 'Wicked Weed Brewing Pub',
        location: {
            lat: 35.591683,
            lng: -82.551126
        }
    },
    {
        title: 'Burial Beer Company',
        location: {
            lat: 35.588049,
            lng: -82.553796
        }
    },
    {
        title: 'Green Man Brewery',
        location: {
            lat: 35.588720,
            lng: -82.553007
        }
    }
];

// Google Maps API script callback function that initializes the map
function initMap() {
    'use strict';

    // Constructor to create a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 35.5951,
            lng: -82.5515
        },
        zoom: 12
    });
}

// Google Maps API script error handler function
function errorMap() {
    'use strict';

    // Show alert box with error message if map doesn't load
    window.alert('Unfortunately Google Maps did not load correctly. Please try refreshing your browser!');
}
