/*

    Depend: jquery.js,js-deflate-master/*,js-deflate-master2/*

*/
function ab2str(buf) {
       return String.fromCharCode.apply(null, new Uint16Array(buf));
     }
    function str2ab(str) {
       var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
       var bufView = new Uint16Array(buf);
       for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
       }
       return buf;
     }

function ChunkedUploader(file, options) {

    if (!this instanceof ChunkedUploader) {
        return new ChunkedUploader(file, options);
    }
    this.file = file;
   
    this.buffer_size = 1024*100;
    this.elapsed_time = 0;
    this.options = $.extend({
        url: '',
        urlphp:'uploadfile.php',
    }, options);
   
    this.total_size=0;
    this.first=true;
    this.max_progress_bar_width=0;
    this.progress_bar_selector="";
    this.use_compression = false;
    this.count=0;
    this.key=0;
	this.progress_callback=null;
}
ChunkedUploader.prototype = {
    //Internal methods
    _upload: function () {
        this.total_size = this.file.size;
        this._readBlob(this.file, 0, this.buffer_size - 1);

        
    },
    _readBlob:function(f, opt_startByte, opt_stopByte) {
        var self=this;
        console.log("--" + opt_startByte + "," + opt_stopByte);
        var options = this.options;
        if (opt_startByte < f.size) {
            
             
            if (opt_stopByte > f.size) {
                opt_stopByte = f.size - 1;
            }
            var start = parseInt(opt_startByte) || 0;
            var stop = parseInt(opt_stopByte) || f.size - 1;
           

            var reader = new FileReader();
            
            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function (evt) {

                if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                    var dat = {};
                    var tmpData=evt.target.result;
                    if (self.use_compression){

                       
                        //tmpData=zip.TextReader(evt.target.result);

                        tmpData= RawDeflate.deflate(evt.target.result);
                        //console.log(tmpData);
                       // alert(Base64.toBase64(tmpData));
                        //alert(tmpData);
                        //tmpData= RawDeflate.deflate(evt.target.result,1);
                        //alert(encodeURIComponent(tmpData));
                        //tmpData=deflate(evt.target.result,5);
                        
                    }
                   
                    var dt =btoa(tmpData);
                   // alert(dt);
                    //var dt=tmpData;
					alert("Start Send file content!");
                    dat["file_part"] = dt; 
                    $.ajax({
                        type: "POST",
                        url: options.urlphp +  "?mode=" + (self.first ? "new" : "continue") + ((self.key == "") ? "" : "&key=" + self.key) + (self.use_compression?"&use_compression=true":""),
                        data: dat,
                        success: function (data) {
						alert("send filecontent on success:\n" + data);
                            if (self.first == true) {
                                self.key = data;
                            }

                            //alert(tmpData);
                            self.first = false;
                            setTimeout(function () { self._readBlob(f, start + self.buffer_size, stop + self.buffer_size); }, 0);
                            self._progress(self.total_size,stop,self.max_progress_bar_width,self.progress_bar_selector);
                           self.count++;

                        }
                    });


                }
            };

            var blob = f.slice(start, stop +1);

            reader.readAsBinaryString(blob);

        }
        //Finish
        else {

            var dat = {};
            dat["file-name"] = this.file.name;
            $.ajax({
                type: "POST",
                url: options.urlphp + "?mode=finished&key=" + this.key,
                data: dat,
                success: function (data) {
                    alert(data);
                }
            });
            console.log("count:" + this.count);
        }
    },
    _progress:function(total,current,base,selector){
	//percentage
		var percentage_complete =(current / total);
         //var widthvalue = (current / total) * base;
         //alert(widthvalue);
		 
		 
         //$(selector).css("width", widthvalue + "px");
		 if (this.progress_callback!=null){
		 
			this.progress_callback(percentage_complete);
		 }
    },
    start:function(){
    //alert(this.options.urlphp);
        this._upload();
    },
    stop:function(){
        alert("stop");
    }
    
}
