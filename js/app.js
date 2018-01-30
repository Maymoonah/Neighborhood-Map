//declare variables on global level
let markers, locations, ViewModel, marker, infowindow, sideBar = 'show';


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
		let locInfo, url, articleStr, wikiUrl, siteUrl, flickrUrl, pic;
		let self = this;
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
			self.markers().forEach(function(element) {
				marker = new google.maps.Marker({
					position: element.location,
					map: map,
					title: element.title,
					icon: element.icon,
					animation: google.maps.Animation.DROP,
					stopCoords: element
				});
				//bind each marker to its location
				element.marker = marker;

				//call functions
				self.addInfoWindow();
				self.callAPI();
				self.filterMarkers();
			});
		}

		//add infowindow to marker
		this.addInfoWindow = function() {
			//create info windows
			infowindow = new google.maps.InfoWindow({maxWidth: 200});

			//listen for click on markers
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, this);
				let self = this;
				self.setAnimation(google.maps.Animation.BOUNCE);
				//stop marker bouncing after 3 bounces
				setTimeout(function() {
					self.setAnimation(null);
				}, 2100);				
			});	
		}

		//call wikipedia and Flickr APIs
		this.callAPI = function() {
    	// Wikipedia AJAK request from Udacity Intro to AJAX with adjustments
	    wikiUrl = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${marker.title}&format=json&callback=wikiCallback`;
	    //if page takes long time to load
	    let wikiRequestTimeout = setTimeout(function() {
	        alert('failed to get wikipedia resources');
	    }, 8000);
	    	let ajax = $.ajax({
		        url: wikiUrl,
		        dataType: 'jsonp',
		        //callback
		        success: function(response) {
		           locInfo = response[2][0];
		           siteUrl = response[3][0];
		           if(locInfo === undefined || siteUrl === undefined) {
		               locInfo = "Cannot find information";
		               siteUrl = "Cannot find url";
		           }
		           // SET INFOWINDOW CONTENT HERE
		           infowindow.setContent(`<h3><strong>${marker.title}</strong></h3></br>
		            ${locInfo} </br> 
		            <a href=${wikiUrl}>${siteUrl}</a></br>
		            <img src=${pic}>`
        			);
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
			if (!self.filterText) {
		        return self.markers;
		    } else {
				return ko.utils.arrayFilter(self.markers(), function(item) {
					// from https://github.com/knockout/knockout/issues/401
					let stringStartsWith = function (string, startsWith) {
					    string = string || "";
					    if (startsWith.length > string.length)
					        return false;
					    return string.substring(0, startsWith.length) === startsWith;
					}
					return stringStartsWith(item.title.toLowerCase(), self.filterText());
				});
			}
		});

		//filter markers
		self.filterMarkers = function() {
			$('#search').on('keyup', function() {
				for(let i = 0; i < self.markers().length; i++) {
					//close any infowindows that may be open
					infowindow.close();
					self.markers()[i].marker.setVisible(false);
				}
				for(let i = 0; i < self.filteredLoc().length; i++) {
					let fil = self.filteredLoc()[i].marker;
					//show all markers in filteredLoc
					fil.setVisible(true);
					//open infowindow for filteredLoc markers
					infowindow.open(map, self.filteredLoc()[i].marker);
					//set animation to marker and stop animation after 3 bounces
					fil.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
					fil.setAnimation(null);
				}, 2100);
				}
			});
		}

		// when list item is clicked, open corresponding marker's info
		this.showInfo = function() {
			google.maps.event.trigger(this.marker, 'click');
			// let el = document.querySelector('li');
			// el.style.backgroundColor = '#2073f9';
			// el.style.color = '#fff';			
		}

		//show and hide sidebar
		this.toggleSidebar = function() {
			if(sideBar === 'show') {
				$('.listView').css('-webkit-transform', 'translate(-100%, 0)');
				sideBar = 'hide';
			} else {
				$('.listView').css('-webkit-transform', 'translate(0, 0)');
				sideBar = 'show';
			}
			console.log(sideBar);
		}


		//call addMarkers
		this.addMarker();
	}

	//apply bindings
	ko.applyBindings(new ViewModel());
}