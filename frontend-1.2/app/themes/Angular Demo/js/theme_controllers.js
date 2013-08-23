'use strict';

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */
$app.controller('mapController', function($scope, geolocation, $http){

  //set Map defaults
  $scope.leaflet = {
    defaults: {
      tileLayer: $scope.app.paths.map("plusdark"),
      maxZoom: 4
    },
    center: {lat :0, lng:0},
    markers : {}
  };

  // Update Leaflet model once we have gotten the user's location & lets us change the message if we cannot reverse geocode the Lat/Lng
  function updateData(latlng, message){
    var marker = {
      currentLocation : {
        lat : latlng.lat,
        lng : latlng.lng,
        focus : true,
        message : message
      }
    }

    var newData = {
        center : {
          lat: latlng.lat,
          lng: latlng.lng,
          zoom: 4
        }
      };

    angular.extend($scope.leaflet.markers, marker);
    angular.extend($scope.leaflet, newData);
  }

  //if location is saved in localstorage use that until we can get updated locataion
  if(!_.isUndefined(localStorage.savedGeo)){
    var geo = angular.fromJson(localStorage.savedGeo);
    console.log(geo.latlng);
    updateData(geo.latlng, geo.address);
  }

  //get geolocation
  geolocation.getCurrentPosition(function(pos){
    var latlng = { lat : pos.coords.latitude, lng : pos.coords.longitude };

    //use the latlng with google maps geocode api to find the nearest address
    $http.get(sprintf('http://maps.googleapis.com/maps/api/geocode/json?latlng=%(lat)s,%(lng)s&sensor=true', latlng)).success(function(data){
      var address = data.results[0].formatted_address;
      if(_.isEmpty(address)){
        updateData(latlng, 'You are here');
      }else{
        updateData(latlng, address);
      }

      //save location data, so when user comes back to the page the map can still be populated
      localStorage.savedGeo = angular.toJson({
        latlng : latlng,
        address : address
      });

    }).error(function(error){
      updateData(latlng, 'You are here');
    });
  });


  $scope.auth={user:"",pass:""};
  $scope.user={name:""};
  $scope.login=function(){
      var dat={};
      dat['user']=$scope.auth.user;
      dat['pass']=$scope.auth.pass;
      $.ajax({
        type:'POST',
        data:dat,
        url:"http://yinkeangseng.byethost8.com/check-user.php"
        //url:"http://localhost:8030/cont3nt-service/check-user.php"
      }).done(function(data){

            
          var objs=eval(data);
          if(objs.length>0){
            if(objs[0].status=="fail"){
              alert("Incorrect Username or password!");
            }
            else{
              alert("Welcome: " + objs[0].username);
            }
            $(".popupBox").removeClass("show");
            $(".popupBox").addClass("hide");
          }
      });
     
  };

});
 
$app.controller('HomeController', function ($scope, plus) {
  
    var b=false;
    
   



    $scope.auth={user:"",pass:""};
    $scope.user={name:""};
    $scope.login=function(){
        var dat={};
        dat['user']=$scope.auth.user;
        dat['pass']=$scope.auth.pass;
        $.ajax({
          type:'POST',
          data:dat,
          
          url:"http://yinkeangseng.byethost8.com/check-user.php"
          //url:"http://localhost:8030/cont3nt-service/check-user.php"
        }).done(function(data){

              
            var objs=eval(data);
            if(objs.length>0){
              if(objs[0].status=="fail"){
                alert("Incorrect Username or password!");
              }
              else{
                alert("Welcome: " + objs[0].username);
              }
              $(".popupBox").removeClass("show");
              $(".popupBox").addClass("hide");
            }
        });
      }


});
$app.directive('uploader',[function(){
	return{
		restrict:'E',
		scope:{
			action:'@',
		},
		controller:['$scope',function($scope,$location){
			
			$scope.progress=0;
			$scope.avatar = "";
			$scope.fileNameChanged = function(el)
			{
				var $form = $(el).parents('form');
				if ($(el).val()==''){
					return false;
				}
				$form.attr('action',$scope.action);
				console.log( angular.element($form).scope().video.username+"--");
				$scope.$apply(function(){
					$scope.username=angular.element($form).scope().video.username;
					$scope.progress = 0;
				});
				$form.ajaxSubmit({
					type:'POST',
					uploadProgress:function(event,position,total,percentage){
						$scope.$apply(function(){
						
							$scope.progress= percentage;
						});
					},
					error:function(event,statusText,responseText,form){
						//remove the action attribute from the form
						$form.removeAttr('action');
						//*** error occur
						alert("There is an error occur!" + responseText);
					},
					success:function(responseText,statusText,xhr,form){
						alert("Successfully!");
						var ar = $(el).val().split('\\'),filename = ar[ar.length-1];
						//remove teh action attribute from the form
						$form.removeAttr('action');
						$scope.$apply(function(){
							$scope.avatar=filename;
						});
						//$location.path("/video/all");
						window.location=("#/videoall/" + $scope.username);
					}
				});
			}
		}],
		link:function(scope,elem,attrs,ctrl){
			/*elem.find('.fileinput-button').click(function(){
			
				elem.find('.fileinput-button input[type=file]').click();
			});*/
			
				
		}
		,
		replace:false,
		templateUrl:'app/themes/Angular Demo/views/uploader.tpl.html'
		
	};
}
]);
/////////// directive for in app browsers
/*
	= : binding data
	& : delegate function
	Transclude simply takes the inner text of the element and places it in the portion marked with the ng-transclude

	Note:
	After running your application you will notice that once again the view does not get updated when exit is raised. Again we are stuck with the problem where events happen outside of the angular world and you must utilize $apply() Good news is we can easily accomplish this since we can wrap the scope function in the $apply() function call.
*/
/*$app.factory('dataService', function($rootScope, $http,$window) {
    var dataService = {};

    dataService.data = {};

    //Gets the list of nuclear weapons
    dataService.getNukes = function() {
        $http.get('data/nukes.json')
            .success(function(data) {
                dataService.data.nukes = data;
            });

        return dataService.data;
    };
    dataService.set=function(key,value){
    	dataService.data[key]=value;
    	//var str = dataService.data.serializeArray();
    	$window.requestFileSystem  = $window.requestFileSystem || $window.webkitRequestFileSystem;
    	//later for chrome.first for firefox
    	//console.log(window);
    	$window.requestFileSystem($window.PERSISTENT,0,gotFS,fail);
    };

    function gotFileWriter(writer){
    	alert("got gotFileWriter");
    	writer.write(JSON.stringify(dataService.data));
    }
    function gotFileEntry(fileEntry){
    	alert("got fileEntry");
    	fileEntry.createWriter(gotFileWriter,fail);

    }
    function gotFS(fileSystem){
    	alert("got fs");
    	fileSystem.root.getFile("data/nukes.json",{create:true,exclusive:false},gotFileEntry,fail);
    	
    }
    function fail(error){
    	console.log(error);
    	console.log("error:" + error);
    	alert("got error");
    }
    return dataService;
});*/
$app.directive("openExternal",function($window,CacheSocial,$http){
	return {
		restrict:'E',
		scope:{
			url:"=",
			dataString:"@",
			exit:"&",
			loadStart:"&",
			loadStop:"&",
			loadError:"&"
		},
		link:function(scope,elem,attr){
		},
		transclude:true,
		template:"<button class='btn' ng-click='openUrl()'><span ng-transclude></span></button>",
		controller:function($scope){
			var wrappedFunction = function(action){
				return function(){
					$scope.$apply(function(){
						console.log("hey why??");
						action();
					});
				}
			};
			var inAppBrowser;
			//var urlTo ="http://localhost:8030/login-with-twitter/login-social-session/request-login.php";
			var urlTo ="http://yinkeangseng.byethost8.com/login-twitter/login-social-session/request-login.php";

			$scope.openUrl=function(){
				//var cache = $cacheFactory("social-session");
				//alert(CacheSocial.get("key"));

				//request open url
				
				$http({method:'GET',url:urlTo}).success(function(data){
					if(data!=undefined)
					{	CacheSocial.put("social-key",data);
						inAppBrowser = $window.open($scope.url + "?social-key=" + data,"_blank","location=yes");console.log(inAppBrowser);
						//inAppBrowser.addEventListener("click",function(){alert(1);});
						
							$scope.dataString="hello";
						//set on exit event
						if ($scope.exit instanceof Function){
							
							inAppBrowser.addEventListener("exit",wrappedFunction($scope.exit));
						}
						if($scope.loadStart instanceof Function){
							inAppBrowser.addEventListener("loadstart",wrappedFunction($scope.loadStart));
						}
						if($scope.loadStop instanceof Function){
							inAppBrowser.addEventListener("loadstop",wrappedFunction($scope.loadStop));
						}
						if($scope.loadError instanceof Function){
							inAppBrowser.addEventListener("loaderror",wrappedFunction($scope.loadError));
						}
					}

				});


				
			};
		}
	};
});
$app.factory('CacheSocial', function($cacheFactory) {
  return $cacheFactory('CacheSocial');
});
$app.controller('TestController', function ($scope,$location,CacheSocial) {

	$scope.video={username:"sdf",title:"",description:"",file:"",placeholder:{username:"Ex: Naruto"}};
	//var cache = $cacheFactory("social-session");
	//$cacheFactory.put("key","wow1");
	//CacheSocial.put("key","wow");
	$scope.GetUserName=function(){

		return $scope.video.username;
	}
	$scope.watch=function(){
		var tmp= "/videoall/"+ $scope.video.username;
		//alert(tmp);
		if($scope.video.username!=""){
			$location.path("/videoall/" + $scope.video.username);
		}

	}
	$scope.url="http://yinkeangseng.byethost8.com/login-twitter/index.php";
	//$scope.url="http://localhost:8030/login-with-twitter/index.php";
	$scope.actions=[];
	$scope.closeBrowser=function(){
		console.log("-------------");
		$scope.actions.push("Closed Browser");
		console.log($scope.actions);
		//var urlTo ="http://localhost:8030/login-with-twitter/login-social-session/read-request-file.php?social-key=" + CacheSocial.get("social-key");
		var urlTo ="http://yinkeangseng.byethost8.com/login-twitter/login-social-session/read-request-file.php?social-key=" + CacheSocial.get("social-key");
		$http({method:'GET',url:urlTo}).success(function(data){
					alert(data);
				});
		
		alert("hello sir!");
	}
	$scope.loadStart = function(){
		$scope.actions.push("Load Start");
		console.log($scope.actions);
		console.log("-------------");
	}
	$scope.loadStop = function(){
		$scope.actions.push("Load Stop");
		console.log($scope.actions);
	}
	$scope.loadError = function(){
		$scope.actions.push("Load Error");
		console.log($scope.actions);
	}

});
$app.controller('ViewVideoController', function ($scope,$http,$routeParams,$location,$route) {
	$scope.dirs =[];
	$scope.username = "";
	
	if ($routeParams.username==undefined)
		$scope.username ="..";
	else	
		$scope.username =$routeParams.username;
	$scope.dirname = $scope.username + "/*";
	//http://yinkeangseng.byethost8.com/
	//http://localhost:8030/upload-files/getvideodir.php?dir_name=
	$scope.serverpath = "http://yinkeangseng.byethost8.com/cont3nt-uploader/";
	$http({method: 'GET', url: 'http://yinkeangseng.byethost8.com/cont3nt-uploader/getvideodir.php?dir_name=' + $scope.dirname}).
		success(function(data, status, headers, config) {
			$scope.dirs = $.map(data,function(k,v){ 
				return [k];
			});
				console.log($scope.dirs.length);
			
		});
		//$scope.$apply();
	$scope.checkName=function(dir){
		var n = dir.substr(2,dir.length-2).lastIndexOf(".");
		//alert(n);
		if(n>0){
			var extension = dir.substr(n+1 + 2,dir.length-(n+1+2));
			if (extension=="jpg" || extension=="png" || extension=="jpeg" || extension=="gif" ||  extension=="bmp"){
				return "image";
			}
			else if(extension=="3pg" || extension=="mp4" || extension=="wmv"){
				return "video";

			}
			else{
				return "nil";
			}
		}
		
	}
	
});

