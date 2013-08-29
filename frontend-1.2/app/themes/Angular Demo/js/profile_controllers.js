///////////// Profile controller
$app.controller('ProfileController',function($scope,$http,$routeParams,CacheSocial,$location){
	$scope.setShowProfilesLoading=function(fnShow){
		$scope.showProfilesLoading = fnShow;
	}
	$scope.setHideProfilesLoading=function(fnHide){
		$scope.hideProfilesLoading = fnHide;
	}
	$scope.showProfilesLoading=function(){}
	$scope.hideProfilesLoading=function(){}
	
	
		   

	$scope.users=[];
	
	GetAllUserProfiles("");

	///#region profile all
	$scope.scroller={height:400,mystyle:{height:"auto"}};
	$scope.search={username:""};
	$scope.viewprofile=function(username){
		$navigate.go("profile/" + username ,"slide");
	}
	$scope.search=function(username){
		$scope.showProfilesLoading();
		GetAllUserProfiles(username);
		$scope.scroller.height = 800;
		$scope.scroller.mystyle = {height:"800px"};
	}
	function GetAllUserProfiles(username){
		if(username==undefined)
			username="";
		$http({	url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/get-profile.php?user=" + username,
			method:"GET"
		}).success(function(data,status,headers,config){
			//alert(data);
			$scope.users = data;$scope.hideProfilesLoading();
			
		});
	}
	

	
});


///////////// Profile controller
$app.controller('ProfileUserController',function($scope,$http,$routeParams,CacheSocial,$location,$window){

	//function accesss loaing
	/*$scope.setShowBig=function(fnShow){
		$scope.show = fnShow;
	}
	$scope.setHideBig=function(fnHide){
		$scope.hide = fnHide;
	}
	$scope.show=function(){}
	$scope.hide=function(){}*/

	//function accesss loading
	$scope.setShowStatusesLoading=function(fnShow){
		$scope.showStatusLoading = fnShow;
	}
	$scope.setHideStatusesLoading=function(fnHide){
		$scope.hideStatusLoading = fnHide;
	}
	$scope.showStatusLoading=function(){}
	$scope.hideStatusLoading=function(){}

	$scope.setShowProfileLoading=function(fnShow){
		$scope.showProfileLoading = fnShow;
	}
	$scope.setHideProfileLoading=function(fnHide){
		$scope.hideProfileLoading = fnHide;
	}
	$scope.showProfileLoading=function(){}
	$scope.hideProfileLoading=function(){}

	$scope.isOwnUser = false;

	$scope.isOwnUser = (CacheSocial.get("currentUserName")!=undefined && CacheSocial.get("currentUserName")==$routeParams.user);



	var myScroll=null;

	$scope.user={name:"",photopath:"",bod:"",tweets:[]};
	var user=null;
	$scope.fb_say_class = "hide";
	$scope.tw_say_class = "hide";

	$scope.users=[];
	//if move to current user
	if ($routeParams.user!=undefined){
		
		$http({	url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/cont3nt-get-user.php?user=" + $routeParams.user,
			method:"GET"
		}).success(function(data,status,headers,config){
			if (data!="Error#1" && data!="Error#2"){
				//alert(data);
				if (CacheSocial.get("currentUserName")==data.user_account.username){
					CacheSocial.put("user",data);		
				}
				//CacheSocial.put("user_account",data);	
				GetUserProfileTw(data);
				user = data;

			}
			else{
				alert("Error");
				$location.path("/login");
			}
		});
	}
	
	
	///#region profile individual
	/* user_account{user_account,tw_user_account,fb_user_account} ,
		tmpCurrentUserProfile: for display data
	*/
	function GetUserTweet(user_account){
		//get user tweets
		$http({
			url:"http://yinkeangseng.byethost8.com/social-say/tw-get-tweets.php",
			data:"akey=" + user_account.tw_user_account.tw_oauth_token + "&akey_secret=" + user_account.tw_user_account.tw_oauth_token_secret + "&twitter_id=" + user_account.tw_user_account.tw_screen_name,
			method:"POST" ,
			headers:{'Content-Type':'application/x-www-form-urlencoded'}
		}).success(function(data){
			//alert(data.length);
			$scope.user.tweets=data;
			//update scrolllist
			if ($scope.user.tweets.length<=0){
				$scope.user.tweets.push({created_at:'NULL',text:'No Message!'});
			}
			$scope.hideStatusLoading();

			
		});
	}
	function GetUserPost(user_account){




		//get user tweets
		$http({
			url:"http://yinkeangseng.byethost8.com/login-auth/fb-auth/fb-user-wall.php",
			data:"username=" + user_account.fb_user_account.fb_screen_name + "&token=" + user_account.fb_user_account.fb_token,
			method:"POST" ,
			headers:{'Content-Type':'application/x-www-form-urlencoded'}
		}).success(function(data){
			if (isObject(data)==false){
				//require user login
				CallingSimpleLogin();
			}
			else{
				$scope.user.tweets = [];
				angular.forEach(data.data,function(value,key){
					$scope.user.tweets.push({created_at:value.updated_time,text:value.message});
					//console.log($scope.user.tweets);
				});
				//alert($scope.user.tweets.length);
				if ($scope.user.tweets.length<=0){
					$scope.user.tweets.push({created_at:'NULL',text:'No Message!'});
				}
				$scope.hideStatusLoading();
			}
			

			//update scrolllist
			
			
		});
	}
	function GetUserProfileTw(user_account){
		
		if (user_account!=undefined && user_account.user_account.priority_social=="tw" && user_account.tw_user_account!=undefined){
			
			$http({	url:"http://yinkeangseng.byethost8.com/social-say/tw-user-profile.php?username=cont3nt",
					method: "POST",
					data:"akey=" + user_account.tw_user_account.tw_oauth_token + "&akey_secret=" + user_account.tw_user_account.tw_oauth_token_secret, 
					headers:{'Content-Type':'application/x-www-form-urlencoded'}

				}).success(function(data){
					
					SetUserProfileToUI(data);
					$scope.tw_say_class = "";
					//stored data temp with name username_current_profile for caching data for faster read
					$scope.hideProfileLoading();
				});
			GetUserTweet(user_account);
			
		}
		else if (user_account!=undefined && user_account.user_account.priority_social=="fb" && user_account.fb_user_account!=undefined){
			//alert("User Priority is facebook");
			$http({	url:"http://yinkeangseng.byethost8.com/login-auth/fb-auth/fb-user-profile.php",
					method: "POST",
					data:"username=" + user_account.fb_user_account.fb_screen_name + "&token=" + user_account.fb_user_account.fb_token, 
					headers:{'Content-Type':'application/x-www-form-urlencoded'}

				}).success(function(data){

					//alert(data);
					SetUserProfileToUIFb(data);
					$scope.fb_say_class = "";
					$scope.hideProfileLoading();
					//stored data temp with name username_current_profile for caching data for faster read

				});
			GetUserPost(user_account);
		}
		else{
			alert("User Account is undefined!");
			$location.path("login");
		}
	}
	isObject = function(a) {
	    return (!!a) && (a.constructor === Object);
	};
	function SetUserProfileToUI(tw_user){
		//alert(tw_user+ "-");
		$scope.user.name = tw_user["name"];
		$scope.user.photopath=tw_user.profile_image_url_https;
		$scope.user.bod="21 05 1992";
		
		//alert("Set user profile complete!");
	}
	function SetUserProfileToUIFb(fb_user){
		//alert(tw_user+ "-");
		$scope.user.name = fb_user.name;
		$scope.user.photopath=fb_user.picture.data.url;
		$scope.user.bod="21 05 1992";
		
		//alert("Set user profile complete!");
	}
	
	
	
	 $scope.say ="Say";

	 $scope.tw_say=function(say){
	 	
	 	if (user!=undefined && user.user_account.priority_social=="tw" && user.tw_user_account!=undefined){
	 		
	 		var message = say;	
	 		var akey = user.tw_user_account.tw_oauth_token ;
	 		var akey_secret=user.tw_user_account.tw_oauth_token_secret ;
	 
			$http({
				method:"GET",url:"http://yinkeangseng.byethost8.com/social-say/tw-say.php?akey="+akey +"&akey_secret="+akey_secret +"&message="+message}).success(function(data){
	 			GetUserTweet(user);
	 		});
	 	}
	 	else{
	 		alert("User has not sign up with his twitter yet!");
	 	}
	 }
	 $scope.fb_say=function(say){
	 	if (user!=undefined && user.user_account.priority_social=="fb" && user.fb_user_account!=undefined){
	 		var message = say;	

	 		$http({	url:"http://yinkeangseng.byethost8.com/login-auth/fb-auth/publish-say.php",
					method: "POST",
					data:"username=" + user.fb_user_account.fb_screen_name + "&token=" + user.fb_user_account.fb_token + "&post_message=" + message, 
					headers:{'Content-Type':'application/x-www-form-urlencoded'}

				}).success(function(data){
					alert(data);
					GetUserPost(user);
					//stored data temp with name username_current_profile for caching data for faster read

				});
	 	}
	 	else{
	 		alert("User has not sign up with his facebook yet or this functionality is not completed!");
	 	}
	 }
	
	function CallingSimpleLogin(){
		var inAppBrowser = $window.open("http://yinkeangseng.byethost8.com/login-auth/fb-auth/simple-login.php","_blank","location=yes");console.log(inAppBrowser);
		
		//set on exit event
		if ($scope.exit instanceof Function){
			
			inAppBrowser.addEventListener("exit",wrappedFunction($scope.exit));
		}
		
	}
	$scope.onSimpleLoginComplete=function () {
		
		GetUserPost(user);
	}
});