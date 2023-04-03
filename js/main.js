(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);



    
      function closevatlieu(){
        document.getElementById("vatlieu1").style.display = "none";
      }

      function openvatlieu(){
        document.getElementById("vatlieu1").style.display = "block";
        
      }
      
      function closevatdung(){
        document.getElementById("vatdung").style.display = "none";

      }
      function openvatdung(){
        document.getElementById("vatdung").style.display = "block";
      }
      

	  $(document).ready(function(){
		$("#House").click(function(){
		  $("#showHouse").slideToggle("slow");
		});
	  });
	  

      

