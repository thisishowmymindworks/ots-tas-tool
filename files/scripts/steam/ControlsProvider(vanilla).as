package controls
{
   import flash.utils.Dictionary;
   
   public class ControlsProvider implements IControlsProvider
   {
       
      
      private var down:Dictionary;
      
      private var pressed:Dictionary;
      
      private var released:Dictionary;
      
      private var axes:Dictionary;
      
      public function ControlsProvider()
      {
         this.down = new Dictionary();
         this.pressed = new Dictionary();
         this.released = new Dictionary();
         this.axes = new Dictionary();
         super();
      }
      
      public function isButtonDown(param1:int) : Boolean
      {
         return this.down[param1] == true;
      }
      
      public function isButtonPressed(param1:int, param2:Boolean = false) : Boolean
      {
         var _loc3_:* = this.pressed[param1] == true;
         if(param2)
         {
            this.pressed[param1] = false;
         }
         return _loc3_;
      }
      
      public function isButtonReleased(param1:int, param2:Boolean = false) : Boolean
      {
         var _loc3_:* = this.released[param1] == true;
         if(param2)
         {
            this.released[param1] = false;
         }
         return _loc3_;
      }
      
      public function getAxis(param1:int) : Number
      {
         return !!this.axes[param1]?Number(this.axes[param1]):Number(0);
      }
      
      public function preUpdate() : void
      {
      }
      
      public function postUpdate() : void
      {
         this.resetPresses();
      }
      
      protected function resetPresses() : void
      {
         var _loc1_:* = null;
         for(_loc1_ in this.pressed)
         {
            delete this.pressed[_loc1_];
         }
         for(_loc1_ in this.released)
         {
            delete this.released[_loc1_];
         }
      }
      
      protected function setAxis(param1:int, param2:Number) : void
      {
         this.axes[param1] = param2;
      }
      
      protected function setDown(param1:int) : void
      {
         if(!this.isButtonDown(param1))
         {
            this.down[param1] = true;
            this.pressed[param1] = true;
         }
      }
      
      protected function setUp(param1:int) : void
      {
         if(this.isButtonDown(param1))
         {
            this.down[param1] = false;
            this.released[param1] = true;
         }
      }
      
      protected function setPressed(param1:int) : void
      {
         this.down[param1] = true;
         this.pressed[param1] = true;
      }
      
      protected function setReleased(param1:int) : void
      {
         this.down[param1] = false;
         this.released[param1] = true;
      }
      
      protected function resetDownStatus() : void
      {
         this.down = new Dictionary();
      }
   }
}
