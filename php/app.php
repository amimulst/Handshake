
<?php

	include '../php/controller.php';
	header('Content-Type: application/json; charset=utf-8');

	$logic = new AppLogic();

 	$param = $_POST["param"];
 	$response = ["status"=>"","result" =>""];

 	switch ($param) {
 		case 'GetAllImages':
 			$images = $logic->GetAllImages();
 			$response["result"] = $images;
 			$response["status"] = "success";
 			break;
 		case 'StoreImage':
 			$res = $logic->StoreImage($_FILES["file"],$_POST["empName"]);
 			$response["result"] = $res;
 			$response["status"] = "success";
 			break;
 		case 'DeleteImage':
 			$res = $logic->DeleteImage($_POST["img"]);
 			$response["result"] = $res;
 			$response["status"] = "success";
 			break;
 		
 		default:
 			# code...
 			break;
 	}

	$response_json = json_encode($response);
	echo $response_json;
?>