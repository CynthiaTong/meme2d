
$(document).ready(function() {
	var promise = getFavMemes();

	promise.success(function(data) {
		console.log(data);
		renderData(data);
	});

});

function renderData(dataArray) {

	for (var i=0; i<dataArray.length; ++i) {
		$("#demoArea").append("<div class='demos'> <img class='imgArea' src=' " + dataArray[i].doc.memeInfo.link + " '>" + 
			"<div class='author'>Created By: " + dataArray[i].doc.username + "</div>"+
			"<div class='caption'>Original Caption: " + dataArray[i].doc.memeInfo.caption + "</div></div>");

			var item = dataArray[i].doc.memeInfo;

			$(".imgArea").attr("width" , 400); 
			$(".imgArea").attr("height" , 400*1.0*item.height*1.0/item.width*1.0);
	}

}
