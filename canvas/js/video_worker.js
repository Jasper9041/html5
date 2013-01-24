
importScripts("utils_video.js");

self.console = {
	log: function (message) {
		self.postMessage({
			type: "info",
			data: message
		});
	}
};

self.filter = function (frame, mode, filter, params) {
	var data = utils.video.apply_filter(frame, mode, filter, params);
	
	self.postMessage({
		type: 'frame',
		frame: data
	});
}

self.addEventListener("message", function (e) {
	if (!e.data || !e.data.type) { return; }
	switch (e.data.type) {
		case "filter":
			filter(e.data.frame,e.data.mode,e.data.filter,e.data.params);
			break;
	}

}, false);