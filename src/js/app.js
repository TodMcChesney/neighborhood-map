/* exported initMap, errorMap */

// Global variables
var map;
var placesList = ko.observableArray([]);

// Places data model
var model = [
    {
        title: 'Jet d\'Eau',
        location: {
            lat: 46.207389,
            lng: 6.155903
        }
    },
    {
        title: 'L\'horloge fleurie',
        location: {
            lat: 46.204192,
            lng: 6.150989
        }
    },
    {
        title: 'Brunswick Monument',
        location: {
            lat: 46.208445,
            lng: 6.148912
        }
    },
    {
        title: 'Bâtiment des Forces motrices',
        location: {
            lat: 46.204654,
            lng: 6.137087
        }
    },
    {
        title: 'St. Pierre Cathedral',
        location: {
            lat: 46.201127,
            lng: 6.148516
        }
    },
    {
        title: 'Musée d\'Art et d\'Histoire(Geneva)',
        location: {
            lat: 46.199304,
            lng: 6.151574
        }
    },
    {
        title: 'Musée d\'ethnographie de Genève',
        location: {
            lat: 46.197954,
            lng: 6.137029
        }
    },
    {
        title: 'Beth Yaakov Synagogue',
        location: {
            lat: 46.202830,
            lng: 6.141020
        }
    },
    {
        title: 'Basilica of Our Lady of Geneva',
        location: {
            lat: 46.208759,
            lng: 6.142055
        }
    },
    {
        title: 'Reformation Wall',
        location: {
            lat: 46.200272,
            lng: 6.145850
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

    // Loop through data model to create list of places and map markers
    var position;
    var title;
    var marker;
    var largeInfowindow = new google.maps.InfoWindow();
    model.forEach(function(place, index) {
        position = place.location;
        title = place.title;
        marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: index
        });

        // Add click event listener to open infowindow and bounce marker
        marker.addListener('click', function() {
            marker = this;
            populateInfoWindow(marker, largeInfowindow);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);
        });

        // Push marker to placesList ko observableArray
        placesList.push(marker);
    });

    // Trigger the marker click event when the place's name is clicked
    this.placeNameClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
    };

    // Create filter observable
    self.filter = ko.observable('');

    // Filter places using the input filter text
    this.filteredPlacesList = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        // Reset placesList markers to visible and close infowindows
        placesList().forEach(function(marker) {
            marker.setVisible(true);
            largeInfowindow.close();
        });

        // Return entire list of places if there is no filter text
        if (!filter) {
            return placesList();

        // Return only the places that match the filter text
        } else {
            return ko.utils.arrayFilter(placesList(), function(place) {
                if (place.title.toLowerCase().indexOf(filter) !== -1) {
                    return true;
                } else {
                    place.setVisible(false);
                    return false;
                }
            });
        }
    }, this);

    // Extend the boundaries of the map for each marker and show it
    var bounds = new google.maps.LatLngBounds();
    this.filteredPlacesList().forEach(function(marker) {
        marker.setMap(map);
        bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
};

// Google Maps API script callback function that initializes the map
function initMap() {
    'use strict';

    // Constructor to create a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 46.204391,
            lng: 6.143158
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
