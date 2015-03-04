<?php
namespace api\v1;

/**
 * Module API v1
 *
 * PHP version 5.4
 *
 * @category   Api.v1
 * @package    module
 * @author     Artem Shapovalov <artem@5-soft.com>
 */
class Module extends \yii\base\Module
{
    public $controllerNamespace = 'api\v1\controllers';

    public function init()
    {
        parent::init();
    }
}
