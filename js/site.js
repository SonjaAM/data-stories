var colors = ['#FF5722','#039BE5','#009688','#E91E63','#9C27B0','#D84315'];

$.ajax({
    url: 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1CieP74RcfofqdCNxJQSj6GVtuKEZUM9-EYT6HtPUh1Q/edit%23gid%3D0&strip-headers=on&force=on',
	dataType: 'json',
    success: function(data) {
        initGrid(data);
    }
});

hover = false;

// hxlProxyToJSON: reading hxl tags and setting them as keys for each event
// input is an array with hxl tags as first object, and then the data as objects
// output is an array with hxl tags as keys for the data objects

function hxlProxyToJSON(input) {
    var output = [];
    var keys = []
    input.forEach(function (e, i) {
        if (i == 0) {
            e.forEach(function (e2, i2) {
                var parts = e2.split('+');
                var key = parts[0]
                if (parts.length > 1) {
                    var atts = parts.splice(1, parts.length);
                    atts.sort();
                    atts.forEach(function (att) {
                        key += '+' + att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function (e2, i2) {
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}


function initGrid(data) {
    data = hxlProxyToJSON(data);
    console.log(data);
	generateGrid(data);
	generateButtons(data);
	var $grid;
	$('.container').imagesLoaded(function(){

		$grid =  $('#grid').isotope({
		  // options
		  itemSelector: '.grid-item',
		  layoutMode: 'fitRows',
		  masonry: {
      		columnWidth: '.grid-item'
    	  }
		});		
	});


	$('.filter-button-group').on( 'click', 'button', function() {
		$('.filterbutton').removeClass('highlight');
	    var filterValue = $(this).attr('data-filter');
	    $grid.isotope({ filter: filterValue });
	    $(this).addClass('highlight');
	});

}

function generateGrid(data) {

    data.forEach(function (d, i) {
        console.log("test1=", d,"test2=",i);
		var classes = 'grid-item';

		var html = '<div id="grid'+i+'" class="'+classes+'"><div class="inner"><img id="image'+i+'" src="'+d["#image"]+'" /><div id="overlay'+i+'" class="overlay">';
		html+='<h3 class="grid-title">'+d["#title"]+'</h3><p class="overlaydesc">'+d["#description"]+'</p>';
		html +='</div></div></div>';

		$('#grid').append(html);

		$('#image'+i).css({"max-width": "100%", "max-height": "auto"});

		var color = Math.floor((Math.random() * (colors.length-1)));
		$('#overlay'+i).css({'background-color':colors[color]});

		$('#overlay'+i).on('click',function(){
			if($('#overlay'+i).css('opacity')>0.5){
				window.open(d["#url"], '_blank');
			}
		});

		$('#grid'+i).on("mouseenter", function(){						
        	$('#overlay'+i).fadeIn(400);
    	});

    	$('#grid'+i).on("mouseleave", function(){	
        	$('#overlay'+i).stop().fadeOut(100);
    	});
	});
}

function generateButtons(data){
	var filters = [];
	data.forEach(function(d){
		//d.tags.forEach(function(tag){
		//	if(filters.indexOf(tag)==-1){
		//		filters.push(tag);
		//	}
		//});
	});

	filters.forEach(function(f){
		var html = '<button class="filterbutton" data-filter=".'+f.replace(' ','_').toLowerCase()+'">'+f+'</button> ';
		$('.filter-button-group').append(html);
	});
}