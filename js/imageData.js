var canvas_width = window.innerWidth / 2 - 2;
var canvas_height = 200;
window.onload = function() {
	var image = new Image();
	$(".canvas_finish").css("width", canvas_width);
	$(".canvas_width").css("height", canvas_height);
	var canvas_before = $("#canvas_before")[0];
	canvas_before.width = canvas_width;
	canvas_before.height = canvas_height;
	var before_ctx = canvas_before.getContext('2d');
	var canvas_after = $('#canvas_after')[0];
	canvas_after.width = canvas_width;
	canvas_after.height = canvas_height;
	var after_ctx = canvas_after.getContext('2d');
	$(".choose_image").change(function() {
		var file = $(".choose_image").get(0).files[0];
		if (!/image\/\w+/.test(file.type)) {
			alert("文件必须为图片！");
			return false;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			image.src = this.result;
		}
	})
	image.onload = function() {
		before_ctx.drawImage(image, 0, 0, canvas_before.width, canvas_before.height);
	}
	gray(before_ctx, after_ctx);
	blorwh(before_ctx, after_ctx);
	contrary(before_ctx, after_ctx);
	vague(before_ctx, after_ctx);
	masic(before_ctx, after_ctx);
}

function gray(before_ctx, after_ctx) {
	var before_width = $("#canvas_before")[0].width;
	var before_height = $("#canvas_before")[0].height;
	var after_width = $("#canvas_after")[0].width;
	var after_height = $("#canvas_after")[0].height;
	$(".gray").on("click", function() {
		var imagedata = before_ctx.getImageData(0, 0, before_width, before_height);
		var pixldata = imagedata.data;
		for (var i = 0; i < canvas_after.width * canvas_after.height; i++) {
			var r = pixldata[4 * i + 0];
			var g = pixldata[4 * i + 1];
			var b = pixldata[4 * i + 2];
			var gray = r * 0.3 + g * 0.59 + b * 0.11
			pixldata[4 * i + 0] = gray;
			pixldata[4 * i + 1] = gray;
			pixldata[4 * i + 2] = gray;
		}
		after_ctx.putImageData(imagedata, 0, 0);
		var strDataURI = canvas_after.toDataURL("image/jpeg");
		$(".canvas_finish").attr("src", strDataURI);
	})
}

function blorwh(before_ctx, after_ctx) {
	var before_width = $("#canvas_before")[0].width;
	var before_height = $("#canvas_before")[0].height;
	var after_width = $("#canvas_after")[0].width;
	var after_height = $("#canvas_after")[0].height;

	$(".blorwh").on("click", function() {
		var imagedata = before_ctx.getImageData(0, 0, before_width, before_height);
		var pixldata = imagedata.data;

		for (var i = 0; i < canvas_after.width * canvas_after.height; i++) {
			var r = pixldata[4 * i + 0];
			var g = pixldata[4 * i + 1];
			var b = pixldata[4 * i + 2];
			var gray = r * 0.3 + g * 0.59 + b * 0.11
			if (gray > 255 / 2) {
				v = 255
			} else {
				v = 0
			}
			pixldata[4 * i + 0] = v;
			pixldata[4 * i + 1] = v;
			pixldata[4 * i + 2] = v;
		}
		after_ctx.putImageData(imagedata, 0, 0);
		var strDataURI = canvas_after.toDataURL("image/jpeg");
		$(".canvas_finish").attr("src", strDataURI);
	})
}

function contrary(before_ctx, after_ctx) {
	var before_width = $("#canvas_before")[0].width;
	var before_height = $("#canvas_before")[0].height;
	var after_width = $("#canvas_after")[0].width;
	var after_height = $("#canvas_after")[0].height;

	$(".contrary").on("click", function() {
		var imagedata = before_ctx.getImageData(0, 0, before_width, before_height);
		var pixldata = imagedata.data;

		for (var i = 0; i < canvas_after.width * canvas_after.height; i++) {
			var r = pixldata[4 * i + 0];
			var g = pixldata[4 * i + 1];
			var b = pixldata[4 * i + 2];
			pixldata[4 * i + 0] = 255 - r;
			pixldata[4 * i + 1] = 255 - g;
			pixldata[4 * i + 2] = 255 - b;
		}
		after_ctx.putImageData(imagedata, 0, 0);
		var strDataURI = canvas_after.toDataURL("image/jpeg");
		$(".canvas_finish").attr("src", strDataURI);
	})
}

function vague(before_ctx, after_ctx) {
	var before_width = $("#canvas_before")[0].width;
	var before_height = $("#canvas_before")[0].height;
	var after_width = $("#canvas_after")[0].width;
	var after_height = $("#canvas_after")[0].height;
	$(".vague").on("click", function() {
		var tmpImageData = before_ctx.getImageData(0, 0, before_width, before_height)
		var tmpPixelData = tmpImageData.data
		var imageData = before_ctx.getImageData(0, 0, before_width, before_height)
		var pixelData = imageData.data
		var blurR = 3
		var totalnum = (2 * blurR + 1) * (2 * blurR + 1)
		for (var i = blurR; i < canvas_after.height - blurR; i++)
			for (var j = blurR; j < canvas_after.width - blurR; j++) {
				var totalr = 0,
					totalg = 0,
					totalb = 0
				for (var dx = -blurR; dx <= blurR; dx++)
					for (var dy = -blurR; dy <= blurR; dy++) {
						var x = i + dx
						var y = j + dy
						var p = x * canvas_after.width + y
						totalr += tmpPixelData[p * 4 + 0]
						totalg += tmpPixelData[p * 4 + 1]
						totalb += tmpPixelData[p * 4 + 2]
					}
				var p = i * canvas_after.width + j
				pixelData[p * 4 + 0] = totalr / totalnum
				pixelData[p * 4 + 1] = totalg / totalnum
				pixelData[p * 4 + 2] = totalb / totalnum
			}
		after_ctx.putImageData(imageData, 0, 0, 0, 0, canvas_after.width, canvas_after.height)
		var strDataURI = canvas_after.toDataURL("image/jpeg");
		$(".canvas_finish").attr("src", strDataURI);
	})
}
function masic(before_ctx, after_ctx) {
	var before_width = $("#canvas_before")[0].width;
	var before_height = $("#canvas_before")[0].height;
	var after_width = $("#canvas_after")[0].width;
	var after_height = $("#canvas_after")[0].height;
	$(".mosaic").on("click", function() {
		var tmpImageData = before_ctx.getImageData(0, 0, before_width, before_height);
		var tmpPixelData = tmpImageData.data;
		var imageData = before_ctx.getImageData(0, 0, before_width, before_height);
		var pixelData = imageData.data;
		var size = 16;
		var totalnum = size * size;
		for (var i = 0; i < canvas_after.height; i += size)
			for (var j = 0; j < canvas_after.width; j += size) {
				var totalr = 0,
					totalg = 0,
					totalb = 0
				for (var dx = 0; dx < size; dx++)
					for (var dy = 0; dy < size; dy++) {
						var x = i + dx;
						var y = j + dy;
						var p = x * canvas_after.width + y;
						totalr += tmpPixelData[p * 4 + 0];
						totalg += tmpPixelData[p * 4 + 1];
						totalb += tmpPixelData[p * 4 + 2];
					}
				var p = i * canvas_after.width + j;
				var resr = totalr / totalnum;
				var resg = totalg / totalnum;
				var resb = totalb / totalnum;
				for (var dx = 0; dx < size; dx++)
					for (var dy = 0; dy < size; dy++) {
						var x = i + dx;
						var y = j + dy;
						var p = x * canvas_after.width + y;
						pixelData[p * 4 + 0] = resr;
						pixelData[p * 4 + 1] = resg;
						pixelData[p * 4 + 2] = resb;
					}
			}
		after_ctx.putImageData(imageData, 0, 0, 0, 0, after_width, after_height);
		var strDataURI = canvas_after.toDataURL("image/jpeg");
		$(".canvas_finish").attr("src", strDataURI);
	})
}