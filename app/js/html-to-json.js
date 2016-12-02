/**
 * Created by wz on 2016/11/30.
 */
(function(){
    $(function(){
        AJAX.get("http://api.htmltojson.com/",function(data){
            var arr = data.split("--body--");
            var json = JSON.parse(arr[0]);
            //console.log(json);
            json.body = arr[1];
            rendering(json);
        });
    });

    function rendering(json){
        //console.log(json.body);
        if(json.style)
        {
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            if(style.styleSheet){
                style.styleSheet.cssText = json.style;
            }else{
                style.appendChild(document.createTextNode(json.style));
            }
            head.appendChild(style);
        }
        $('head').append('<link href="/css/HTML-TO-JSON-CSS.css" rel="stylesheet" type="text/css" />');
        for(var i=0;i<json.css.length;i++)
        {
            if(json.css[i].slice(0,4)=="http")
            {
                $('head').append('<link href="' + json.css[i] + '" rel="stylesheet" type="text/css" />');
            }
            else
            {
                $('head').append('<link href="' + json.url + json.css[i] + '" rel="stylesheet" type="text/css" />');
            }
        }
        var body = formatReg(json.url,json.body);
        //var box = $('<div />');
        //box.html(body);
        $(document.body)[0].innerHTML = body;
        var setupbox = $('<div class="HTML-TO-JSON-SETUP" />');

        $(document.body).on("mouseover",function(e){
            //console.log($(e.target).attr("className"));
            if(judgetarget($(e.target),e))
            {
                $(e.target).addClass("HTML-TO-JSON-SELECT");
                var setupsun = getSetupbox($(e.target));
                $(e.target).prepend(setupsun);
            }
        });

        $(document.body).on("mouseout",function(e){
            //console.log(e.target);
            if(judgetarget($(e.target),e))
            {
                unsign($(e.target));
            }
        });

        $(document.body).on("click",function(e){
            if(judgetarget($(e.target),e))
            {
                sign($(e.target));
            }
        });

        $(document.body).on("dblclick",function(e){
            e.stopPropagation();
            unsign($(e.target));
        });
    }

    function judgetarget(dom,e){
        var nodeName = dom[0].nodeName || e.target.nodeName;
        dom = dom || e.target;
        if(nodeName=="DIV"||nodeName=="TABLE"||nodeName=="P"||nodeName=="UL"||nodeName=="LI"||nodeName=="DL"||nodeName=="DD"||nodeName=="IFRAME")
        {
            var boo = dom.attr("HTML-TO-JSON-SELECT")!="true"&&dom[0].className!="HTML-TO-JSON-SETUP"&&!dom.parents(".HTML-TO-JSON-SETUP").length;
            if(boo)
            {
                return true;
            }
        }
        return false;
    }

    function getPdom(dom){
        var boo=true,pdom=dom;
        while(boo)
        {
            pdom = pdom.parent();
            if(pdom&&pdom[0].nodeName!="BODY")
            {
                if(judgetarget(pdom))
                {
                    return pdom;
                    boo = false;
                }
            }
            else
            {
                return false;
            }
        }
    }

    function getSetupbox(dom){
        var setupbox = $('<div class="HTML-TO-JSON-SETUP" />');
        setupbox.append('<input type="radio" name="radio" value="list"><label for="radio">List</label>');
        setupbox.append('<input type="radio" name="radio" value="table"><label for="radio">Table</label>');
        setupbox.append('<input type="radio" name="radio" value="kv"><label for="radio">KV</label>');
        setupbox.append('<input type="radio" name="radio" value="tabs"><label for="radio">Tabs</label>');
        setupbox.append('<input type="radio" name="radio" value="nav"><label for="radio">Nav</label>');
        setupbox.append('<input type="radio" name="radio" value="img"><label for="radio">IMG</label>');
        var del = $('<label class="HTML-TO-JSON-DELETE">×</label>');
        var up = $('<label class="HTML-TO-JSON-DELETE">▲</label>');
        setupbox.append(del,up);
        setupbox.css({'width':'320px'});

        del.on("click",function(e){
            e.stopPropagation();
            dom.attr({"HTML-TO-JSON-SELECT":"false"});
            dom.removeClass("HTML-TO-JSON-SELECT");
            dom.children(".HTML-TO-JSON-SETUP").remove();
        });
        up.on("click",function(e){
            e.stopPropagation();
            var pdom = getPdom(dom);
            if(pdom)
            {
                unsign(dom);
                sign(pdom,true);
            }
        });
        var paddingTop = dom.css('padding-top');
        var paddingLeft = dom.css('padding-left');
        var overflow = dom.css('overflow');

        console.log(dom.width());
        if(dom.height()<50 || dom.width()<400)
        {
            if(overflow=="hidden")
            {
                dom.css({'overflow':'visible'});

            }
            if(paddingLeft)
            {
                setupbox.css({'margin-left': '-' + (parseInt(paddingLeft)+2)});
            }
            else
            {
                setupbox.css({'padding-left':'-2px'});
            }
            if(paddingTop)
            {
                setupbox.css({'margin-top': '-' + (parseInt(paddingTop)+30)});
            }
            else
            {
                setupbox.css({'padding-top':'-30px'});
            }
            //setupbox.css({"border-top-right-radius": "5px"});
        }
        else
        {
            if(paddingLeft)
            {
                setupbox.css({'margin-left': '-' + (parseInt(paddingLeft)+2)});
            }
            else
            {
                setupbox.css({'padding-left':'-2px'});
            }
            if(paddingTop)
            {
                setupbox.css({'margin-top': '-' + (parseInt(paddingTop)+2)});
            }
            else
            {
                setupbox.css({'padding-top':'2px'});
            }
            //setupbox.css({"border-bottom-right-radius": "5px"});
        }
        return setupbox;
    }

    function sign(dom,p){
        dom.addClass("HTML-TO-JSON-SELECT");
        dom.attr({"HTML-TO-JSON-SELECT":"true"});
        if(p)
        {
            var setupsun = getSetupbox(dom);
            dom.prepend(setupsun);
        }
    }

    function unsign(dom){
        dom.attr({"HTML-TO-JSON-SELECT":"false"})
        dom.removeClass("HTML-TO-JSON-SELECT");
        dom.children(".HTML-TO-JSON-SETUP").remove();
    }

    function formatReg(url,str){
        var imgReg = /src=\"([^\"]+)\"/gi;
        var scriptReg = /<script.*?>.*?<\/script>/ig;
        var spaceReg = /[\s]{2,}/gi;
        var spaceReg1 = />[\s\r\n]+</gi;
        var warpReg = /[\r\n]+/gi;

        var newstr = str.replace(spaceReg,"");
        newstr = newstr.replace(spaceReg1,"><");
        newstr = newstr.replace(warpReg,"");
        newstr = newstr.replace(scriptReg,"");

        //match(/src=\"(?!http)([^\"])+?\"/ig);
        //var x = newstr.match(/src=\"(?!http)([^\"])+?\"/ig);
        //console.log(x);
        newstr = newstr.replace(/src=\"(?!http)([^\"]+)?\"/ig,'src="' + url + '$1"');
        //newstr = newstr.replace(/src=\"([^\"]+)\"/gi,'src="' + url + '$1"');
        //var x = str.match(imgReg);
        /*
        var result = [], temp;
        while( (temp= imgReg.exec(str)) != null ) {
            result.push(temp[1]);
        }
        */
        return newstr;
        //console.log(newstr);
    }

    function dummyDom(data){
        var imgReg = /<img[^>]+>/gi;
        var spaceReg = /[\s]{2,}/gi;
        var spaceReg1 = />[\s\r\n]+</gi;
        var warpReg = /[\r\n]+/gi;
        var scriptReg = /<script.*?>.*?<\/script>/ig;
        var iframeReg = /<iframe.*?>.*?<\/iframe>/gi;
        var nullaReg = /<a[^<>]*><\/a>/gi;
        //var imgs = data.match(spaceReg);
        //console.log(imgs);
        var newdata = data.replace(imgReg,"");
        var dombox = $('<div />');
        dombox.html(newdata);
        newdata = dombox.html();
        newdata = newdata.replace(spaceReg,"");
        newdata = newdata.replace(spaceReg1,"><");
        newdata = newdata.replace(warpReg,"");
        newdata = newdata.replace(scriptReg,"");
        newdata = newdata.replace(iframeReg,"");
        newdata = newdata.replace(nullaReg,"");
        var xx = dombox.html().match(/<a[^<>]*><\/a>/g);
        var dombox2 = $('<div />');
        dombox2.html(newdata);
        console.log(newdata);
        var UL = dombox2.find('ul');
        disposeUl(UL);
    }

    function disposeUl(UL){
        for(var i=0;i<UL.length;i++)
        {
            //console.log(UL.eq(i).find("li").length,UL.eq(i));
            if(UL.eq(i).find("li").length>10)
            {
                //console.log(UL.eq(i).html());
                //console.log(UL.eq(i).find("li").eq(0).html());
            }
        }
    }

})()