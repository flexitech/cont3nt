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

$app.controller('TestController', function ($scope,$http) {
	$app.config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
              
                    angular.extend(fileUploadProvider.defaults, {
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        maxFileSize: 5000000,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                    });
               
            }
        ]);
   
	$scope.video={title:"",subtitle:"",description:"",file:"",placeholder:{title:"Ex: Naruto"}};
	$scope.upload=function(){
		alert($scope.video.file);
	};
	$scope.per=0;
	$scope.uploader={percentage:2234,width:10};
	
	$scope.queue=[];
	
	$scope.fileNameChanged=function(element,progress_bar){
		if (element.files.length>=1){
			var file = element.files[0];
			try{
			var uploader = new ChunkedUploader(file, { "d": "hi" });
			//uploader.options.urlphp="http://localhost:8030/upload-files/uploadfile.php";
			uploader.options.urlphp="http://yinkeangseng.byethost8.com/cont3nt-uploader/uploadfile.php";
			uploader.options.url="http://yinkeangseng.byethost8.com/cont3nt-uploader/";
			uploader.progress_bar_selector = ".bar-value";
			//alert($("progress").width());
			uploader.max_progress_bar_width = $(".progress").width();
			uploader.use_compression = false;
			uploader.progress_callback=$scope.callBackTest;
			
			$scope.queue.push({"url":uploader.options.url+ file.name,"name":file.name});
			$scope.$apply();
			uploader.start();
			}
			catch(e){alert(e);}
		}
		
	}
	
	$scope.callBackTest=function(per){
	
		$scope.per = Math.round(per*100);
		//alert($(".progress").width() * per);
		$scope.uploader.width=$(".progress").width() * per;
		$scope.$apply();
		/*$(".ng-model-per").html(Math.round(per*100));*/
		
	}
});

