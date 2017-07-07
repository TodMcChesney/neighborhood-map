/* exported initMap, errorMap */

// Globals
var map;
var model;

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
            $.ajax({
                url: wikiUrl,
                data: {
                    action: 'opensearch',
                    search: marker.title,
                    format: 'json'
                },
                dataType: 'jsonp'
            }).done(function(data) {
                wikiInfo = data[2][0];
                    if (wikiInfo.length > 150) {
                        wikiInfo = wikiInfo.slice(0, 147) + '...';
                    }
                wikiLink = data[3][0];
                infowindow.setContent('<h3>' + marker.title + '</h3>' +
                '<p>' + wikiInfo + '</p>' + '<a href="' + wikiLink +
                '" target="_blank" >Read more on Wikipedia</a>');
            }).fail(function() {
                infowindow.setContent('<h3>' + marker.title + '</h3>' +
                '<p>Unfortunately more information on ' + marker.title +
                ' was unavailable from Wikipedia.</p>');
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
    model.places.forEach(function(place, index) {
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
            map.panTo(marker.getPosition());
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

    this.recenterMap = function() {
        map.panTo(new google.maps.LatLng(46.203356,6.146466));
    };

    // Create showNavView observable
    self.showNavView = ko.observable(true);

    // Toggle showNavView true/false function
    this.toggleNavView = function() {
        self.showNavView(!self.showNavView());
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

// Load Places data
function loadData() {
    'use strict';

    // Load Places JSON data via AJAX and update model
    $.getJSON('js/places.json', function(data) {
        model = data;
    }).done(function() {

        // Instantiate the ViewModel after data is done loading
        ko.applyBindings(new ViewModel());
    }).fail(function() {

        // Show alert box with error message if data fails to load
        window.alert('Unfortunately the Places data did not load correctly. Please try refreshing your browser!');
    });
}

// Google Maps API script callback function that initializes the map
function initMap() {
    'use strict';

    // Constructor to create a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 46.203356,
            lng: 6.146466
        },
        zoom: 12,
        mapTypeControl: false
    });

    // Call function to load Places data
    loadData();
}

// Google Maps API script error handler function
function errorMap() {
    'use strict';

    // Show alert box with error message if map doesn't load
    window.alert('Unfortunately Google Maps did not load correctly. Please try refreshing your browser!');
}
