let markers, locations, ViewModel, marker, infowindow;
let locInfo, url, articleStr, wikiUrl, siteUrl, flickrUrl, pic;
//Initialize the map
function initMap() {
	let map;
	let options = {
		center: {lat: 34.020289, lng: -117.865339},
		zoom: 13,
		scrollwheel: false
	};
	//creating map
	map = new google.maps.Map(document.getElementById('map'), options);

	//View Model
	ViewModel = {
		markers: ko.observableArray([
			{title: 'Krispy Kreme', location: {lat: 33.994923, lng: -117.930837}, icon: './images/donut.png'},
			{title: 'Mt. San Antonio College', location: {lat: 34.047693, lng: -117.844858}, icon: './images/college.png'},
			{title: 'Islamic Center of San Gabriel Valley', location: {lat: 33.994873, lng: -117.884711}, icon: './images/mosque.png'},
			{title: 'Yogurtland', location: {lat: 34.027874, lng: -117.833771}, icon: './images/frozenyogurt.png'},
			{title: 'Oak Tree Lanes', location: {lat: 34.035642, lng: -117.805326}, icon: './images/bowling.png'},
			{title: 'Nogales High School', location: {lat: 34.009556, lng: -117.889152}, icon: './images/highschool.png'},			
			{title: 'Pizza Hut', location: {lat: 33.985859, lng: -117.888866} ,icon: './images/pizza.png'},
			{title: 'Domino\'s Pizza', location: {lat: 34.027549, lng: -117.893225}, icon: './images/pizza.png'},
			{title: 'Baskin-Robbins', location: {lat: 34.011885, lng: -117.886430}, icon: './images/icecream.png'},
			{title: 'Suzanne Middle School', location: {lat: 34.025070, lng: -117.850407}, icon: './images/school.png'},
			{title: 'Walnut High School', location: {lat: 34.021202, lng: -117.849043}, icon: './images/highschool.png'},
			{title: 'Farmers Market', location: {lat: 34.020304, lng: -117.811443}, icon: './images/farmersmarket.png'},
			{title: 'South Pointe Middle School', location: {lat: 33.990842, lng: -117.848859}, icon: './images/school.png'},
			{title: 'Los Angeles County Fire Dept.', location: {lat: 34.020786, lng: -117.865621}, icon: './images/firetruck.png'},
			{title: 'Stop Break Shops', location: {lat: 33.998230, lng: -117.884749}, icon: './images/mechanic.png'},			
			{title: 'Chevron', location: {lat: 34.015822, lng: -117.850391}, icon: './images/gas-station.png'},			
			{title: 'Bank of America', location: {lat: 34.013161, lng: -117.861232}, icon: './images/bank.png'}
		]),
		//add marker to map
		addMarker: function() {
			for(let i = 0; i < this.markers().length; i++) {
				marker = new google.maps.Marker({
					position: this.markers()[i].location,
					map: map,
					title: this.markers()[i].title,
					icon: this.markers()[i].icon,
					animation: google.maps.Animation.DROP
				});
				this.addInfoWindow();
			}
		},

		//add infowindow to marker
		addInfoWindow: function() {
			
			//Wikipedia AJAK request from Udacity Intro to AJAX with some adjustments
		    wikiUrl = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${marker.title}&format=json&callback=wikiCallback`;
		    //if page takes long time to load
		    let wikiRequestTimeout = setTimeout(function() {
		        alert('failed to get wikipedia resources');
		    }, 8000);
		    $.ajax({
		        url: wikiUrl,
		        dataType: 'jsonp',
		        //callback
		        success: function(response) {
		            locInfo = response[2][0];
		            // console.log(locInfo);
		            siteUrl = response[3][0];
		            // stop timeout from happening once things are loaded
		            clearTimeout(wikiRequestTimeout);
		            infowindow.setContent(`<strong>${marker.title}</strong> </br>
		             ${locInfo} </br> 
		             <a href=${wikiUrl}>${siteUrl}</a></br>
		             <img src=${pic}>`);
		            // return marker;
		        }
		    });

		    //Flickr API
		    flickrUrl = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			$.getJSON( flickrUrl, {
			tags: marker.title,
			tagmode: "any",
			format: "json"
			})
			.done(function( data ) {
			  $.each( data.items, function( i, item ) {
			  	pic = item.media.m;
			  });
			});

			//create info windows
			infowindow = new google.maps.InfoWindow({
				content: `<strong>${marker.title}</strong></br>
				${locInfo}</br>
				<a href=${wikiUrl}>${siteUrl}</a>`,
				maxWidth: 200
			});

			//creates an infowindow 'key' in the marker. (from: https://leewc.com/articles/google-maps-infowindow/)
			marker.infowindow = infowindow;

			//listen for click on markers
			google.maps.event.addListener(marker, 'click', function() {
				this.infowindow.open(map, this);
				this.setAnimation(google.maps.Animation.BOUNCE);
			});			
		},

		//sort list items
		sortList: function() {
			this.markers.sort();
		},
		
		//when list item is clicked, open corresponding marker's info
		showInfo: function() {
			let self = this;
			for(let i = 0; i < self.markers().length; i++) {
				$('li').on('click', function() {
					//check to see which marker corresponds with clicked item list
					if(self.markers()[i].title === $(this).text()) {
						// marker.position = self.markers()[i].location;
						// console.log(self.markers()[i].location);
						self.addInfoWindow();
						marker.infowindow.open(map, marker);
						marker.setAnimation(google.maps.Animation.BOUNCE);
					}					
				});
				
			}
		}
		//filter the items using the filter text
		// filterText: ko.observable(),
		// filteredLoc: ko.computed(function() {		
		// 		return ko.utils.arrayFilter(this.markers(), function(marker) {
		// 			 return ko.utils.stringStartsWith(marker.location.toLowerCase(), this.filterText());
		// 		});
		// })

		
	};

	//apply bindings and sort list
	ko.applyBindings(ViewModel);
	ViewModel.sortList();

	//call addMarkers
	ViewModel.addMarker();

		
	
	
}

// ********************************************************************

//create place autocomplete
	// let input = document.getElementById('search');
	// let autocomplete = new google.maps.places.Autocomplete(input);

	//get search results
	// autocomplete.addListener('place_changed', function() {
	// 	autoLocation = autocomplete.getPlace();
	// 	// add new location to markers array
	// 	ViewModel.markers.push({
	// 		title: autoLocation.name,
	// 		locations: {
	// 			lat: autoLocation.geometry.location.lat(),
	// 			lng: autoLocation.geometry.location.lng()
	// 		}
	// 	});

	// 	//add marker and info window for new location to the map
	// 	marker = new google.maps.Marker({
	// 		position: {
	// 			lat: autoLocation.geometry.location.lat(),
	// 			lng: autoLocation.geometry.location.lng()
	// 		},
	// 		map: map,
	// 		title: autoLocation.name,
	// 		animation: google.maps.Animation.DROP,
	// 	});

	// 	//clear the input box
	// 	document.getElementById('search').value = '';

	// 	//add info window for new marker
	// 	ViewModel.addInfoWindow();

	// 	//bias results for auto complete to bounds of current map area
	// 	autocomplete.bindTo('bounds', map);
	// });

// show/hide sidebar when bars icon is clicked
// $('#bars').on('click', function() {
// 	if($('.listView').css('visibility', 'visible')) {
// 		$('#map').css('width', '100%');
// 		$('.mapNav').css('width', '100%');
// 		$('.listView').css('visibility', 'hidden');
// 		$('.navbar').css('visibility', 'hidden');
// 	} else {
// 		$('#map').css('width', '100%');
// 		$('.mapNav').css('width', '100%');
// 		$('.listView').css('visibility', 'visible');
// 		$('.navbar').css('visibility', 'visible');
// 	}
// });