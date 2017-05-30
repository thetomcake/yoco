<?php

require('..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'bootstrap' . DIRECTORY_SEPARATOR . 'bootstrap.php');

use Nette\Mail\SmtpMailer;
use Nette\Mail\Message;
use Respect\Validation\Validator as v;
use ReCaptcha\ReCaptcha;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Respect\Validation\Exceptions\ValidationException;

$request = Request::createFromGlobals();

try {
    $request->request->all();
    
    $validator = v::key('email', v::email())
        ->key('subject', v::stringType()->length(1, 70))
        ->key('message', v::stringType()->length(1, 700));
    
    $validator->check($request->request->all());
    
    $recaptcha = new ReCaptcha(getenv('RECAPTCHA_SECRET'));
    
    $resp = $recaptcha->verify($request->get('g-recaptcha-response', ''), $request->getClientIp());
    if (!$resp->isSuccess()) {
        throw new Exception(implode(', ', $resp->getErrorCodes()));
    }

    $mailer = new SmtpMailer([
            'host' => getenv('MAIL_HOST'),
            'username' => getenv('MAIL_USER'),
            'password' => getenv('MAIL_PASSWORD'),
            'secure' => 'tls',
    ]);

    $mailBody = 'IP: ' . $request->getClientIp() . "\n";
    $mailBody .= 'Email: ' . $request->get('email') . "\n\n";
    $mailBody .= $request->get('message');

    $mail = new Message;
    $mail->setFrom(getenv('MAIL_FROM'))
            ->addTo(getenv('MAIL_TO'))
            ->addReplyTo($request->get('email'))
            ->setSubject('You Only Code Once - ' . $request->get('subject'))
            ->setBody($mailBody);
    
    $mailer->send($mail);

    $response = new Response(
        json_encode([
            'success' => true,
            'message' => 'Message sent'
        ]), 200);

} catch (ValidationException $e) {
    $response = new Response(
        json_encode([
            'success' => false,
            'message' => $e->getMainMessage()
        ]), 400);
} catch (Exception $e) {
    $response = new Response(
        json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]), 500);
    
}

$response->headers->set('Content-Type', 'application/json');
$response->prepare($request);
$response->send();