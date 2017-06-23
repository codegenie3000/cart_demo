/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 6/19/2017.
 */

$('.delete-button').click(function(e) {
	debugger;
	e.preventDefault();
	var re = /delete(\S*)/;
	var id = re.exec(this.id)[1];
	$.ajax('/cart/delete_product/', {
		success: function (data) {
			console.log(data);
		}
	});
});