var app = angular.module('usys',[]);

app.service('$validator',function(){

	this.eMessage = {
		invalidFile	: "This is not a js or css file",
		NotUrl			:	"Invalid url",
		NoConnection: "Check your Internet's connection"
	};

	this.fileId = function(url){
		this.stringsV = [{finder	:	".js"},{finder:	".css"}]
		var ret = false;
		var tru = -1;
		angular.forEach(this.stringsV,function(v,k){
			tru = url.indexOf(v.finder);
			if(tru > 0){
				ret = v.finder;
				slash = url.lastIndexOf("/");
				slic = url.slice(slash+1,url.length);
			}
		});
		if(ret !== false){
			return [ret,slic];
		}else{
			return false;
		}
	}

	this.urlC = function(status,errTarget,url,eMessage){
		if(status === 'ok'){
			var fType = this.fileId(url);
			$('.error').hide();
			if(fType === false){
				this.urlC("Something is wrong",errTarget,url,this.eMessage.invalidFile);
				return false;
			}else{
				return fType;
			}
		}else{
			errTarget = errTarget.toString();
			$('#'+errTarget+'.error').text(eMessage).show();
			return false;
		}
	}

});

app.controller('urlCTRL',function($scope,$http,$validator,$sce){

	var jsT = {
		first : '<script type="text/javascript" src="',
		second:	'"></script>'
	};
	var cssT = {
		first : '<script type="text/css" rel="stylesheet" src="',
		second:	'" />'
	};

	if(!$scope.url){
		$scope.url = [{text:'',id:0,del:false,disabled:false,type:'',tag:''}];
	}

	$scope.validate = function(){
		$http({method:'POST',url:'/urlGetter',data:{url:$scope.url[$scope.url.length-1].text}})
				.success(function(data,status,headers,config){
					console.log('ok');
					var valid = $validator.urlC('ok',$scope.url[$scope.url.length-1].id,$scope.url[$scope.url.length-1].text);
					if(valid !== false){
						$scope.url[$scope.url.length-1].disabled = true;
						$scope.url[$scope.url.length-1].type = valid[0];
						if(valid[0] === ".js"){
							$scope.url[$scope.url.length-1].tag = jsT.first + valid[1] + jsT.second;
						}else{
							$scope.url[$scope.url.length-1].tag = cssT.first + valid[1] + cssT.second;
						}
						$scope.url.push({text:$scope.url.text,id:$scope.url[$scope.url.length-1].id+1,del:false,disabled:false});
					}
				})
				.error(function(data,status,headers,cnfig){
					console.log('Something is wrong');
					if($scope.url[$scope.url.length-1].text===undefined){
						$scope.url = $scope.url.slice(0,$scope.url.length-1);
					}
					$validator.urlC('Not found',$scope.url[$scope.url.length-1].id,$scope.url[$scope.url.length-1].text,$validator.eMessage.NotUrl);
				});
	};

/*	$scope.validate = function(){
		var action = $scope.check();
		if(action){
					console.log('ok');
					var valid = $validator.urlC('ok',$scope.url[$scope.url.length-1].id,$scope.url[$scope.url.length-1].text);
					if(valid !== false){
						$scope.url[$scope.url.length-1].disabled = true;
						$scope.url[$scope.url.length-1].type = valid[0];
						if(valid[0] === ".js"){
							$scope.url[$scope.url.length-1].tag = jsT.first + valid[1] + jsT.second;
						}else{
							$scope.url[$scope.url.length-1].tag = cssT.first + valid[1] + cssT.second;
						}
						$scope.url.push({text:$scope.url.text,id:$scope.url[$scope.url.length-1].id+1,del:false,disabled:false});
					}

		}else{//console.log($scope.url[$scope.url.length-1].text);
					console.log('Something is wrong');
					if($scope.url[$scope.url.length-1].text===undefined){
						$scope.url = $scope.url.slice(0,$scope.url.length-1);
					}
					$validator.urlC('Not found',$scope.url[$scope.url.length-1].id,$scope.url[$scope.url.length-1].text,$validator.eMessage.NotUrl);

		}
	}

	$scope.check = function(){
		var key = (+new Date) + "" + Math.random();
//		console.log($scope.url[$scope.url.length-1].text);
		$scope.urli = $sce.trustAsResourceUrl($scope.url[$scope.url.length-1].text);
		
		$('#ifr')[0].onload = function(){
			alert('passed');
		}console.log($('#ifr'));
			if($('#if').children!==undefined){
				console.log('asd');
			}else{console.log('sss');}
			var global = $('#ifr')[0].contentWindow;
			global[key] = "asd";
		if(global[key]==="asd"){
			return true;
		}else{
			return false;
		}
		try {
			var global = $('#ifr')[0].contentWindow;
			global[key] = "asd";
			return global[key] === "asd";
		}
		catch (e){
			return false;
		}
	};*/

/*	$scope.urli = "sadasant.com/js/Shade.js";
	$scope.urli = $sce.trustAsResourceUrl($scope.urli);*/

	$scope.delet = function(id){
		angular.forEach($scope.url,function(v,k){
			if(v.id === id) v.del = true;
		});
		var oldUrl = $scope.url;
		$scope.url = [];
		angular.forEach(oldUrl,function(v,k){
			if(!v.del) $scope.url.push(v);
		});
	};

});
