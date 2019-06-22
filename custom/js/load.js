

class Connection {
	constructor(){
	}

	loadFunction(){
		this.loadImages();
		this.eventListener();
	}
    loadImages() {
	    $.post("php/app.php", { "param" : "GetAllImages"}, function(response){
	    	$(".img-list").html("");
	    	$("#imgDDL").empty();
	    	for(var key in response.result){
		    	var imgName = response.result[key].split(".");
	    		var opt = '<option value="images/'+response.result[key]+'">'+imgName[imgName.length - 2]+'</option>';
		    	var img = '<img title="'+imgName[imgName.length - 2]+'" src="images/'+response.result[key]+'" class="img">';
		    	$(".img-list").append(img);
		    	$("#imgDDL").append(opt);
	    	}
	    	$("#viewImg").attr("src", "images/"+response.result["2"]);

	    });
    }
    eventListener() {

    	$(".loader").hide();

	    $( "#iconToggle" ).click(function(){
	      if($("#iconToggle i").hasClass('fa-caret-square-down'))
	        $("#iconToggle i").removeClass('fa-caret-square-down').addClass('fa-caret-square-up');
	      else
	        $("#iconToggle i").removeClass('fa-caret-square-up').addClass('fa-caret-square-down');
	    });

    	$(document).on("click", ".img", function () {
    		var src = $(this).attr('src');
    		$(".loader").show();
    		face.recognition(src);
    	});

    	$("#imgDDL").change(function () {
    		var val = $(this).val();
    		$("#viewImg").attr("src", val);
    	});

    	$("#delImgBtn").click(function () {
    		var img = $("#imgDDL").val() || "";
    		if (img == "") {
    			alert("Please select a name of an image from dropdwon list.");
    		}
    		else{
    			if (confirm("Do you want to delete?")) {
			    	$.post("php/app.php", { "param" : "DeleteImage", "img" : img }, function(response){
		    			con.loadImages();
		    			alert(response.result);
			    	});		
    			}
    		}
    	});

	    $('#saveBtn').click(function(){

		  var file_data = $('#file_upload').prop('files')[0];  
		  var empName = $('#emp_name').val();  
		  var form_data = new FormData();                             
		  form_data.append('file', file_data);
		  form_data.append('empName', empName);
		  form_data.append('param', 'StoreImage');

		  if (!file_data) {
		    alert("Please select an image file.");
		  }
		  else if (empName == "") {
		  	alert("Please insert an employee name.");
		  }
		  else {
		    if(confirm("Do you want to save?")){
				$('button').prop('disabled', true);
		      $.ajax({
		        url: 'php/app.php',
		        cache: false,
		        contentType: false,
		        processData: false,
		        data:  form_data,                         
		        type: 'post',
		        success: function(response){
		          con.loadImages();
		          alert(response.result);
		        }
		      });
		    }
		  }
		});

    }
}


let face = new FaceDes();
let con = new Connection();

$(document).ready(function(){
	con.loadFunction();
});
