<%@page pageEncoding="UTF-8" %>
<%
	String script = request.getParameter("i");
	try{
		if (script == null){
			throw new Exception("Script is null");
		}
	} catch (Exception e){
		out.println("An exception occurred: " + e.getMessage());
	}
%>
<!DOCTYPE html>
<html>
	<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
        <meta HTTP-EQUIV="Expires" CONTENT="0"></meta>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"></meta>
        <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache"></meta>
        <meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width, height=device-height" />

        <link type="text/css" rel="Stylesheet" href="css/main.css"/>

		<style type="text/css">
			/* http://www.sitepoint.com/css3-responsive-centered-image/ */
			img.pi-logo {position: absolute;max-width: 80%;top: 50%;left: 50%;margin-left: -32px;margin-top: -32px;border-radius: 3px;}
			img.pi-logo:empty {margin: auto;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);}
			@media screen and (orientation: portrait) {img.pi-logo { max-width: 90%; }}
			@media screen and (orientation: landscape) {img.pi-logo { max-height: 90%; }}
		</style>
	</head>

	<body>
		<div pi-player>
			<img class="pi-logo" src="img/loader.gif" />
		</div>

		<!--[if lt IE 8]>
			<script src="../bower_components/json2/json2.js"></script>
		<![endif]-->
		<script src="../bower_components/requirejs/require.js"></script>

		<script type="text/javascript">
			require(['js/config'], function() {
				require(['activatePIP', '<%= script %>'], function(activatePIP, script){
					activatePIP(script);
				});
			});
		</script>
	</body>
</html>