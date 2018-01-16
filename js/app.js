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
	ViewModel = function() {
		this.markers = ko.observableArray([
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
		]);

		//add marker to map
		this.addMarker = function() {
			let self = this;
			for(let i = 0; i < self.markers().length; i++) {
				marker = new google.maps.Marker({
					position: self.markers()[i].location,
					map: map,
					title: self.markers()[i].title,
					icon: self.markers()[i].icon,
					animation: google.maps.Animation.DROP,
				});
				self.addInfoWindow();
				self.callAPI();
			}
		}

		//add infowindow to marker
		this.addInfoWindow = function() {
			let self = this;
			//create info windows
			infowindow = new google.maps.InfoWindow({maxWidth: 200});

			//creates an infowindow 'key' in the marker. (from: https://leewc.com/articles/google-maps-infowindow/)
			// marker.infowindow = infowindow;

			//listen for click on markers
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, this);
				//if marker is bouncing, set animation to null, otherwise set animation to bounce
				if(this.getAnimation() !== null) {
					this.setAnimation(null);
				} else {
					this.setAnimation(google.maps.Animation.BOUNCE);					
				}
				infowindow.setContent(`<h3><strong>${this.title}</strong></h3></br>
		            ${locInfo} </br> 
		            <a href=${wikiUrl}>${siteUrl}</a></br>
		            <img src=${pic}>`);
			});			
		}

		//call wikipedia and Flickr APIs
		this.callAPI = function() {
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
		            siteUrl = response[3][0];
		            // stop timeout from happening once things are loaded
		            clearTimeout(wikiRequestTimeout);
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
		}

		// filter the items using the filter text
		this.filterText = ko.observable('');
		this.filteredLoc = ko.computed(function() {
			if (!this.filterText) {
		        return this.markers;
		    } else {
				return ko.utils.arrayFilter(this.markers, function(item) {
					return ko.utils.stringStartsWith(item.title.toLowerCase(), this.filterText);
					console.log(filterText);
				});
			}		
		});
		//call addMarkers
		this.addMarker();
	}

	//apply bindings and sort list
	ko.applyBindings(new ViewModel());	
	
}
