/**
 * Lungo Data-Binding system
 *
 * @namespace LUNGO.View.Template
 * @class Binding
 * @requires Zepto
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

LUNGO.View.Template.Binding = (function(lng, undefined) {

    var BINDING_START = '{{';
    var BINDING_END = '}}';
    var BINDING_PARSER = /\{{.*?\}}/gi;

    /**
     * Performs databinding process for a data set and a given template
     *
     * @method create
     *
     * @param {String} Id of the container showing the result of databinding
     * @param {String} Databinding Template Id
     * @param {Object} Data for binding
     * @param {Function} Callback when the process is complete
     */
    var create = function(container_id, template_id, data, callback) {
        if (lng.View.Template.exists(template_id)) {
            var template = lng.View.Template.get(template_id);
            var markup = _processData(data, template);
            _render(container_id, markup);
            lng.Core.execute(callback);
        } else {
            lng.Core.log(3, 'lng.View.Template.binding: id ' + template_id + ' not exists');
        }
    };

    var dataAttribute = function(element, attribute) {
        var data = element.data(attribute.tag);
        if (data) {
            if(attribute.tag === 'search'){
                var regex;
                regex = new RegExp(BINDING_START  + 'article_id' + BINDING_END, "g");
                var html_binded = attribute.html.replace(regex, element.attr('id'));
                html_binded = html_binded.replace(BINDING_START + 'value' + BINDING_END, data);
            }
            else{
            var html_binded = attribute.html.replace(BINDING_START + 'value' + BINDING_END, data);
            }
            element.prepend(html_binded);
        }
    };

    var _processData = function(data, template) {
        var data_type = lng.Core.toType(data);

        if (data_type === 'array') {
            return _bindPropertiesInMultiplesElements(data, template);
        } else if (data_type === 'object') {
            return _bindProperties(data, template);
        } else {
            lng.Core.log(3, 'View.Template ERROR >> No type defined.');
        }
    };

    var _bindPropertiesInMultiplesElements = function(elements, template) {
        var markup = '';
        for (var i = 0, len = elements.length; i < len; i++) {
            markup += _bindProperties(elements[i], template);
        }
        return markup;
    };

    var _bindProperties = function(element, template) {
        template.replace(BINDING_PARSER, function(tempString){ 
            var n = tempString.replace(BINDING_START,'');
            var o = n.replace(BINDING_END,'');
            if(o.indexOf('.')=== -1 && o.indexOf('[')=== -1){
                if(element.hasOwnProperty(o)){
                    template = template.replace(tempString, element[o]);
                }
            }else{
                try{
                    var res = _objectPath(element,o)
                    template = template.replace(tempString, res);
                }
                catch (ex) {
                    template = template.replace(tempString, '');
                }
            }
        }); 
        return _removeNoBindedProperties(template);
    };

    var _removeNoBindedProperties = function(template) {
        return template.replace(BINDING_PARSER, '');
    };

    var _objectPath = function(elObj,nstr) {
        var obj = nstr.split('.');
        var current = 0, res = elObj;
        while(current < obj.length){
            res =  _objectPathStep(res,_objectPathStepArr(obj[current]));
            if(lng.Core.toType(res) ==='array'){
                var pathArr = obj[current].split('[');
                var num =+(pathArr[1].replace(']',''));
                res = res[num];
            }   
            current++;
        }
        return res
    }
    
    var _objectPathStep = function (parent, child){
        if(parent.hasOwnProperty(child)){
            return parent[child];
        } else{
            return ''
        }
    }

    var _objectPathStepArr = function (path){
        var returnPath;
        if(path.indexOf('[') !== -1){
            var pathArr = path.split('[');
            returnPath =pathArr[0];
        } else{
            returnPath = path;
        }
        return returnPath;
    }

    var _render = function(container_id, markup) {
        var container = lng.Dom.query('#' + container_id);
        container.html(markup);
    };

    return {
        create: create,
        dataAttribute: dataAttribute
    };

})(LUNGO);
