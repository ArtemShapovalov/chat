<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-api',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'api\v1\controllers',
    'components' => [
        'request' => [
            'enableCookieValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'user' => [
            'identityClass' => 'api\v1\models\User',
            'enableAutoLogin' => true,
            'enableSession' => false,
        ],
        'elasticsearch' => [
            'class' => 'yii\elasticsearch\Connection',
            'nodes' => [
                ['http_address' => '127.0.0.1:9200'],
                // configure more hosts if you have a cluster
            ],
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                '/v1/users/<action:(menu)>' => 'v1/user/<action>',
                '/v1/messages/<action:(clear)>' => 'v1/message/<action>',
                ['class' => 'yii\rest\UrlRule', 'controller' => [
                        'v1/message', 'v1/user',
                    ],
                    'tokens' => [
                        '{id}' => '<id:[\w\-]+>',
                        '{alias}' => '<alias:[\w\-]+>',
                    ],
                ],
            ],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        /*'errorHandler' => [
            'errorAction' => 'site/error',
        ],*/
    ],
    'modules' => [
        'v1' => [
            'basePath' => '@api/modules/v1',
            'class' => 'api\v1\Module'
        ],
    ],
    'params' => $params,
];
