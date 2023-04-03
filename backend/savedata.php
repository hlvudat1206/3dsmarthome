<?php

$servername = "localhost:3306";
$username = "starglobal";
$password = "mysql@sg3d68";
// $dbname = "smart-home-3d_hoasen-dev";

$dbname = "virtual-shopping-3d_meta-market";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT tensanpham, thuonghieu, chucnang,thongtin, gia FROM info_object";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
  // output data of each row
  while($row = mysqli_fetch_assoc($result)) {
    // echo "tensanpham: " . $row["tensanpham"]. " - thuonghieu: " . $row["thuonghieu"]. " chucnang: " . $row["chucnang"]." thongtin: " . $row["thongtin"]" gia: " . $row["gia"] "<br>";
    echo  $row["tensanpham"].'-'.  $row["thuonghieu"] .'-'. $row["chucnang"].'-'. $row["thongtin"].'-'.  $row["gia"];
    // echo  $row["tensanpham"].  $row["thuonghieu"] . $row["chucnang"].  $row["gia"]. "<br>";

  }
} else {
  echo "0 results";
}


mysqli_close($conn);
?> 