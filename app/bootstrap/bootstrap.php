<?php

use Dotenv\Dotenv;

define('BASE_PATH', realpath(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR));

require(BASE_PATH . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php');

$dotenv = new Dotenv(BASE_PATH);
$dotenv->load();

