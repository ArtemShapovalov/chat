<?php
namespace api\v1\models;

/**
 * User model
 *
 * PHP version 5.4
 *
 * @category   Api
 * @package    models
 * @author     Artem Shapovalov <artem@5-soft.com>
 */

class Message extends \yii\elasticsearch\ActiveRecord
{
    protected $_id;

    public function rules()
    {
        return [
            [['room', 'owner', 'text'], 'required'],
            [['created_at'], 'safe'],
        ];
    }

    /**
     * @return array the list of attributes for this record
     */
    public function attributes()
    {
        // path mapping for '_id' is setup to field 'id'
        return ['room', 'owner', 'text', 'created_at'];
    }
}