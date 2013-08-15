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
        //url:"http://yinkeangseng.byethost8.com/check-user.php"
        url:"http://localhost:8030/cont3nt-service/check-user.php"
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
      /*if ($scope.auth.user=="admin" && $scope.auth.pass=="admin"){
          alert("Login Successfully!");
          $scope.user.name=$scope.auth.user;
          if(typeof(Storage)!=="undefined")
          {
          // Yes! localStorage and sessionStorage support!
          // Some code.....
            alert("support web storage");
              localStorage.username = $scope.auth.user;
          }
        else
          {
            alert("not support web storage");
          }
          
      }
      else{
        alert("Incorrect Username or password!");        
      }*/
  };

});
 
$app.controller('HomeController', function ($scope, plus) {
  // defaulting the time on Angular's model variable.
  
  
  if(typeof(Storage)!=="undefined")
  {// Yes! localStorage and sessionStorage support!
    // Some code.....
    
    //localStorage.username = $scope.auth.user;
    if ($scope.user!=undefined){
      alert("support web storage" + $scope.user);
    }
   
    
  }
  else
    {
    alert("not support web storage");
    }
    // $(document).ready(function(){
           ///////NEws loading
      var b=false;
    // });
 $(document).ready(function(){
           ///////NEws loading
      $scope.news={content:""};
      $('.news-group').html('');
      ////// get ajax
      $.ajax({
        type:'GET',
        //url:"http://yinkeangseng.byethost8.com"
        url:"http://localhost:8030/cont3nt-service/get-news.php"
      }).done(function(data){
          var objs=eval(data);
          //alert(objs.length);
          for(var i=0;i<objs.length;i++){
            var data_info = objs[i].upload_date + "<br/>" +  objs[i].news_short_dec;
            var data =  objs[i].news_dec;
            var str = '<article><h4>' + objs[i].news_title  +'</h4><p class="header-info">' + data_info + '</p><p class="content">' + data +'</p></article>';
            //$scope.news.content =$scope.news.content  + str;
            $('.news-group').html($('.news-group').html() + str);
          }
             
      b=true;
      });

      $("#wrapper").niceScroll({touchbehavior:true});
     });
  if(b==true){
      $scope.news={content:""};
        ////// get ajax
        $.ajax({
          type:'GET',
          //url:"http://yinkeangseng.byethost8.com"
          url:"http://localhost:8030/cont3nt-service/get-news.php"
        }).done(function(data){
            var objs=eval(data);
            //alert(objs.length);
            for(var i=0;i<objs.length;i++){
              var data_info = objs[i].upload_date + "<br/>" +  objs[i].news_short_dec;
              var data =  objs[i].news_dec;
              var str = '<article><h4>' + objs[i].news_title  +'</h4><p class="header-info">' + data_info + '</p><p class="content">' + data +'</p></article>';
              //$scope.news.content =$scope.news.content  + str;
              $('.news-group').html($('.news-group').html() + str);
            }
               
        });
        $("#wrapper").niceScroll({touchbehavior:true});
   }




    $scope.auth={user:"",pass:""};
    $scope.user={name:""};
    $scope.login=function(){
        var dat={};
        dat['user']=$scope.auth.user;
        dat['pass']=$scope.auth.pass;
        $.ajax({
          type:'POST',
          data:dat,
          
          //url:"http://yinkeangseng.byethost8.com/check-user.php"
          url:"http://localhost:8030/cont3nt-service/check-user.php"
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

$app.controller('FreelancerController', function ($scope, plus) {
   
});

$app.controller('BlogController', function ($scope, plus) {
   // var b=false;
     
   //  $(document).ready(function(){
   //      $("#wrapper").niceScroll({touchbehavior:true});
   //      b=true;
   //  });
   // if(!b)
   //  $("#wrapper").niceScroll({touchbehavior:true});
});
  // defaulting the time on Angular's model variable.
 
