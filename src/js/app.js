/* exported initMap, errorMap */

// Global variables
var map;
var breweryList = ko.observableArray([]);

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

// ViewModel
var ViewModel = function() {
    'use strict';

    var self = this;

    // Populate the infowindow for the marker that was clicked
    var populateInfoWindow = function(marker, infowindow) {

        // Check to make sure the infowindow is not already open on this marker
        if (infowindow.marker !== marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);

            // Clear the .marker property if the infowindow is closed
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    // Loop through data model to create list of breweries and map markers
    var position;
    var title;
    var marker;
    var largeInfowindow = new google.maps.InfoWindow();
    model.forEach(function(brewery, index) {
        position = brewery.location;
        title = brewery.title;
        marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: index
        });

        // Create click event listener to open infowindow for each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

        // Push marker to brewery list ko observableArray
        breweryList.push(marker);
    });

    // Create filter observable
    self.filter = ko.observable('');

    // Filter breweries using the input filter text
    this.filteredBreweryList = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        // Reset breweryList markers to visible and close infowindows
        breweryList().forEach(function(marker) {
            marker.setVisible(true);
            largeInfowindow.close();
        });

        // Return entire list of breweries if there is no filter text
        if (!filter) {
            return breweryList();

        // Return only the breweries that match the filter text
        } else {
            return ko.utils.arrayFilter(breweryList(), function(brewery) {
                if (brewery.title.toLowerCase().indexOf(filter) !== -1) {
                    return true;
                } else {
                    brewery.setVisible(false);
                    return false;
                }
            });
        }
    }, this);

    // Extend the boundaries of the map for each marker and show it
    var bounds = new google.maps.LatLngBounds();
    this.filteredBreweryList().forEach(function(marker) {
        marker.setMap(map);
        bounds.extend(marker.position);
    });
    map.fitBounds(bounds);

    // Trigger the marker click event to open the breweries infowindow
    this.breweryNameClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
    };
};

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

    // Instantiate the ViewModel
    ko.applyBindings(new ViewModel());
}

// Google Maps API script error handler function
function errorMap() {
    'use strict';

    // Show alert box with error message if map doesn't load
    window.alert('Unfortunately Google Maps did not load correctly. Please try refreshing your browser!');
}
