<%@page pageEncoding="UTF-8" %>
<%@page import="org.uva.*, java.io.*" %>
<%


StudySession studySession = (StudySession) session.getAttribute("studysession");
String fullUrl = ((PageTask)studySession.getCurrentTask()).getUrl();
String urlPath = fullUrl.substring(0,fullUrl.indexOf("piindex"));

String getProtocol=request.getScheme();
String getDomain=request.getServerName();
String getBase = getProtocol+"://"+getDomain;

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
		<base href="<%= getBase + "/implicit/common/all/js/pip/0.3.15/dist/" %>">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
        <meta HTTP-EQUIV="Expires" CONTENT="0"></meta>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"></meta>
        <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache"></meta>
        <meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width, height=device-height" />
		<% if (org.uva.Implicit.IS_PRODUCTION == "true") {%>
			<script>
				(function(_,e,rr,s){_errs=[s];var c=_.onerror;_.onerror=function(){var a=arguments;_errs.push(a);
				c&&c.apply(this,a)};var b=function(){var c=e.createElement(rr),b=e.getElementsByTagName(rr)[0];
				c.src="//beacon.errorception.com/"+s+".js";c.async=!0;b.parentNode.insertBefore(c,b)};
				_.addEventListener?_.addEventListener("load",b,!1):_.attachEvent("onload",b)})
				(window,document,"script","55530734a1b3d51609003d1c");
				_errs.meta = {
					script: '<%= script %>',
					session: '<%= studySession.getId() %>',
					taskId: '<%= studySession.getCurrentTask().getId() %>',
					studyId: '<%= studySession.getStudy().getId() %>',
					app: 'pip'
				}
			</script>
		<% } %>

        <link type="text/css" rel="Stylesheet" href="css/reset.css"/>
        <link type="text/css" rel="Stylesheet" href="css/styles.css"/>
        <script language="JavaScript" type="text/javascript" src="/implicit/common/en-us/js/task.js"></script>

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

		<script>
			require(['js/config'], function() {
				require(['<%= script %>']);
			});
		</script>
	</body>
</html>
