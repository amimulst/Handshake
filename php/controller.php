<?php
/**
 * 
 */
class AppLogic
{
	public function GetAllImages()
	{
		$result = "";
		try {
			$scanned_directory = array_diff(scandir("../images"), array('..', '.'));
			$result = $scanned_directory;
						
		} catch (Exception $e) {
			$result = $e->getMessage();
		}
		return $result;
	}

	public function StoreImage($file, $fileName)
	{
		$result ='';
		try {
			$ext = pathinfo(basename($file["name"]),PATHINFO_EXTENSION);
			$extension = strtolower($ext);
			$target_file = "../images/". $fileName .".". $ext;
			if ($extension !="jpg" && $extension !="jpeg" && $extension !="png" && $extension !="gif") {
				$result ='Please store a valid image.';
			}
			else if (is_file($target_file)) {
				$result ='Image is already exist.';
			}
			else if (move_uploaded_file($file["tmp_name"], $target_file)) {
				$result = "Image is successfully saved.";
			}
			
		} catch (Exception $e) {
			$result = $e->getMessage();
		}
		return $result;
	}

	public function DeleteImage($fileName)
	{
		$result ='';
		try {
			$fileName = "../".$fileName;
			if (is_file($fileName)) {
				unlink($fileName);
				$result ='Successfully deleted.';
			}
			else {
				$result = "Image does not exist.";
			}
			
		} catch (Exception $e) {
			$result = $e->getMessage();
		}
		return $result;
	}
}
?>