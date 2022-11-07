<?php
if (isset($_POST["req"])) {
  // (A) PRODUCTS LIST
  $products = [
    1 => [
      "n" => "Laptop",
      "p" => 345.67,
      "i" => "laptop.png"
    ],
    2 => [
      "n" => "Tablet",
      "p" => 234.56,
      "i" => "tablet.png"
    ],
    3 => [
      "n" => "Smartphone",
      "p" => 123.45,
      "i" => "smartphone.png"
    ],
    4 => [
      "n" => "Router",
      "p" => 34.56,
      "i" => "router.png"
    ],
    5 => [
      "n" => "Keyboard",
      "p" => 23.45,
      "i" => "keyboard.png"
    ],
    6 => [
      "n" => "Mouse",
      "p" => 12.34,
      "i" => "mouse.png"
    ]
  ];

  // (B) HANDLE REQUESTS
  switch ($_POST["req"]) {
    // (B1) INVALID REQUEST
    default: echo "Invalid request"; break;
  
    // (B2) GET PRODUCTS
    case "get":
      echo json_encode($products);
      break;

    // (B3) CHECKOUT
    case "checkout":
      // (B3-1) DATA YOGA
      $cart = json_decode($_POST["cart"], true);
      unset($_POST["req"]);
      unset($_POST["cart"]);

      // (B3-2) SEND VIA EMAIL
      $msg = "";
      foreach ($_POST as $k=>$v) { $msg .= "$k : $v\r\n"; }
      foreach ($cart as $i=>$q) {
        $msg .= sprintf("%u X %s - $%s\r\n",
          $q, $products[$i]["n"], $q * $products[$i]["p"]
        );
      }
	  $file = fopen("log.txt", "a");
  
{
    fwrite($file, $msg);
}
fwrite($file, "\r\n");
fclose($file);
echo ("order submitted we will contact you soon");

      echo mail("admin@site.com", "Order Received", $msg)
        ? "OK" : "Failed to send email";
      break;
	  exit;
  }
}