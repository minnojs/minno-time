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
	<base href="<%= getBase + "/implicit" + urlPath %>">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
        <meta HTTP-EQUIV="Expires" CONTENT="0"></meta>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"></meta>
        <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache"></meta>
        <meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width, height=device-height" />

        <link type="text/css" rel="Stylesheet" href="css/reset.css"/>
        <link type="text/css" rel="Stylesheet" href="css/styles.css"/>
        <script language="JavaScript" type="text/javascript" src="/implicit/common/en-us/js/task.js"></script>

		<!--[if lt IE 8]>
			<script src="../bower_components/json2/json2.js"></script>
		<![endif]-->
		<script src="../bower_components/requirejs/require.js"></script>

		<script>
			require(['js/config'], function() {
				require(['<%= script %>']);
			});
		</script>
	</head>

	<body>
	</body>
</html>
