/* exported initMap, errorMap */

// Global map variable
var map;

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
        title: 'L\'horloge Fleurie',
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
        title: 'Bâtiment des Forces Motrices',
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
        title: 'Musée d\'Art et d\'Histoire (Geneva)',
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

        // If the infowindow is not already open on this marker open it
        if (infowindow.marker !== marker) {
            infowindow.marker = marker;
            infowindow.setContent('<h3>Loading please wait...</h3>');
            infowindow.open(map, marker);

            // Load Wikipedia data via AJAX and update infowindow content
            var wikiInfo;
            var wikiLink;
            var wikiUrl = 'https://en.wikipedia.org/w/api.php';
            var wikiRequestTimeout = setTimeout(function() {
                infowindow.setContent('<h3>' + marker.title + '</h3>' +
                '<p>Unfortunately more information on ' + marker.title +
                ' was unavailable from Wikipedia.</p>');
            }, 3000);
            $.ajax({
                url: wikiUrl,
                data: {
                    action: 'opensearch',
                    search: marker.title,
                    format: 'json'
                },
                dataType: 'jsonp',
                success: function(data) {
                    wikiInfo = data[2][0];
                        if (wikiInfo.length > 150) {
                            wikiInfo = wikiInfo.slice(0, 147) + '...';
                        }
                    wikiLink = data[3][0];
                    clearTimeout(wikiRequestTimeout);
                    infowindow.setContent('<h3>' + marker.title + '</h3>' +
                    '<p>' + wikiInfo + '</p>' + '<a href="' + wikiLink +
                    '" target="_blank" >Read more on Wikipedia</a>');
                }
            });

            // Clear the .marker property if the infowindow is closed
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    // Loop through data model to create list of places and map markers
    var placesList = ko.observableArray([]);
    var position;
    var title;
    var marker;
    var smallInfoWindow = new google.maps.InfoWindow({
        maxWidth: 160
    });
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
            map.setCenter(marker.getPosition());
            populateInfoWindow(marker, smallInfoWindow);
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
            smallInfoWindow.close();
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

    // Create showListView observable
    self.showListView = ko.observable(true);

    // Toggle showListView true/false function
    this.toggleListView = function() {
        self.showListView(!self.showListView());
    };

    // Custom KO binding that shows/hides elements via jQuery
    ko.bindingHandlers.fadeVisible = {
        update: function(element, valueAccessor) {
            // Whenever the value changes, fade the element in or out
            var value = ko.unwrap(valueAccessor());
            if (value === true) {
                $(element).fadeIn();
            } else {
                $(element).fadeOut();
            }
        }
    };
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
        zoom: 12,
        mapTypeControl: false
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
