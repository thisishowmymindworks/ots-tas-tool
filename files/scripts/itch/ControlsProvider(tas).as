package controls
{
   import flash.utils.Dictionary;
   import save.UserData;
   import shmup.utils.JSONLoader;
   
   public class ControlsProvider implements IControlsProvider
   {
       
      
      private var down:Dictionary;
      
      private var pressed:Dictionary;
      
      private var released:Dictionary;
      
      private var axes:Dictionary;
      
      private var tas_max_frame:Number;
      
      private var tas_left_right:Object;
      
      private var tas_cur_lr:Number;
      
      private var tas_up_down:Object;
      
      private var tas_cur_ud:Number;
      
      private var tas_jump:Object;
      
      private var tas_jumping:Boolean;
      
      private var tas_teleshot:Object;
      
      private var tas_gauss:Object;
      
      private var tas_boss_frame:Number;
      
      public function ControlsProvider()
      {
         this.down = new Dictionary();
         this.pressed = new Dictionary();
         this.released = new Dictionary();
         this.axes = new Dictionary();
         var tas_json:Object = JSONLoader.loadFile("tas/otas.json");
         this.tas_left_right = tas_json["left_right"];
         this.tas_up_down = tas_json["up_down"];
         this.tas_jump = tas_json["jump"];
         this.tas_teleshot = tas_json["teleshot"];
         this.tas_gauss = tas_json["gauss"];
         this.tas_boss_frame = tas_json["boss_frame"];
         this.tas_max_frame = tas_json["max_frame"];
         super();
      }
      
      public function isButtonDown(param1:int) : Boolean
      {
         if(param1 == ButtonCode.JUMP.code)
         {
            if(this.tas_jumping == true)
            {
               return true;
            }
         }
         return this.down[param1] == true;
      }
      
      public function isButtonPressed(param1:int, param2:Boolean = false) : Boolean
      {
         if(Number(UserData.getPlaytimeString()) > this.tas_boss_frame)
         {
            this.down[ButtonCode.SHOOT.code] = Boolean(Number(UserData.getPlaytimeString()) % 2 == 0);
         }

		if (this.tas_gauss[UserData.getPlaytimeString()] != null) {
			this.down[ButtonCode.ALTSHOOT.code] = true;
		} else if (this.tas_gauss[Number(UserData.getPlaytimeString())-1] != null) {
			this.down[ButtonCode.ALTSHOOT.code] = false;
		}
		
         if(param1 == ButtonCode.JUMP.code)
         {
            if(this.tas_jump[UserData.getPlaytimeString()] != null)
            {
               if(this.tas_jump[UserData.getPlaytimeString()] == true)
               {
                  this.tas_jumping = true;
               }
               else
               {
                  this.tas_jumping = null;
               }
               return this.tas_jump[UserData.getPlaytimeString()] == true;
            }
         }
         if(param1 == ButtonCode.SHOOT.code)
         {
            if(this.tas_teleshot[UserData.getPlaytimeString()] != null)
            {
               return this.tas_teleshot[UserData.getPlaytimeString()] == true;
            }
         }
		if(param1 == ButtonCode.ALTSHOOT.code)
         {
            if(this.tas_gauss[UserData.getPlaytimeString()] != null)
            {
               return this.tas_gauss[UserData.getPlaytimeString()] == true;
            }
         }
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
         if(Number(UserData.getPlaytimeString()) > this.tas_max_frame)
         {
            return !!this.axes[param1]?Number(this.axes[param1]):Number(0);
         }
         if(param1 == 0)
         {
            if(this.tas_left_right[UserData.getPlaytimeString()] != null)
            {
               this.tas_cur_lr = this.tas_left_right[UserData.getPlaytimeString()];
            }
            if(!isNaN(this.tas_cur_lr))
            {
               return this.tas_cur_lr;
            }
         }
         if(param1 == 1)
         {
            if(this.tas_up_down[UserData.getPlaytimeString()] != null)
            {
               this.tas_cur_ud = this.tas_up_down[UserData.getPlaytimeString()];
            }
            if(!isNaN(this.tas_cur_ud))
            {
               return this.tas_cur_ud;
            }
         }
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
