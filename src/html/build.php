<?php
$template = file_get_contents(__DIR__ . '/template.html');
$template = preg_replace('/>\s+</s', '><', $template);
echo trim($template);