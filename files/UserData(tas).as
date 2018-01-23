package save
{
   import flash.geom.Point;
   import flash.utils.ByteArray;
   import flashpunk2.global.Debug;
   import game.Constants;
   import game.actors.Traitor;
   import game.ui.NewGameScreen;
   
   public class UserData
   {
      
      private static const CITY_ALIENS:Array = new Array("alien5_18_4","alien4_18_4","alien6_18_4","alien8_19_4","alien7_19_3","alien9_20_4");
      
      public static var selectedSlot:uint = 0;
      
      private static var saveFiles:Vector.<SaveFile>;
      
      private static var options:OptionsFile;
       
      
      public function UserData()
      {
         super();
      }
      
      public static function reloadSaveFiles() : void
      {
         saveFiles = new Vector.<SaveFile>(NewGameScreen.TOTAL_SLOTS,true);
         var _loc1_:uint = 0;
         while(_loc1_ < saveFiles.length)
         {
            saveFiles[_loc1_] = new SaveFile(_loc1_);
            _loc1_++;
         }
      }
      
      public static function erase(param1:uint) : void
      {
         saveFiles[param1] = SaveFile.eraseThenCreateNew(param1);
      }
      
      private static function get saveFile() : SaveFile
      {
         return saveFiles[selectedSlot];
      }
      
      public static function getSaveSlotState(param1:uint) : uint
      {
         return saveFiles[param1].state;
      }
      
      public static function saveGame() : Boolean
      {
         return saveFiles[selectedSlot].save(selectedSlot);
      }
      
      public static function findCore(param1:Point) : void
      {
         if(!hasCore(param1))
         {
            saveFile.cores.push(new Point(param1.x,param1.y));
            Debug.log("Found core @" + param1.x.toString() + "," + param1.y.toString());
         }
      }
      
      public static function hasCore(param1:Point) : Boolean
      {
         var _loc2_:Point = null;
         for each(_loc2_ in saveFile.cores)
         {
            if(_loc2_.equals(param1))
            {
               return true;
            }
         }
         return false;
      }
      
      public static function findLifeCapsule(param1:Point) : void
      {
         if(!hasLifeCapsule(param1))
         {
            saveFile.lifeCapsules.push(new Point(param1.x,param1.y));
            Debug.log("Found life capsule @" + param1.x.toString() + "," + param1.y.toString());
         }
      }
      
      public static function hasLifeCapsule(param1:Point) : Boolean
      {
         var _loc2_:Point = null;
         for each(_loc2_ in saveFile.lifeCapsules)
         {
            if(_loc2_.equals(param1))
            {
               return true;
            }
         }
         return false;
      }
      
      public static function hasMessage(param1:String) : Boolean
      {
         return saveFile.messages.indexOf(param1) >= 0;
      }
      
      public static function receiveMessage(param1:String) : Boolean
      {
         if(!hasMessage(param1))
         {
            saveFile.messages.push(param1);
            return true;
         }
         return false;
      }
      
      public static function hasTriggeredEvent(param1:String) : Boolean
      {
         return saveFile.events.indexOf(param1) >= 0;
      }
      
      public static function triggerEvent(param1:String) : void
      {
         if(!hasTriggeredEvent(param1))
         {
            saveFile.events.push(param1);
            Debug.log("Got event " + param1 + ".");
         }
      }
      
      public static function get autosave() : Boolean
      {
         return saveFile.autosave;
      }
      
      public static function set autosave(param1:Boolean) : void
      {
         saveFile.autosave = !saveFile.autosave;
      }
      
      public static function get checkpoint() : Point
      {
         return saveFile.checkpoint;
      }
      
      public static function get numberOfCores() : uint
      {
         return saveFile.cores.length;
      }
      
      public static function incrementPlaytime() : void
      {
         saveFile.playtime++;
      }
      
      public static function areDoorsOpen(param1:uint) : Boolean
      {
         return saveFile.doors.indexOf(param1) >= 0;
      }
      
      public static function openDoors(param1:uint) : void
      {
         if(!areDoorsOpen(param1))
         {
            saveFile.doors.push(param1);
         }
      }
      
      public static function getMessage(param1:String, param2:Boolean) : void
      {
         if(saveFile.messages.indexOf(param1) < 0)
         {
            saveFile.messages.push(param1);
            if(param2)
            {
               addStatistic(1,"alien");
            }
            Debug.log("Received message " + param1 + ".");
         }
      }
      
      public static function onGameOver() : void
      {
         var _loc1_:ByteArray = null;
         if(language == "br")
         {
            _loc1_ = new ByteArray();
            _loc1_.writeUTF("zuera unlockada");
            Utils.writeFile("unlockedZuera",_loc1_);
         }
      }
      
      public static function getPlaytime() : uint
      {
         return uint(saveFile.playtime * Constants.SECS_PER_STEP);
      }
      
      public static function getPlaytimeString() : String
      {
         return saveFile.playtime + "";
      }
      
      public static function addStatistic(param1:Number, param2:String, param3:Boolean = true) : void
      {
         if(saveFile.statistics[param2] == undefined)
         {
            saveFile.statistics[param2] = 0;
         }
         saveFile.statistics[param2] = saveFile.statistics[param2] + param1;
         if(param3)
         {
            Debug.log("Statistic updated [" + param2 + ":" + int(saveFile.statistics[param2]).toString() + "]");
         }
      }
      
      public static function getStatistic(param1:String) : Number
      {
         if(saveFile.statistics[param1] == undefined)
         {
            return 0;
         }
         return saveFile.statistics[param1];
      }
      
      public static function visitRoom(param1:int, param2:int) : Boolean
      {
         var _loc3_:Boolean = false;
         if(!hasVisitedRoom(param1,param2))
         {
            _loc3_ = true;
            saveFile.roomsVisited.push(new Point(param1,param2));
            addStatistic(1,"uniqueScreensTraveled");
         }
         return _loc3_;
      }
      
      public static function hasVisitedRoom(param1:int, param2:int) : Boolean
      {
         var _loc3_:Point = null;
         for each(_loc3_ in saveFile.roomsVisited)
         {
            if(_loc3_.x == param1 && _loc3_.y == param2)
            {
               return true;
            }
         }
         return false;
      }
      
      public static function get coresForNextUpgrade() : uint
      {
         if(saveFile._coresGivenToTraitor < Traitor.SMALL_UPGRADE)
         {
            return Traitor.SMALL_UPGRADE;
         }
         if(saveFile._coresGivenToTraitor < Traitor.MEDIUM_UPGRADE)
         {
            return Traitor.MEDIUM_UPGRADE;
         }
         if(saveFile._coresGivenToTraitor == Traitor.BIG_UPGRADE)
         {
            Debug.logError("All cores already given to traitor");
         }
         return Traitor.BIG_UPGRADE;
      }
      
      public static function get coresGivenToTraitor() : uint
      {
         return saveFile._coresGivenToTraitor;
      }
      
      public static function giveCoresToTraitor() : void
      {
         saveFile._coresGivenToTraitor = uint(saveFile.cores.length);
      }
      
      public static function get numberOfShipUpgradesFromTraitor() : uint
      {
         if(saveFile._coresGivenToTraitor >= Traitor.BIG_UPGRADE)
         {
            return 3;
         }
         if(saveFile._coresGivenToTraitor >= Traitor.MEDIUM_UPGRADE)
         {
            return 2;
         }
         if(saveFile._coresGivenToTraitor >= Traitor.SMALL_UPGRADE)
         {
            return 1;
         }
         return 0;
      }
      
      public static function onMonsterKilled(param1:String) : void
      {
         if(saveFile.monstersKilled.indexOf(param1) < 0)
         {
            saveFile.monstersKilled.push(param1);
            Debug.log(saveFile.monstersKilled.length + " unique monsters killed");
         }
      }
      
      public static function onTalkedToNpc(param1:String) : void
      {
         var _loc3_:String = null;
         if(saveFile.npcsTalked.indexOf(param1) < 0)
         {
            saveFile.npcsTalked.push(param1);
         }
         var _loc2_:Boolean = true;
         for each(_loc3_ in CITY_ALIENS)
         {
            if(saveFile.npcsTalked.indexOf(_loc3_) < 0)
            {
               _loc2_ = false;
               break;
            }
         }
      }
      
      public static function get totalExtraLife() : int
      {
         return saveFile.lifeCapsules.length;
      }
      
      public static function get totalCores() : int
      {
         return saveFile.cores.length;
      }
      
      public static function set language(param1:String) : void
      {
         options.language = param1;
      }
      
      public static function get language() : String
      {
         return options.language;
      }
      
      public static function set music(param1:int) : void
      {
         options.music = param1;
      }
      
      public static function get music() : int
      {
         return options.music;
      }
      
      public static function set sound(param1:int) : void
      {
         options.sound = param1;
      }
      
      public static function get sound() : int
      {
         return options.sound;
      }
      
      public static function set fullscreen(param1:Boolean) : void
      {
         options.fullscreen = param1;
      }
      
      public static function get fullscreen() : Boolean
      {
         return options.fullscreen;
      }
      
      public static function set showPlayTime(param1:Boolean) : void
      {
         options.showPlayTime = param1;
      }
      
      public static function get hasUnlockedZuera() : Boolean
      {
         var _loc1_:Boolean = Utils.fileExists("unlockedZuera");
         return _loc1_;
      }
      
      public static function get showPlayTime() : Boolean
      {
         return options.showPlayTime;
      }
      
      public static function saveOptions() : void
      {
         options.save();
      }
      
      public static function init() : void
      {
         if(options == null)
         {
            options = new OptionsFile();
         }
      }
   }
}
