<?php
class IndexController extends Yaf_Controller_Abstract {
   public function indexAction() {//д╛хоAction
       $this->getView()->assign("content", "Hello World");
   }
}
?>