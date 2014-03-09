//(function(window){
    
 
    var ContentManager = function(){
       throw 'cant initialize';
    };
    
    ContentManager.stage = null;
    ContentManager.callback = function(){};
    ContentManager.loaded_resources = 0;
    ContentManager.count_resources = 0;
    ContentManager.images  = [];
    ContentManager.maps = {};
    
    ContentManager.add_image = function (index,url){
        var ind = ContentManager.images.indexOf(index);
        if(ind !== -1){
            throw "the name of the image: '"+url+"' already exists";
        }
        ContentManager.images[index] = {image:new Image(),url : url,image_name:index};
        ContentManager.count_resources++;
    };
    
    ContentManager.clear_image = function(index){
        delete ContentManager.images[index];
        ContentManager.count_resources--;
    };
    
    ContentManager.clear_all_images = function(){
        ContentManager.images = {};
        ContentManager.count_resources = 0;
    };
    
    ContentManager.add_maps = function (index,url){
        ContentManager.maps[index] = {image:new Image(),url : url};
        ContentManager.count_resources++;
    };
    
    ContentManager.clear_maps = function (){
        ContentManager.maps = {};
        ContentManager.count_resources = 0;
    };
    
    ContentManager.download_images = function (stage,callback,base_url){
        
        ContentManager.callback = callback || function(){};
        ContentManager.stage = stage;
        ContentManager.base_url = base_url;
        
        for(var item in this.images){
                this.images[item].image.onload = this.resource_loaded;
                this.images[item].image.onerror = this.handle_image_error;
                this.images[item].image.src = (ContentManager.base_url ? ContentManager.base_url : '')+this.images[item].url;
        }        
    };
    
    ContentManager.download_maps = function (stage,callback,base_url){
        
        ContentManager.callback = callback || function(){};
        ContentManager.stage = stage;
        ContentManager.base_url = base_url;
        
        for(var item in this.maps){
            this.maps[item].image.onload = this.resource_loaded;
            this.maps[item].image.onerror = this.handle_image_error;
            this.maps[item].image.src = (ContentManager.base_url ? ContentManager.base_url : '')+this.maps[item].url;
        }
    };
    
    ContentManager.handle_image_error = function(e) {
        alert("Error Loading Image : " + e.target.src);
    };
    
    ContentManager.resource_loaded = function(){
        ContentManager.loaded_resources++;
       
        if(ContentManager.loaded_resources == ContentManager.count_resources){
            
            ContentManager.base_url = null;
            ContentManager.loaded_resources = 0;
            ContentManager.count_resources = 0;
            
            ContentManager.callback();
        }
        
    };
    
//    window.ContentManager = ContentManager;
//    
//}(window));