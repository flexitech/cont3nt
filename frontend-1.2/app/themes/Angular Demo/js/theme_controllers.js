'use strict';

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */

$app.controller('mapController', function($scope, geolocation, $http){

  	$scope.center= {
		latitude: 0, // initial map center latitude
		longitude: 0, // initial map center longitude
	};
	$scope.markers= []; // an array of markers,
	$scope.zoom= 8; // the zoom level

});

$app.controller('LayoutController', function ($scope,$navigate) {
	$scope.login=function(){
		$navigate.go("/login","modal");
	}
	

}); 
$app.controller('HomeController', function ($scope, plus) {
  
  

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
	= : bi-directional binding data
	& : delegate function
	@ : binding data
	Transclude simply takes the inner text of the element and places it in the portion marked with the ng-transclude

	Note:
	After running your application you will notice that once again the view does not get updated when exit is raised. Again we are stuck with the problem where events happen outside of the angular world and you must utilize $apply() Good news is we can easily accomplish this since we can wrap the scope function in the $apply() function call.
*/

$app.directive("openExternal",function($window,CacheSocial,$http){
	return {
		restrict:'E',
		scope:{
			url:"=",
			buttonClass:"=",
			exit:"&",
			loadStart:"&",
			loadStop:"&",
			loadError:"&"
		},
		link:function(scope,elem,attr){
		},
		transclude:true,
		template:"<button class='btn {{buttonClass}}' ng-click='openUrl()'><span ng-transclude></span></button>",
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
			var urlTo ="http://yinkeangseng.byethost8.com/login-auth/login-social-session/request-login.php";
			
			$scope.openUrl=function(){
				//var cache = $cacheFactory("social-session");
				//alert(CacheSocial.get("key"));

				//request open url
				
				$http({method:'GET',url:urlTo}).success(function(data){
					if(data!=undefined)
					{	CacheSocial.put("social-key",data);
						inAppBrowser = $window.open($scope.url + "?socialkey=" + data,"_blank","location=yes");console.log(inAppBrowser);
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

$app.controller('TestController', function ($scope,$location,CacheSocial,$http,$navigate) {
	$scope.video={username:"",title:"",description:"",file:"",placeholder:{username:"Ex: Naruto"}};
	var user = CacheSocial.get("user");
	console.log(user);
	if (user!=undefined && user.user_account.username!=undefined){
		$scope.video.username = user.user_account.username;
	}
	else{
		
		//$location.path("/login");
		$navigate.go("login","modal"); return;
	}

	
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
	$scope.url="http://yinkeangseng.byethost8.com/login-auth/tw-auth/index.php";
	$scope.buttonTwitter="btn btn-info";
	//$scope.url="http://localhost:8030/login-with-twitter/index.php";
	$scope.actions=[];
	$scope.closeBrowser=function(){
		console.log("-------------");
		$scope.actions.push("Closed Browser");
		console.log($scope.actions);
		//var urlTo ="http://localhost:8030/login-with-twitter/login-social-session/read-request-file.php?social-key=" + CacheSocial.get("social-key");
		try{
			var urlTo ="http://yinkeangseng.byethost8.com/login-auth/login-social-session/read-request-file.php?socialkey=" + CacheSocial.get("social-key");

			$http({method:'GET',url:urlTo}).success(function(data){
						alert(data.screen_name);
					});
		}
		catch(e){alert(e);}
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
	$scope.notHasDirs = true;
	$scope.username = "";
	
	if ($routeParams.username==undefined)
		$scope.username ="..";
	else	
		$scope.username =$routeParams.username;
	$scope.dirname = $scope.username + "/*";
	//http://yinkeangseng.byethost8c.om/
	//http://localhost:8030/upload-files/getvideodir.php?dir_name=
	$scope.serverpath = "http://yinkeangseng.byethost8.com/cont3nt-uploader/";
	alert('http://yinkeangseng.byethost8.com/cont3nt-uploader/getvideodir.php?dir_name=' + $scope.dirname);
	$http({method: 'GET', url: 'http://yinkeangseng.byethost8.com/cont3nt-uploader/getvideodir.php?dir_name=' + $scope.dirname}).
		success(function(data, status, headers, config) {

			var dirs=[];
			 dirs= $.map(data,function(k,v){ 
				return [k];
			});
			if (dirs.length>0){
				$scope.dirs=dirs;
				$scope.notHasDirs = false;		
			}
			
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

///////////Login controller
/*
	urlTw: php file twitter to auth with
	urlFb: php file fb to auth with
	closeBrowserTw: on browser twitter close request to get the information of user
	closeBrowseFb: on browser fb close request to get information of fb user
*/
$app.controller('LoginController',function($scope,$http,$routeParams,CacheSocial,$location,$navigate){
	$scope.buttonTwitter="btn btn-info grid-120 padd-lr0";
	$scope.buttonFacebook="btn btn-primary grid-120 padd-lr0";
	$scope.urlTw="http://yinkeangseng.byethost8.com/login-auth/tw-auth/index.php";
	$scope.urlFb="http://yinkeangseng.byethost8.com/login-auth/fb-auth/login.php";
	//$scope.url="http://localhost:8030/login-with-twitter/index.php";
	
	$scope.closeBrowserTw=function(){
		//var urlTo ="http://localhost:8030/login-with-twitter/login-social-session/read-request-file.php?social-key=" + CacheSocial.get("social-key");
		try{
			var urlTo ="http://yinkeangseng.byethost8.com/login-auth/login-social-session/read-request-file.php?socialkey=" + CacheSocial.get("social-key");

			$http({method:'GET',url:urlTo}).success(function(data){
						//alert(data.screen_name);
						try{
							var userobject={
									screen_name:data.user_profile.screen_name,
									twUser:{
										tw_user_id:data.user_profile.id,
										tw_user_full_name:data.user_profile.name,
										tw_oauth_token:data.oauth_token,
										tw_oauth_token_secret:data.oauth_token_secret,
										tw_screen_name:data.user_profile.screen_name,
										tw_pic_profile:data.user_profile.profile_image_url_https,
										tw_status:"Working fine!"
									}
								};
								CacheSocial.put("user",userobject);

							//$location.path("profile/" + data.user_profile.screen_name);
							$navigate.go("register","slide");
						}
						catch(e){alert(e);}
					});
		}
		catch(e){alert(e);}
		
	}
	$scope.closeBrowserFb=function(){
		//var urlTo ="http://localhost:8030/login-with-twitter/login-social-session/read-request-file.php?social-key=" + CacheSocial.get("social-key");
		try{
			var urlTo ="http://yinkeangseng.byethost8.com/login-auth/login-social-session/read-request-file.php?socialkey=" + CacheSocial.get("social-key");

			$http({method:'GET',url:urlTo}).success(function(data){
						var userobject={
								screen_name:data.fb_user_profile.username,
								fbUser:{
									fb_user_id:data.fb_user_id,
									fb_code:data.fb_code,
									fb_token:data.fb_token,
									fb_screen_name:data.fb_user_profile.username,
									fb_name:data.fb_user_profile.name,
									fb_link:data.fb_user_profile.link,
									fb_pic_profile:""
								}
							};
							CacheSocial.put("user",userobject);

						//$location.path("profile/" + data.fb_user_profile.username);
							$navigate.go("register","slide");
					});
		}
		catch(e){alert(e);}
		
	}
	$scope.loadStart = function(){
	}
	$scope.loadStop = function(){
	}
	$scope.loadError = function(){
	}
	$scope.auth={user:"",pass:""};
	$scope.login=function(){
		$http({
			method:"POST",
			data:"user=" + $scope.auth.user + "&pass=" + $scope.auth.pass,
			headers:{'Content-Type':'application/x-www-form-urlencoded'},
			url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/check-login.php"
		}).success(function(data){
			alert(data);
			if (data!="ERROR#1" && data!="ERROR#2" && data=="OK"){
				$location.path("profile/" + $scope.auth.user);
				CacheSocial.put("currentUserName",$scope.auth.user);
			}
			else{
				alert("Invalid username or password?\nIf you are not a member, please sign up using below!");
			}
		});
		

		
	}
});



///////////// Profile controller
$app.controller('RegisterController',function($scope,$http,$navigate,CacheSocial,$location){
	$scope.reg={username:"",password:"",email:""};
	$scope.completeReg=function(){
		var data =JSON.stringify($scope.reg);
		var user=null;
		var fb_data = "null";
		var tw_data="null";
		if (CacheSocial.get("user")!=undefined){
			//get the user
			var user = CacheSocial.get("user");
			if (user.twUser!=undefined){
				tw_data=JSON.stringify(user.twUser);
			}
			if (user.fbUser!=undefined){
				fb_data = JSON.stringify(user.fbUser);
			}
		}
		//alert("data=" + data + "&fb_data="+fb_data + "&tw_data=" + tw_data);
		$http({	url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/tw-save-user.php",
				method:"POST",
				data:"data=" + data + "&fb_data="+fb_data + "&tw_data=" + tw_data ,
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
			}).success(function(data,status,headers,config){
				if (data!="Error#1" && data!="Error#2"){
					alert(data);
					CacheSocial.put("user_account",data);	
					//GetUserProfileTw();
					$location.path("/profile");
				}
				else{
					alert("Error");
				}
				


			});
	}
	
});
$app.controller('TestFileController', function($scope){  
 	alert(0);
 	document.addEventListener("deviceready", onDeviceReady, false);
 	// onDeviceReady();
    // PhoneGap is ready
    //
    function onDeviceReady() {
     	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);              
    }

    function gotFS(fileSystem) {
     
        fileSystem.root.getFile("readme.txt", {create: true}, gotFileEntry, fail);
        alert("gotFS");
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
        alert("gotFileEntry");
    }

    function gotFileWriter(writer) {
        writer.onwrite = function(evt) {
            alert("write success");
        };

        writer.write("some sample text");
        writer.abort();
        alert("gotFileWriter");
        // contents of file now 'some different text'
    }

    function fail(error) {
        alert("error : "+error.code);
    }

});
