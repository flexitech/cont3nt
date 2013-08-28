///////////// Profile controller
$app.controller('ProfileController',function($scope,$http,$routeParams,CacheSocial,$location){

	
	
		   

	$scope.users=[];
	
	GetAllUserProfiles("");

	///#region profile all
	$scope.scroller={height:400,mystyle:{height:"auto"}};
	$scope.search={username:""};
	$scope.viewprofile=function(username){
		$navigate.go("profile/" + username ,"slide");
	}
	$scope.search=function(username){
		GetAllUserProfiles(username);
		$scope.scroller.height = 800;
		$scope.scroller.mystyle = {height:"800px"};
	}
	function GetAllUserProfiles(username){
		$http({	url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/get-profile.php?user=" + username,
			method:"GET"
		}).success(function(data,status,headers,config){
			//alert(data);
			$scope.users = data;
			
		});
	}
	

	
});


///////////// Profile controller
$app.controller('ProfileUserController',function($scope,$http,$routeParams,CacheSocial,$location){
	var myScroll=null;

	$scope.user={name:"",photopath:"",bod:"",tweets:[]};
	var user=null;
	$scope.fb_say_class = "hide";
	$scope.tw_say_class = "";

	$scope.users=[];
	//if move to current user
	if ($routeParams.user!=undefined){
		
		$http({	url:"http://yinkeangseng.byethost8.com/cont3nt/reg/v_001/cont3nt-get-user.php?user=" + $routeParams.user,
			method:"GET"
		}).success(function(data,status,headers,config){
			if (data!="Error#1" && data!="Error#2"){
				//alert(data);
				//CacheSocial.put("user_account",data);	
				GetUserProfileTw(data);
				user = data;

			}
			else{
				alert("Error");
				$location.path("login");
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
					//stored data temp with name username_current_profile for caching data for faster read

				});
			GetUserTweet(user_account);
			
		}
		else if (user_account!=undefined && user_account.user_account.priority_social=="fb" && user_account.fb_user_account!=undefined){
			alert("User Priority is facebook");
			$http({	url:"http://yinkeangseng.byethost8.com/login-auth/fb-auth/fb-user-profile.php",
					method: "POST",
					data:"username=" + user_account.fb_user_account.username + "&token=" + user_account.fb_user_account.fb_token, 
					headers:{'Content-Type':'application/x-www-form-urlencoded'}

				}).success(function(data){
					alert(data);
					SetUserProfileToUIFb(data);
					//stored data temp with name username_current_profile for caching data for faster read

				});
			GetUserTweet(user_account);
		}
		else{
			alert("User Account is undefined!");
			$location.path("login");
		}
	}
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
	 $scope.fb_say=function(){
	 	alert("User has not sign up with his facebook yet or this functionality is not completed!");
	 }
	
});