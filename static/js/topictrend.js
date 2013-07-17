$(".navbar-inner").append('<div class="form-search pull-right"><input type="text" class="input-medium search-query"' +
	' id="topic-trend-search-text"><button class="btn" id="topic-trend-search">Search</button></div>');

var margin = {
	top: 1,
	right: 1,
	bottom: 6,
	left: 1
},
	width = 1280 - margin.left - margin.right,
	height = 1050 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
	format = function(d) {
		return formatNumber(d) + " TWh";
	},
	color = d3.scale.category20();

var chart = d3.select("#chart").append("svg")
	.attr("width", 50000) //width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)


var sankey = d3.sankey()
	.nodeWidth(50)
	.nodePadding(15)
	.size([width, 300]);

var path = sankey.link();

var area = d3.svg.area()
	.x(function(d) {
		return d.x;
	})
	.y0(function(d) {
		return d.y0;
	})
	.y1(function(d) {
		return d.y1;
	});

var y = d3.scale.linear()
	.range([height, 0]);

$("#chart").on({
	ajaxStart: function() {
		$(this).addClass("loading");
	},
	ajaxStop: function() {
		$(this).removeClass("loading");
	}
});

chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 350).attr("y2", 350).style("stroke", "darkgray").style("stroke-width", 1);

d3.select("#topic-trend-search").on("click", function(e) {
	render_topic($("#topic-trend-search-text").val(), 0, 10000); // parseInt($("#topic-trend-search-start").val()), parseInt($("#topic-trend-search-end").val()), parseInt($("#topic-trend-search-timewindow").val()));
})


// function resize_chart(){
//   d3.select("#chart").style("width", (window.width - 2 * 50)+"px");
// }

// resize_chart();
// window.onresize = resize_chart();
// render_topic("deep learning", 0, 10000);
// document.getElementById("topic-trend-search-text").value ="deep learning";
// document.getElementById("topic-trend-search-threshold").value =0.0001;

function render_people(q) {

}

function render_topic(q, start, end) {
	chart.remove();
	chart = d3.select("#chart").append("svg").attr("width", 1280) //width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg = chart.append("g")
	.attr("height", 350)
		.attr("id", "trend");

	chart.append("line").attr("x1", 0).attr("x2", width).attr("y1", 330).attr("y2", 330).style("stroke", "darkgray").style("stroke-width", 1);
	$("#chart").addClass("loading");

	d3.json("/academic/terms?q=" + q + "&start=" + start + "&end=" + end, function(energy) {
		$("#chart").removeClass("loading");
		$("#people-list").empty();

		energy.people.forEach(function(p) {
			$("#people-list").append('<div class="userinfo" ondblclick="do_select_user_nodes("2019264715")" onclick="set_highlight_user("2019264715")">' + '<span class="name">' + p.name + '</span><span class="info">' + '<span class="info-followers">' + p.pub_count + '</span>' + '<span class="info-posts">' + p.cite + '</span>' + '<span class="info-reposts">' + p.hindex + '</span></span></div>');
		});

		terms = {};
		energy.terms.forEach(function(t) {
			term = {};
			term.t = t.t;
			term.freq = t.freq;
			term.dist = t.dist;
			term.year = t.year;
			term.cluster = t.cluster;
			terms[t.t] = term;
		})

	
		var time_slides_dict = {};
		var time_slides_offset = {};
		energy.time_slides.forEach(function(time, i) {
			time.forEach(function(year, j) {
				time_slides_dict[year] = i;
				time_slides_offset[year] = j;
			})
		})

		var time_window = energy.time_slides[0].length;

		var x = function(year) {
			return (time_slides_dict[year] + ((1 / time_window) * time_slides_offset[year])) * 120
		}

		var axis = svg.append("g").selectAll(".axis")
			.data(energy.time_slides)
			.enter().append("g")
			.attr("class", "axis")
			.attr("transform", function(d, i) {
				return "translate(" + (i) * 120 + "," + 0 + ")";
			})

		axis.append("line")
			.attr("x1", function(d) {
				return 0;
			})
			.attr("x2", function(d) {
				return 0;
			})
			.attr("y1", function(d) {
				return 0;
			})
			.attr("y2", function(d) {
				return 1000;
			})
			.style("stroke", function(d) {
				return "lightgray";
			})
			.style("stroke-width", function(d) {
				return 1;
			})

		axis.append("text")
			.attr("x", -6)
			.attr("y", 10)
			.attr("dy", ".0em")
			.attr("text-anchor", "end")
			.attr("transform", null)
			.text(function(d, i) {
				return d[0];
			})
			.attr("x", 6)
			.attr("text-anchor", "start")
			.style("font-weight", "bold");

		sankey
			.nodes(energy.nodes)
			.links(energy.links)
			.items(energy.terms)
			.layout(32);

		var link = svg.append("g").selectAll(".link")
			.data(energy.links)
			.enter().append("path")
			.attr("class", "link")
			.attr("d", path)
			.style("stroke-width", function(d) {
				return 20
			})
			.style("fill-opacity", .6)
			.style("fill", function(d) {
				var key = "gradient-" + d.source_index + "-" + d.target_index;
				svg.append("linearGradient")
					.attr("id", key)
					.attr("gradientUnits", "userSpaceOnUse")
					.attr("x1", d.source.x + 50).attr("y1", 0)
					.attr("x2", d.target.x).attr("y2", 0)
					.selectAll("stop")
					.data([{
							offset: "0%",
							color: color(d.source.cluster)
						},
						{
							offset: "100%",
							color: color(d.target.cluster)
						}
					])
					.enter().append("stop")
					.attr("offset", function(d) {
						return d.offset;
					})
					.attr("stop-color", function(d) {
						return d.color;
					});
				return d.color = "url(#" + key + ")"; 
			})
			.sort(function(a, b) {
				return b.dy - a.dy;
			});

		link.append("title")
			.text(function(d) {
				return d.source.name + " → " + d.target.name;
			});

		var node = svg.append("g").selectAll(".node")
			.data(energy.nodes)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.call(d3.behavior.drag()
				.origin(function(d) {
					return d;
				})
				.on("dragstart", function() {
					this.parentNode.appendChild(this);
				})
				.on("drag", dragmove));

		node.append("rect")
			.attr("height", function(d) {
				return d.dy;
			})
			.attr("width", sankey.nodeWidth())
			.style("fill", function(d) {
				return d.color = color(d.cluster);
			})
			.style("stroke", function(d) {
				return d.color;
			}) //d3.rgb(d.color).darker(2); })
			.style("stroke-width", function(d) {
				return 0;
			}
			.style("opacity", function(d) {
				return 0.6;
			})
			.append("title")
			.text(function(d) {
				return d.name + "\n" + format(d.value);
			});

		node.append("text")
			.attr("x", -20)
			.attr("y", function(d) {
				return d.dy / 2;
			})
			.attr("text-anchor", "middle")
			.attr("transform", null)
			.text(function(d) {
				return d.name;
			})
			.style("fill", function(d) {
				return color(d.cluster);
			})
			.style("font-weight", "bold")
			.style("font", function(d) {
				var w = d.w;
				if (w > 15) {
					w = 15;
				}
				if (w < 10 && w > 0) {
					w = 10;
				}
				return (w) + "px sans-serif";
			});


		energy.terms.sort(function(a, b) {
			return b.start.year - a.start.year;
		})

		var item = svg.append("g").selectAll(".item")
			.data(energy.terms)
			.enter().append("g")
			.attr("class", "item")
			.attr("transform", function(d) {
				return "translate(" + x(d.start.year) + "," + (d.start.node.y + d.start.node.dy / 2) + ")";
			})

		item.append("circle")
			.attr("cx", function(d) {
				return 0;
			})
			.attr("cy", function(d) {
				return 0;
			})
			.attr("r", function(d) {
				return d.freq / 10;
			})
			.style("stroke-width", 1)
			.style("stroke", function(d) {
				return color(d.start.cluster);
			})
			.style("stroke-opacity", .5)
			.style("fill", function(d) {
				return color(d.start.cluster);
			})
			.style("display", "none")

		var index = -1;

		var bunch = chart.append("g")
			.attr("transform", function(d) {
				return "translate(" + [0, 350] + ")rotate(" + 0 + ")";
			})
			.selectAll(".bunch")
			.data(energy.terms)
			.enter()
			.append("g")
			.attr("class", "bunch")
			.attr("transform", function(d) {
				index++;
				return "translate(" + [0, 20 * index] + ")rotate(" + 0 + ")";
			})

		bunch.append("rect").attr("x", function(d) {
			return x(d.start.year);
		}).attr("y", function(d) {
			return 0;
		}).attr("height", 18).attr("width", 1000)
			.style("fill-opacity", 0.5)
			.style("fill", "#60aFe9");

		bunch.append("text")
			.attr("text-anchor", "end")
			.attr("transform", function(d) {
				return "translate(" + [x(d.start.year), 0] + ")rotate(" + 0 + ")";
			})
			.style("font-size", 15)
			.attr("dy", ".85em")
			.text(function(d) {
				return d.t;
			})


		dots = bunch.selectAll("g.key_dot")
			.data(function(d) {
				return d.doc;
			});
		dots.enter()
			.append("circle").attr("class", "key_dot")
			.attr("cx", function(d) {
				return x(energy.documents[d].year) + 6;
			})
			.attr("cy", function(d) {
				return 9;
			})
			.attr("r", function(d) {
				return 6;
			})
			.style("stroke-width", 1)
			.style("stroke", function(d) {
				return "#eee";
			})
			.style("opacity", .1)
			.style("fill", function(d) {
				return "orangered";
			})

		function dragmove(d) {
			d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
			sankey.relayout();
			link.attr("d", path);
		}

		var leftPos = $('#chart').scrollLeft();
		$("#chart").animate({
			scrollLeft: leftPos + 200
		}, 800);
	});
}