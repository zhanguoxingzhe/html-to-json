var AJAX = {};
AJAX.post = function(url,jsons,fun){
    $.post(url,jsons,function(data){
        try
        {
            if(typeof(data)=="object")
            {
                (typeof(fun)=="function")&&fun(data);
            }
            else if(typeof(data)=="string")
            {
                var array = eval("(" + data + ")");
                (typeof(fun)=="function")&&fun(array);
            }
            else
            {
                (typeof(fun)=="function")&&fun(data);
            }
        }
        catch(e){
            (typeof(fun)=="function")&&fun(false,data);
        }
    });
};

AJAX.get = function(url,fun,jsons){
    $.get(url,jsons,function(data){
        fun && fun(data);
    });
};

AJAX.jsonp = function(url,jsons,fun){
    $.getJSON(url,jsons,function(data){
        try
        {
            (typeof(fun)=="function")&&fun(data);
        }
        catch(e){
            (typeof(fun)=="function")&&fun(false,data);
        }
    });
};