<?php
class IndexController extends Yaf_Controller_Abstract {
   public function indexAction() {//Ĭ��Action
       $this->getView()->assign("content", "Hello World");
   }
}
?>