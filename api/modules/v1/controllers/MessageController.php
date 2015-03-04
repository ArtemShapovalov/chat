<?php
namespace api\v1\controllers;

use api\v1\models\Message;
use Yii;
use yii\data\ActiveDataProvider;
use yii\rest\ActiveController;

/**
 * User controller
 */
class MessageController extends ActiveController
{
    public $modelClass = 'api\v1\models\Message';

    /**
     *
     * @return array
     */
    public function actions()
    {
        $actions = parent::actions();
        $actions['index'] = [
            'class' => 'yii\rest\IndexAction',
            'modelClass' => $this->modelClass,
            'prepareDataProvider' => [$this, 'prepareDataProvider'],
        ];
        /*$actions['create'] = [
            'class' => 'yii\rest\CreateAction',
            'modelClass' => $this->modelFormClass,
            'checkAccess' => [$this, 'checkAccess'],
            'scenario'    => $this->createScenario,
            'findModel' => [$this, 'findModel'],
        ];
        $actions['update'] = [
            'class' => 'yii\rest\UpdateAction',
            'modelClass' => $this->modelClass,
            'checkAccess' => [$this, 'checkAccess'],
            'scenario'    => $this->updateScenario,
            'findModel' => [$this, 'findModel'],
        ];*/

        $actions['view'] = [
            'class' => 'yii\rest\ViewAction',
            'modelClass' => $this->modelClass,
            'findModel' => [$this, 'findModel'],
        ];

        $actions['delete'] = [
            'class' => 'yii\rest\DeleteAction',
            'modelClass' => $this->modelClass,
            'checkAccess' => [$this, 'checkAccess'],
            'findModel' => [$this, 'findModel'],
        ];
        return $actions;
    }

    public function actionClear()
    {
        $params = Yii::$app->request->get();
        return Message::deleteAll($params);
    }

    public function prepareDataProvider()
    {
        $params = Yii::$app->request->get();
        /* @var $modelClass \yii\elasticsearch\ActiveRecord */
        $modelClass = $this->modelClass;

        return new ActiveDataProvider([
            'query' => $modelClass::find()->where($params)->orderBy('created_at ASC'),
        ]);
    }

    public function findModel($id)
    {
        $message = Message::find()->where(['id' => 1])->one();

        return $message;
    }
}
