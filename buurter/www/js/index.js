var loggedin;
var imgurl;
var userid;
var fbid;
var fb_first_name;
var username;
var loggedinmail;

var module = angular.module('buurter', ['onsen', 'LocalStorageModule', 'ngOpenFB', 'ui.router']);

module.config(function (localStorageServiceProvider, $httpProvider) {
  	localStorageServiceProvider
    .setPrefix('buurter');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
});

module.controller('AppController', function($rootScope, $scope, $compile, $http, localStorageService, ngFB, $state, $window, transformRequestAsFormPost) { 
//Check if logged in or not..

parsefbdata = function(user){
			$http({
			   url:'http://broekhuizenautomaterialen.nl/directa/data.php?user='+ loggedinmail +'',
			   method:"GET"
			}).success(function(data) {

				if (!data) {
				  // if not successful, bind errors to error variables
				  console.log(data);
				  console.log('error');
				} else {
				  // if successful, check if set and exist
					if(data.naam != null){
						console.log("bestaat !< write");
						
						//console.log(data);
						userid = data.id;
						fbid = data.fbid;
						username = data.fb_first_name;
						console.log(userid);
						console.log(fbid);
						console.log(username);
							$scope.name = data.fb_first_name;
							if(data.fbid == 0){
								$scope.imgurl = "img/intro-back.jpg";
							}else{
								$scope.imgurl = "http://graph.facebook.com/"+fbid+"/picture?type=large";
							}
					console.log("is de user id set?"+userid);
						
					}else if (data.naam == null){
						console.log("bestaat niet > schrijf");
						console.log(user.email);
						$http({
						   url:'http://broekhuizenautomaterialen.nl/directa/data.php?user='+ user.email +'',
						   method:"POST",
						   headers: {
							'X-Requested-With': 'XMLHttpRequest',
							'Content-Type': 'application/x-www-form-urlencoded'
						   },
						   transformRequest: transformRequestAsFormPost,
							data    : eval({ 
							'slug' : "users", 
							fb_email: ""+user.email+"", 
							password: ""+user.id+"",
							fb_first_name: ""+user.first_name+"",
							fb_last_name: ""+user.last_name+"",
							gender: ""+user.gender+"",
							fb_co_id: ""+user.id+""
							
							}),  // pass in data as strings
							
							isArray: true,
							callback: ''
						}).success(function(data) {
							if (!data) {
								// if not successful, bind errors to error variables
								console.log(data);
								console.log('error');
								
								ons.notification.alert({
									messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
									title: 'Oeps... er is iets fout gegaan',
									buttonLabel: 'OK',
									callback: function() {
																		
									}
								});
								
							} else {
								// if successful, bind success message to message
								console.log(data);
								console.log('success');
							  
								ons.notification.alert({
									messageHTML: '<div><ons-icon icon="fa-check" style="color:#61b76b; font-size: 28px;"></ons-icon></div>',
									title: 'Je bent succesvol geregistreerd',
									buttonLabel: 'OK',
									callback: function() {
										introNavigator.pushPage('home.html', { animation : 'slide' });										
									}
								});			                              	                                	
							}
						});

												

					}
			}
			});
			console.log(user);
			
}




	ons.ready(function() {

		if(localStorageService.isSupported) {
			console.log('storage supported: yes; type: local storage');
		}
		
		if (sessionStorage.loggedin == 'true') {
			loggedin = true;
			$rootScope.data = {
				show: true,
				hide: false
			};
			
			if(is.set(sessionStorage.fbAccessToken)){
			}else{
			loggedinmail = sessionStorage.email;
			parsefbdata(loggedinmail);
			}
					
			//console.log(sessionStorage.loggedin);
			introNavigator.pushPage('home.html', { animation : 'slide' });
		}
		

					//Need to watch on the session storage (FB AUTH KEY)
		if(is.set(sessionStorage.fbAccessToken)){
			
			ngFB.api({path: '/me'}).then(
			function(user) {
				loggedinmail = user.email;
				parsefbdata(user);
				$scope.user = user;			
				loggedin = true;
				//console.log("parse to db? fb data");
				
					

			},
			errorHandler);
		}
		function errorHandler(error) { 
			$scope.data = {
				show: false,
				hide: true
			};
			//alert(error.message);
		}
		
		// Defaults to sessionStorage for storing the Facebook token
		ngFB.init({appId: '1408768302786339'});

		//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
		//openFB.init({appId: '1408768302786339', tokenStore: window.localStorage});

		$scope.login = function() {
			ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
				function(response) {
					//alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
					sessionStorage.loggedin = true;	
				

					$window.location.reload();
				},
				function(error) {
					//alert('Facebook login failed: ' + error);
				});
		}

		$scope.getInfo = function() {
			ngFB.api({path: '/me'}).then(
				function(user) {
					//console.log(JSON.stringify(user));
					
					$scope.user = user;
				},
				errorHandler);
		}

		$scope.share = function() {
			ngFB.api({
				method: 'POST',
				path: '/me/feed',
				params: {message: document.getElementById('Message').value || 'Testing Facebook APIs'}
			}).then(
				function() {
					//alert('the item was posted on Facebook');
				},
				errorHandler);
		}

		$scope.readPermissions = function() {
			ngFB.api({
				method: 'GET',
				path: '/me/permissions'
			}).then(
				function(result) {
					//alert(JSON.stringify(result.data));
				},
				errorHandler
			);
		}

		$scope.revoke = function() {
			ngFB.revokePermissions().then(
				function() {
					//alert('Permissions revoked');
				},
				errorHandler);
		}

		$scope.logout = function() {
			ngFB.logout().then(
				function() {
					//alert('Logout successful');
				},
				errorHandler);
				sessionStorage.removeItem('fbAccessToken');
				sessionStorage.removeItem('loggedin');
				$window.location.reload();			
		}

		function errorHandler(error) { 
			$scope.data = {
				show: false,
				hide: true
			};
			//alert(error.message);
		}
				
	});
});

module.controller('IntroController', function($rootScope, $scope, $compile, $http, localStorageService, transformRequestAsFormPost, $window) { 
	ons.ready(function() {
				
		$scope.LoginSubmit = function() {
			$http({
			   url:'http://broekhuizenautomaterialen.nl/directa/data.php',
			   method:"POST",
			   headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
			   },
			   transformRequest: transformRequestAsFormPost,
				data    : eval({ 
				'slug' : "login", 
				fb_email: ""+$scope.email+"", 
				password: ""+$scope.password+""
				}),  // pass in data as strings
				
				isArray: true,
				callback: ''
			}).success(function(data) {
						
				if (!data) {
					// if not successful, bind errors to error variables
					console.log(data);
					console.log('error');
					
					ons.notification.alert({
                        messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
						title: 'Oeps... er is iets fout gegaan',
						buttonLabel: 'OK',
						callback: function() {
															
						}
                    });
					
				} else {
				  	// if successful, bind success message to message
				  	console.log(data);
				  	console.log('success');
				  	
				  	if (data == 'true') {
					 	ons.notification.alert({
	                    	messageHTML: '<div><ons-icon icon="fa-check" style="color:#61b76b; font-size: 28px;"></ons-icon></div>',
							title: 'Je bent succesvol ingelogd',
							buttonLabel: 'OK',
							callback: function() {
								sessionStorage.loggedin = true;
								sessionStorage.email = $scope.email;
								loggedinmail = $scope.email;
								$window.location.reload();
							}
	                	});		
				  	} else {
					  	ons.notification.alert({
	                    	messageHTML: '<div><ons-icon icon="fa-check" style="color:#61b76b; font-size: 28px;"></ons-icon></div>',
							title: 'Combinatie email en wachtwoord incorrect',
							buttonLabel: 'OK',
							callback: function() {
																	
							}
	                	});	
				  	}
				  
				  			                              	                                	
				}
			});
		};		
		
	});
});

module.controller('RegisterController', function($rootScope, $scope, $compile, $http, localStorageService, transformRequestAsFormPost) { 
	ons.ready(function() {
				
		$scope.RegisterSubmit = function() {
									
			$http({
			   url:'http://broekhuizenautomaterialen.nl/directa/data.php',
			   method:"POST",
			   headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
			   },
			   transformRequest: transformRequestAsFormPost,
				data    : eval({ 
				'slug' : "users", 
				fb_email: ""+$scope.email+"", 
				password: ""+$scope.password+"",
				fb_first_name: ""+$scope.fb_first_name+"",
				fb_last_name: ""+$scope.fb_last_name+"",
				gender: ""+$scope.gender+"",
				fb_co_id: "0"
				
				}),  // pass in data as strings
				
				isArray: true,
				callback: ''
			}).success(function(data) {
				if (!data) {
					// if not successful, bind errors to error variables
					console.log(data);
					console.log('error');
					
					ons.notification.alert({
                        messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
						title: 'Oeps... er is iets fout gegaan',
						buttonLabel: 'OK',
						callback: function() {
															
						}
                    });
					
				} else {
				  	// if successful, bind success message to message
				  	console.log(data);
				  	console.log('success');
				  
				  	ons.notification.alert({
                    	messageHTML: '<div><ons-icon icon="fa-check" style="color:#61b76b; font-size: 28px;"></ons-icon></div>',
						title: 'Je bent succesvol geregistreerd',
						buttonLabel: 'OK',
						callback: function() {
							introNavigator.pushPage('home.html', { animation : 'slide' });										
						}
                	});			                              	                                	
				}
			});
		
		};
			
	});
});

module.controller('HomeController', function($rootScope, $scope, $compile, $http, localStorageService, ngFB) { 

	ons.ready(function() {
		console.log($rootScope.data);
		
		$scope.fav_bar = {
			name: "indebuurt"	
		};
		
	});

		
	//Need to watch on the session storage (FB AUTH KEY)
	if(is.set(sessionStorage.fbAccessToken)){
		ngFB.api({path: '/me'}).then(
		function(user) {
			//console.log(JSON.stringify(user));
			$scope.user = user;
			loggedin = true;
			//console.log(loggedin);			
		},
		errorHandler);
	}
	function errorHandler(error) { 
		$scope.data = {
			show: false,
			hide: true
		};
		//alert(error.message);
	}

	
	$scope.fav_bar = {
	   name: "indebuurt" 
	};
 	
});







module.controller('GegevensController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('GegevensController', function($scope, ngFB) { 
		if(is.set(sessionStorage.fbAccessToken)){
			ngFB.api({path: '/me'}).then(
			function(user) {
				
				$scope.name = user.name;
				$scope.mail = user.email;
				$scope.age = user.age;
				$scope.imgurl = "http://graph.facebook.com/"+user.id+"/picture";
					$scope.selectedLevel = {
					   name: user.gender 
					};
				
				loggedin = true;
				console.log(loggedin);			
			},
			errorHandler);
		}
		function errorHandler(error) { 
			$scope.data = {
				show: false,
				hide: true
			};
			//alert(error.message);
		}

});

module.controller('InteressesController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('ContactenController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('NieuweActiviteitController', function($rootScope, $scope, $compile, $http, localStorageService, transformRequestAsFormPost) { 
	ons.ready(function() {
			console.log("IS HIJ IN DE ADD ACTIVITEIT SET? =="+userid);
		$scope.dialogs = {};
   
		$scope.AddActivityShow = function(dlg) {
			if (!$scope.dialogs[dlg]) {
		    	ons.createDialog(dlg).then(function(dialog) {
		        	$scope.dialogs[dlg] = dialog;
					dialog.show();
		      	});
		   	}
		    else {
		    	$scope.dialogs[dlg].show();
		    }
		}
				
		function geoAddActivity() {
	    
		    var options = { frequency: 5000, enableHighAccuracy: true};
			watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
		    
		    function onSuccess(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				
				localStorage.setItem("latitude", lat);
				localStorage.setItem("longitude", lng);
								
				$scope.map;
		        $scope.markers = [];
		        $scope.markerId = 1;

	            var latlng = new google.maps.LatLng(lat, lng);
	            var myOptions = {
	                zoom: 16,
	                center: latlng,
	                mapTypeId: google.maps.MapTypeId.ROADMAP,
	                disableDefaultUI: true
	            };
	            
	           var map = new google.maps.Map(document.getElementById("map_add_activity"), myOptions); 
	            
	            var contentString = "<div><a ng-click='clickTest()'>Mijn locatie</a></div>";
				var compiled = $compile(contentString)($scope);
		
				var infowindow = new google.maps.InfoWindow({
					content: compiled[0]
		    	});
		    			    	
		    	var icon_myPos = {
				    url: "img/wheelchair.png",
				    /*scaledSize: new google.maps.Size(50, 50), // scaled size
				    origin: new google.maps.Point(0,0), // origin
				    anchor: new google.maps.Point(0, 0) // anchor*/
				};
								
				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					title: 'Mijn locatie',
					optimized: false,
					animation: google.maps.Animation.DROP
					//icon: icon_myPos
		    	});
		
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
		    	});
		        
	            $scope.overlay = new google.maps.OverlayView();
	            $scope.overlay.draw = function() {}; // empty function required
	            $scope.overlay.setMap(map);
	            $scope.element = document.getElementById('map_add_activity');
	            $scope.hammertime = Hammer($scope.element).on("doubletap", function(event) {
	                $scope.addOnClick(event);
	            });
	            
	            var oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true, nearbyDistance: 20, legWeight: 1});
					        		
		        //Add single Marker
		        $scope.addOnClick = function(event) {
		            var x = event.gesture.center.pageX;
		            var y = event.gesture.center.pageY-44;
		            var point = new google.maps.Point(x, y);
		            var coordinates = $scope.overlay.getProjection().fromContainerPixelToLatLng(point);
					
					var iconBase = 'img/';
		            var marker = new google.maps.Marker({
		                position: coordinates,
		                map: map,
		                optimized: false,
		                //icon: iconBase + 'markerunrated.png'
		            });
		           		            
		            marker.id = $scope.markerId;
		            $scope.markerId++;
		            $scope.markers.push(marker);
		            		        
		            ons.notification.confirm({
			            title: 'Bevestiging',
	                    message: 'Weet je zeker dat je op deze locatie een activiteit wilt organiseren?',
	                    callback: function(idx) {
	                        switch(idx) {
	                            case 0:
	                                for (var i = 0; i < $scope.markers.length; i++) {
	                                    if ($scope.markers[i].id == marker.id) {
	                                        //Remove the marker from Map                  
	                                        $scope.markers[i].setMap(null);
	
	                                        //Remove the marker from array.
	                                        $scope.markers.splice(i, 1);
	                                    }
	                                }
	                                ons.notification.alert({
		                                messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
										title: 'Activiteit verwijderd',
										buttonLabel: 'OK'
	                                });
	                                break;
	                            case 1:	 
	                            								
									$scope.AddActivityShow('add-activity-form.html');
																								
									localStorage.setItem("marker-latitude", $scope.markers[0].position.A);
		                            localStorage.setItem("marker-longitude", $scope.markers[0].position.F);	
		                                                                       	
	                                break;
	                        }
	                    }
	                });
		        };  
		        
		        $scope.map = map;		       
		         				
			}
						
			function onError(error) {
				alert("message: " + error.message);
				localStorage.setItem("message", error.message);
			}
		
		}
	    	
	  	google.maps.event.addDomListener(window, 'load', geoAddActivity());
				
	});
});

module.controller('AddActivityFormController', function($rootScope, $scope, $compile, $http, localStorageService, transformRequestAsFormPost) {
	ons.ready(function() {
				
		$scope.list = [ { "id" : "1" , "name" : "Sport" } , { "id" : "2" , "name" : "Eten en drinken" } , { "id" : "3" , "name" : "Shoppen"} , { "id" : "4" , "name" : "Muziek"}, { "id" : "5" , "name" : "Film"}, { "id" : "6" , "name" : "Spel"}, { "id" : "7" , "name" : "Video Games"}, { "id" : "8" , "name" : "Fotografie"}, { "id" : "9" , "name" : "Relaxen"} , { "id" : "10" , "name" : "Reizen"}, { "id" : "11" , "name" : "Overige"} ];
		
  		var marker_latitude = localStorage.getItem("marker-latitude");
		var marker_longitude = localStorage.getItem("marker-longitude");	
   		
		$scope.AddActivitySubmit = function() {
					
        	var WC_latitude = marker_latitude;
        	var WC_longitude = marker_longitude;
       	
        	var json = (function () {
				var json = null;
				$.ajax({
					'type':'GET',
					'async': false,
					'global': false,
					'url': "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + WC_latitude + "," + WC_longitude + "&sensor=true",
					'dataType': "json",
					'success': function (data) {
						json = data;
					}
				});
				return json;										
			})();
			
			WC_latitude = json.results[0].geometry.location.lat;									
			WC_longitude = json.results[0].geometry.location.lng;
			var WC_address = json.results[0].formatted_address;
	                            									   		
			$http({
			   url:'http://broekhuizenautomaterialen.nl/directa/data.php',
			   method:"POST",
			   headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded'
			   },
			   transformRequest: transformRequestAsFormPost,
				data : eval({ 
				'slug' : "activities", 
				user_id : ""+userid+"", 
				title : ""+$scope.activity_title+"",
				category : ""+$scope.model_selected.name+"",
				date : ""+$scope.activity_date+"",
				date : ""+$scope.activity_date+"",
				from_time : ""+$scope.activity_time_1+"",
				to_time : ""+$scope.activity_time_2+"",
				description : ""+$scope.activity_description+"",
				address : ""+WC_address+"",
				latitude : ""+WC_latitude+"",
				longitude : ""+WC_longitude+""
				}),  // pass in data as strings
				
				isArray: true,
				callback: ''
			}).success(function(data) {				
				if (!data) {
					// if not successful, bind errors to error variables
					console.log(data);
					console.log('error');
					
					ons.notification.alert({
                        messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
						title: 'Oeps... er is iets fout gegaan',
						buttonLabel: 'OK',
						callback: function() {
															
						}
                    });	
				} else {
				  	// if successful, bind success message to message
				  	console.log(data);
				  	console.log('success');
				  
				  	ons.notification.alert({
                    	messageHTML: '<div><ons-icon icon="fa-check" style="color:#61b76b; font-size: 28px;"></ons-icon></div>',
						title: 'De activiteit is succesvol toegevoegd',
						buttonLabel: 'OK',
						callback: function() {
							introNavigator.popPage('home.html');										
						}
                	});			                              	                                	
				}	
			 });
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			/*$http({
				url:'http://marijnstuyfzand.nl/mia6/handyfriendly/www/php/insert_marker.php',
				method:"POST",
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			    data: $.param({ 
					slug: "toilets",
					device_id: $scope.data[0],  
					name: $scope.data[1],
					address: $scope.data[2],
					latitude: $scope.data[3], 
					longitude: $scope.data[4],
					rating: $scope.data[5],
				}),  // pass in data as strings
				isArray: true,
				callback: ''
		  	}).success(function(data) {
				if (!data) {
					// if not successful, bind errors to error variables
					console.log(data);
					console.log('error');
					
					ons.notification.alert({
                        messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
						title: 'Oeps... er is iets fout gegaan',
						buttonLabel: 'OK',
						callback: function() {
							
							localStorage.removeItem("profile_id");
							location.reload();
						
						}
                    });
					
				} else {
				  	// if successful, bind success message to message
				  	console.log(data);
				  	console.log('success');
				  	
				  	var json = (function () {
						var json = null;
						$.ajax({
							'type':'GET',
							'async': false,
							'global': false,
							'url': "http://marijnstuyfzand.nl/mia6/handyfriendly/www/php/get_marker.php",
							'dataType': "json",
							'data': $.param({ 
								get_toilets: "all"
							}),
							'success': function (data) {
								json = data;
							}
						});
						return json;
					})();
					
					var profile_data_id = $(json).last()[0].id;
					//var added_id = $(json).last()[0].id;
									  	
				  	$scope.data = [];
			
				  	$scope.data.push(profile_data_id );
					$scope.data.push(Device_id);			
					$scope.data.push($scope.rating2);
					$scope.data.push($scope.marker_comment);
					$scope.data.push(Device_name);
					
					//$scope.data.push(added_id);
											
					console.log($scope.data);
					
					$http({
						url:'http://marijnstuyfzand.nl/mia6/handyfriendly/www/php/insert_marker.php',
						method:"POST",
						headers: {
							'X-Requested-With': 'XMLHttpRequest',
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					    data: $.param({ 
							slug: "saveRateComment",
							toilet_id: $scope.data[0], 
							device_id: $scope.data[1],  
							rating: $scope.data[2],
							comment: $scope.data[3],
							device_name: $scope.data[4],
							//added_id: $scope.data[5]
						}),  // pass in data as strings
						isArray: true,
						callback: ''
				  	}).success(function(data) {
						if (!data) {
							// if not successful, bind errors to error variables
							console.log(data);
							console.log('error');
							
							ons.notification.alert({
		                        messageHTML: '<div><ons-icon icon="fa-ban" style="color:#9d0d38; font-size: 28px;"></ons-icon></div>',
								title: 'Oeps... er is iets fout gegaan',
								buttonLabel: 'OK',
								callback: function() {
									
									localStorage.removeItem("profile_id");
									location.reload();
								
								}
		                    });
							
						} else {
						  	// if successful, bind success message to message
						  	console.log(data);
						  	console.log('success');
						  
						  	ons.notification.alert({
		                    	messageHTML: '<div><ons-icon icon="fa-check" style="color:#25c2aa; font-size: 28px;"></ons-icon></div>',
								title: 'WC toegevoegd',
								buttonLabel: 'OK',
								callback: function() {
															
									localStorage.removeItem("profile_id");
									location.reload();
																			
								}
		                	});			                              	                                	
						}
					});
							                              	                                	
				}
			});*/
						  				  								  				
		};
		
	});
});


























module.controller('InviteController', function($scope) { 
	ons.ready(function() {
		
	});
});


(function(){
 
module.controller('DetailController', function($scope, $data) {
        $scope.item = $data.selectedItem;
        
            $scope.showDetail = function(index) {
            var selectedItem = $data.items[index];
            $data.selectedItem = selectedItem;
            $scope.introNavigator.pushPage('overzicht.html', selectedItem);
        };
        
        
    });
    
   
module.controller('OverzichtController', function($scope, $data) {
        $scope.item = $data.selectedItem;
    });    

    module.controller('MainCtrl', function($scope, $data) {
			$scope.items = $data.items;

			$scope.showDetail = function(index) {
				var selectedItem = $data.items[index];
				$data.selectedItem = selectedItem;
				$scope.introNavigator.pushPage('details.html', selectedItem);
			};
    });
    
     module.controller('MemorieCtrl', function($scope, $data2) {
        $scope.items = $data2.items;
        

        $scope.showDetail = function(index) {
            var selectedItem = $data2.items[index];
            $data2.selectedItem = selectedItem;
            $scope.introNavigator.pushPage('memorieOverzicht.html', selectedItem);
        };
        
    });
    
    module.controller('MemorieDetailsCtrl', function($scope, $data2) {
        $scope.item = $data2.selectedItem;
        
         $scope.showDetail = function(index) {
            var selectedItem = $data2.items[index];
            $data2.selectedItem = selectedItem;
            $scope.introNavigator.pushPage('memorieOverzicht.html.html', selectedItem);
        };

        
    }); 
    
      module.controller('MemorieOverzichtController', function($scope, $data2) {
        $scope.item = $data2.selectedItem;
    });    

    



module.factory('$data', function() {
        var data = {};

        data.items = [
            {
                name: 'Amy Jones',
                act: 'Lekker shoppen in Tilburg',
                date: '13:45',
                cat: 'Shoppen',
                picture: 'images/amy_jones.jpg'
            },
            {
                name: 'Eugene Lee',
                act: 'World of warcraft spelen',
                date: '16:00',
                cat: 'Video games',
                picture: 'images/eugene_lee.jpg'
            },
            {
                name: 'Gary Donovan',
                act: 'Lunchen bij de Febo',
                date: '16:00',
                cat: 'Eten',
                picture: 'images/gary_donovan.jpg'
            },
            {
                name: 'James King',
                act: 'Barbequen',
                date: '17:30',
                cat: 'Eten',
                picture: 'images/james_king.jpg'
            },
            {
                name: 'john_williams',
                act: 'Lekker shoppen in Tilburg',
                date: '20:00',
                cat: 'Shoppen',
                picture: 'images/john_williams.jpg'
            },
            {
                name: 'julie_taylor',
                act: 'World of warcraft spelen',
                date: '20:00',
                cat: 'Video games',
                picture: 'images/julie_taylor.jpg'
            },
            {
                name: 'kathleen_byrne',
                act: 'Lunchen bij de Febo',
                date: '20:00',
                cat: 'Eten',
                picture: 'images/kathleen_byrne.jpg'
            },
            {
                name: 'lisa_wong',
                act: 'Barbequen',
                date: '20:00',
                cat: 'Eten',
                picture: 'images/lisa_wong.jpg'
            },
            {
                name: 'paul_jones',
                act: 'Lekker shoppen in Tilburg',
                date: '4h',
                cat: 'Shoppen',
                picture: 'images/paul_jones.jpg'
            },
            {
                name: 'paula_gates',
                act: 'World of warcraft spelen',
                date: '6h',
                cat: 'Video games',
                picture: 'images/paula_gates.jpg'
            },

            

        ];

        return data;
    });
  
  module.factory('$data2', function() {
        var data2 = {};

        data2.items = [
            {
                name: 'Gary Donovan',
                act: 'Lunchen bij de Febo',
                date: '1 day ago',
                cat: 'Eten',
                picture: 'images/gary_donovan.jpg'
            },
            {
                name: 'julie_taylor',
                act: 'Keiharde apenmuziek luisteren',
                date: '1 day ago',
                cat: 'Video games',
                picture: 'images/julie_taylor.jpg'
            },
            {
                name: 'ray_moore',
                act: 'Lunchen bij de Febo',
                date: '1 day ago',
                cat: 'Eten',
                picture: 'images/ray_moore.jpg'
            },
            {
                name: 'steven_wells',
                act: 'Barbequen',
                date: '1 week ago',
                cat: 'Eten',
                picture: 'images/steven_wells.jpg'
            },

            

        ];

        return data2;
    });


    })();


















module.factory("transformRequestAsFormPost",  function() {

	// I prepare the request data for the form post.
	function transformRequest( data, getHeaders ) {

		var headers = getHeaders();

		headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";

		return( serializeData( data ) );

	}


	// Return the factory value.
	return( transformRequest );


	function serializeData( data ) {

			// If this is not an object, defer to native stringification.
			if ( ! angular.isObject( data ) ) {

				return( ( data == null ) ? "" : data.toString() );

			}

			var buffer = [];

			// Serialize each key in the object.
			for ( var name in data ) {

				if ( ! data.hasOwnProperty( name ) ) {

					continue;

				}

				var value = data[ name ];

				buffer.push(
					encodeURIComponent( name ) +
					"=" +
					encodeURIComponent( ( value == null ) ? "" : value )
				);

			}

			// Serialize the buffer and clean it up for transportation.
			var source = buffer
				.join( "&" )
				.replace( /%20/g, "+" )
			;

			return( source );

		}

	}
);