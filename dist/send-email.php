<?php
header('Content-Type: application/json');

require __DIR__ . '/vendor/autoload.php';
$config = require __DIR__ . '/email-config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sanitizeInput($data) {
    return strip_tags(trim($data));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$firstName    = isset($_POST['firstName'])    ? sanitizeInput($_POST['firstName'])    : '';
$lastName     = isset($_POST['lastName'])     ? sanitizeInput($_POST['lastName'])     : '';
$email        = isset($_POST['email'])        ? sanitizeInput($_POST['email'])        : '';
$phone        = isset($_POST['phone'])        ? sanitizeInput($_POST['phone'])        : '';
$message      = isset($_POST['message'])      ? sanitizeInput($_POST['message'])      : '';
$privacyPolicy = isset($_POST['privacyPolicy']);

$errors = [];
if (strlen($firstName) < 2)                          $errors[] = 'First name is required';
if (strlen($lastName) < 2)                           $errors[] = 'Last name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))      $errors[] = 'Valid email address is required';
if (strlen($phone) < 10)                             $errors[] = 'Valid phone number is required';
if (strlen($message) < 10)                           $errors[] = 'Message is required';
if (!$privacyPolicy)                                 $errors[] = 'Privacy policy agreement is required';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->Port       = $config['smtp_port'];
    $mail->SMTPAuth   = false;
    $mail->CharSet    = PHPMailer::CHARSET_UTF8;

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addReplyTo($email, $firstName . ' ' . $lastName);
    $mail->addAddress($config['to_email']);

    $mail->Subject = 'Contact Form - ' . $firstName . ' ' . $lastName;
    $mail->Body    = "New contact form submission\n\n"
                   . "Name: $firstName $lastName\n"
                   . "Email: $email\n"
                   . "Phone: $phone\n"
                   . "Message:\n$message\n\n"
                   . "Submitted: " . date('Y-m-d H:i:s') . "\n";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Thank you! We will contact you soon.']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
