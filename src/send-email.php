<?php
/**
 * Contact Form Email Handler
 * Sends form data to email address
 */

// Set content type for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Configuration
$toEmail = 'info@verdiyan-legal.cz'; // Change this to your email address
$fromEmail = 'noreply@verdiyan-legal.cz'; // Change this to your domain email
$subjectPrefix = 'Contact Form - Verdiyan Legal';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Get and sanitize form data
$firstName = isset($_POST['firstName']) ? sanitizeInput($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? sanitizeInput($_POST['lastName']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';
$privacyPolicy = isset($_POST['privacyPolicy']) ? true : false;

// Validation
$errors = [];

if (empty($firstName) || strlen($firstName) < 2) {
    $errors[] = 'First name is required and must be at least 2 characters';
}

if (empty($lastName) || strlen($lastName) < 2) {
    $errors[] = 'Last name is required and must be at least 2 characters';
}

if (empty($email) || !isValidEmail($email)) {
    $errors[] = 'Valid email address is required';
}

if (empty($phone) || strlen($phone) < 10) {
    $errors[] = 'Valid phone number is required';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message is required and must be at least 10 characters';
}

if (!$privacyPolicy) {
    $errors[] = 'Privacy policy agreement is required';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Prepare email content
$emailSubject = $subjectPrefix . ' - ' . $firstName . ' ' . $lastName;

$emailBody = "New contact form submission from Verdiyan Legal website\n\n";
$emailBody .= "First Name: " . $firstName . "\n";
$emailBody .= "Last Name: " . $lastName . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Phone: " . $phone . "\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "Privacy Policy Accepted: " . ($privacyPolicy ? 'Yes' : 'No') . "\n";
$emailBody .= "Submitted: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = [];
$headers[] = 'From: ' . $fromEmail;
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// Send email
$mailSent = @mail($toEmail, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will contact you soon.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again later or contact us directly.'
    ]);
}
?>
