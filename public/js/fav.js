
$(document).ready(function() {

	var promise = getFavMemes();
	//if success, render received data 
	promise.success(function(data) {
		renderData(data);
	});

});

function getFavMemes() {

	//return the ajax data 
	return $.ajax({
		url: '/api/favorites',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Cannot get data. Try refresh?");
		},
		success: function(data){
			console.log("Got fav data");
		}
	});
}

function renderData(dataArray) {

	for (var i=0; i<dataArray.length; ++i) {
		$("#demoArea").append("<div class='demos'> <img class='imgArea' src=' " + dataArray[i].doc.memeInfo.link + " '>" + 
			"<div class='author'>Created By: " + dataArray[i].doc.username + "</div>"+
			"<div class='caption'>Original Caption: " + dataArray[i].doc.memeInfo.caption + "</div></div>");

			var item = dataArray[i].doc.memeInfo;

			//adjust img size 
			$(".imgArea").attr("width" , 400); 
			$(".imgArea").attr("height" , 400*1.0*item.height*1.0/item.width*1.0);
	}

}
