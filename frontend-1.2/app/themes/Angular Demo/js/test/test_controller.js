'use strict';


	$app.controller('testController',function($scope,plus){
		
	});
	
	$app.controller('usingDirective',function($scope){
		$scope.title="This is the Angular Tesing Directive";
		$scope.des="directive allow you to create vocabulary word of html by costomize your attribute , class , tag and comment";
		
		angular.module('myDirective',[]).directive('zippy',function(){
			
			return {
				
				restrict:'C',
				replace:true,
				transclude:true,
				scope:{ title:'@zippyTitle' },
				template:	'<div>' +		
								'<div class="title span12"> {{title}} </div>' + 
								'<div class="body span12" ng-transclude> </div>' +
							'</div>',
				link:function(scope,element,attrs){
					//title element
					var title=angular.element(element.children()[0]),
						//open and close state
						opened=true;
					// click on title to close or open
					title.on('click',toggle);
					
					function toggle(){
						opened=!opened;
						element.removeClass(opened?'closed':'opened');
						element.addClass(opened?'opened':'closed');
					}
					toggle();
				}
			}
		});
	});
