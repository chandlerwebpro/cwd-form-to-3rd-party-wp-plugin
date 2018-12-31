<?php

function step1_to_2($url){
   /**
    * Now you can setup the post data and submit the form
    * For example, submit the ItemID = 6
    */
    $postFlds = 'first_name='.urlencode($_POST['fname']);
    $postFlds .= '&last_name=' . urlencode($_POST['lname']);
    $postFlds .= '&email=' . urlencode($_POST['email']);
    $postFlds .= '&contact_phone=' . urlencode($_POST['phone']);
    $postFlds .= '&phone_type=' . urlencode($_POST['phone_type']);
    $postFlds .= '&zip_code=' . urlencode($_POST['zipcode']);
    $postFlds .= '&form_session=' . urlencode($_POST['form_session']);

    $options = array(
         CURLOPT_RETURNTRANSFER => true, // return web page
         CURLOPT_HEADER => false, // don't return headers
         CURLOPT_ENCODING => "", // handle all encodings
         CURLOPT_CONNECTTIMEOUT => 120, // timeout on connect
         CURLOPT_TIMEOUT => 120, // timeout on response
         CURLOPT_POSTFIELDS => $postFlds);

    $ch = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $result = curl_exec ($ch);

    $fh = fopen('step2.html', 'w');
    fwrite($fh, $result);
    fclose($fh);

  /**
    *  Parse the data example
    * Read a number 1220
    *  <td class="WorksManageTableContent">1220</td>
   */
//   preg_match_all("/\<td class=\"WorksManageTableContent\"\>(.*?)\<\/td\>/", $result, $curCount);
//   $preCount = $curCount[1][0];

    curl_close ($ch);
    return $result;
}

// echo json_encode($_POST);
$form_state = step1_to_2('http://timmcdonald.space/step1');
echo $form_state;

die();