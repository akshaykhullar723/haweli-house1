function UERemoteGeneralAPI(){var t=this,g_objParent;var g_isTypeEvents=!1;var g_options=null;var g_vars={parent_id:"",class_items:"",class_active:"",selector_item_trigger:"",add_set_active_code:!1,active_code_first_unselected:!1,listen_class_change:!0,enableDebug:!1,is_editor:!1,trigger_event:"click"};var g_temp={handle:null,trashold:50};function trace(str){console.log(str)}
function getVal(obj,name,defaultValue){return window.ueRemoteConnection.getVal(obj,name,defaultValue)}
function runWithTrashold(func,trashold){if(g_temp.handle)
clearTimeout(g_temp.handle);g_temp.handle=setTimeout(func,g_temp.trashold)};function validateInited(){var isInited=g_objParent.data("remote_inited");if(isInited==!1)
throw new Error("The remote parent not inited")}
function getObjItems(){var objItems=g_objParent.find("."+g_vars.class_items);return(objItems)}
function getNumTotal(){var objItems=g_objParent.find("."+g_vars.class_items);var numTotal=objItems.length;return(numTotal)}
function getObjCurrentItem(){var selector="."+g_vars.class_items+"."+g_vars.class_active;var objCurrent=g_objParent.find(selector);return(objCurrent)}
function getNumCurrent(){var objCurrent=getObjCurrentItem();if(objCurrent.length==0)
return(-1);var index=objCurrent.index();return(index)}
function getItem(index){if(index<0)
index=0;var objItems=getObjItems();if(objItems.length==0)
return(null);if(index>=objItems.length)
index=objItems.length-1;var objItem=jQuery(objItems[index]);return(objItem)}
function getItemNum(num){var total=getNumTotal();if(jQuery.isNumeric(num)==!1)
throw new Error("num item should be numeric");if(num>=total)
num=total-1;if(num<0)
num=0;if(!num)
num=0;if(typeof num=="undefined")
num=0;return(num)}
function unselectItems(){var objItem=getObjCurrentItem();if(objItem.length==null){if(g_vars.enableDebug)
trace("Unselect Item - Selected Item not found "+g_vars.parent_id);return(!1)}
objItem.removeClass(g_vars.class_active);if(g_vars.enableDebug)
trace("Items Unselected: "+g_vars.parent_id)}
function changeItem(mixed){var numItem=getItemNum(mixed);var objItem=getItem(numItem);if(objItem==null){if(g_vars.enableDebug)
trace("General API: changeItem - item not found");return(!1)}
var numCurrent=getNumCurrent();if(numCurrent===numItem){if(g_vars.enableDebug)
trace("General API: changeItem - num current == numitem - skip ("+numItem+" )");return(!1)}
if(!g_vars.selector_item_trigger){objItem.trigger(g_vars.trigger_event);return(!1)}
var objInner=objItem.find(g_vars.selector_item_trigger);if(objInner.length==0){trace(objItem);throw new Error("Can't find inner by selector:"+g_vars.selector_item_trigger)}
objInner.trigger(g_vars.trigger_event)}
this.onEvent=function(name,func){validateInited();switch(name){case "change":g_objParent.on("uc_change",func);break;case "pause":break;default:throw new Error("General API: Wrong event: "+name);break}}
this.doAction=function(action,arg1,arg2){validateInited();if(g_isTypeEvents==!0){var funcRunAction=getVal(g_options,"func_doAction");if(!funcRunAction)
throw new Error("Missing option: 'func_doAction' ");var response=g_options.func_doAction(action,arg1,arg2);return(response)}
if(g_vars.enableDebug){trace("Action (General): "+action+" arg1: "+arg1+" arg2: "+arg2)}
switch(action){case 'get_num_current':var current=getNumCurrent();if(g_vars.enableDebug)
trace("response: "+current);return(current);break;case "get_total_items":var total=getNumTotal();if(g_vars.enableDebug)
trace("response: "+total);return(total);break;case 'change_item':changeItem(arg1);break;case "unselect_items":unselectItems();break;case "pause":case "play":break;default:throw new Error("General API: Wrong action: "+action);break}}
function initEvents_listenClassChange(){var objItems=getObjItems();if(g_vars.enableDebug==!0){trace("generalAPI: listen class change: ");trace(objItems)}
jQuery.each(objItems,function(index,item){var objItem=jQuery(item);var isSetObserver=objItem.data("uc_set_observer");if(isSetObserver===!0){return(!0)}
var observer=new MutationObserver(function(records){runWithTrashold(function(){if(g_vars.enableDebug==!0)
trace("generalAPI: trigger item change");g_objParent.trigger("uc_change")})});var config={attributes:!0};observer.observe(item,config);objItem.data("uc_set_observer",!0)})}
function initEvents_setActive(){if(g_vars.enableDebug==!0)
trace("start initEvents_setActive")
var objItems=getObjItems();if(objItems.length==0){if(g_vars.enableDebug==!0)
trace("no items, exit")
return(!1)}
var objFirstItem=getItem(0);if(objFirstItem==null){if(g_vars.enableDebug==!0)
trace("empty first item - exit")
return(!1)}
if(g_vars.active_code_first_unselected!==!0)
objFirstItem.addClass(g_vars.class_active);else if(g_vars.enableDebug==!0)
trace("skip activating first item: g_vars.active_code_first_unselected=true");objItems.on(g_vars.trigger_event,function(event){var objItem=jQuery(this);var objElement=jQuery(event.target);var isLink=objElement.is("a");if(isLink==!0&&objElement.hasClass(g_vars.class_items)==!1){return(!0)}
objItems.not(objItem).removeClass(g_vars.class_active);objItem.addClass(g_vars.class_active);g_objParent.trigger("uc_change");event.preventDefault()})}
function initEvents(){if(g_vars.enableDebug==!0){trace("generalAPI: init events");trace(g_objParent)}
if(g_vars.listen_class_change==!0)
initEvents_listenClassChange();if(g_vars.add_set_active_code==!0){initEvents_setActive()}}
this.getElement=function(){return(g_objParent)}
this.getAPIType=function(){return("general")}
function initByClasses(){try{var widgetName=g_objParent.data("widgetname");g_vars.class_items=getVal(g_options,"class_items");if(!g_vars.class_items){var widgetID=g_objParent.attr("id");trace("missing class_items in "+widgetID);trace(g_vars);throw new Error(widgetName+" - missing 'class_items' option")}
g_vars.class_active=getVal(g_options,"class_active");if(!g_vars.class_active)
throw new Error(widgetName+" - missing 'class_active' in options");g_vars.parent_id=g_objParent.attr("id");g_vars.selector_item_trigger=getVal(g_options,"selector_item_trigger");g_vars.add_set_active_code=getVal(g_options,"add_set_active_code");g_vars.active_code_first_unselected=getVal(g_options,"active_code_first_unselected");if(g_vars.add_set_active_code===!0)
g_vars.listen_class_change=!1}catch(e){trace("ERROR: "+e);trace("passed options: ");trace(g_options);throw e}}
this.init=function(objParent,options,isEditor){if(!options)
return(!1);g_vars.is_editor=isEditor;g_objParent=objParent;var connectType=getVal(options,"connect_type");if(connectType=="events")
g_isTypeEvents=!0;g_options=options;var enableDebug=getVal(options,"trace_debug");if(enableDebug==!0)
g_vars.enableDebug=!0;if(g_vars.enableDebug==!0){trace("init general api");trace(objParent);trace(options)}
if(isEditor==!0)
g_vars.trigger_event="ucclick";if(g_isTypeEvents==!1)
initByClasses();g_objParent.data("remote_inited",!0);if(g_isTypeEvents==!1){if(g_vars.listen_class_change==!0)
setTimeout(initEvents,1000);else initEvents();g_objParent.on("uc_ajax_refreshed",function(){setTimeout(initEvents,500)})}
return(!0)}}
function UERemoteGalleryAPI(){var g_api,g_isInited;var g_objParent;var t=this;function trace(str){console.log(str)}
function validateInited(){if(g_isInited==!1)
throw new Error("The owl carousel API is not inited")}
this.doAction=function(action,arg1,arg2){validateInited();switch(action){case 'get_num_current':var current=g_api.getNumCurrent();return(current);break;case "get_total_items":var total=g_api.getNumItems();return(total);break;case 'change_item':if(arg1<0)
arg1=0;g_api.selectItem(arg1);break;case "unselect_items":g_api.selectItem(0);break;case "is_playing":var isPlaying=g_api.isPlaying();return(isPlaying);break;case "pause":g_api.stop();break;case "play":g_api.play();break;default:throw new Error("GALLERY API: Wrong action: "+action);break}}
this.onEvent=function(name,func){validateInited();switch(name){case "change":g_api.on("item_change",func);break;case "play":g_api.on("play",func);break;case "pause":g_api.on("stop",func);break;default:throw new Error("Gallery API: Wrong event: "+name);break}}
this.getElement=function(){return(g_objParent)}
this.getAPIType=function(){return("gallery")}
this.init=function(objParent,options){g_api=objParent.data("unitegallery-api");if(!g_api)
return(!1);g_objParent=objParent;g_isInited=!0;return(!0)}}
function UERemoteCarouselAPI(){var g_owlCarousel,g_owl,g_isInited;var t=this;var g_enableDebug=!1;function trace(str){console.log(str)}
function validateInited(){if(g_isInited==!1)
throw new Error("The owl carousel API is not inited")}
function getTotalItems(){var total=g_owlCarousel.find(".owl-item:not(.cloned)").length;return(total)}
function resetAutoplay(){if(g_owl.settings.autoplay==!1)
return(!1);g_owlCarousel.trigger('stop.owl.autoplay');g_owlCarousel.trigger('play.owl.autoplay')}
this.doAction=function(action,arg1,arg2){validateInited();if(g_enableDebug==!0){var strAction=action;if(arg1)
strAction+=" "+arg1;if(arg2)
strAction+=" "+arg2;trace("carousel action: "+strAction)}
switch(action){case "next":g_owlCarousel.trigger('next.owl.carousel');break;case "prev":g_owlCarousel.trigger('prev.owl.carousel');break;case "play":g_owlCarousel.trigger('start_autoplay.owl.autoplay');break;case "pause":g_owlCarousel.trigger('stop.owl.autoplay');break;case "is_playing":if(g_owl.settings.autoplay==!0)
return(!0)
else return(!1);break;case "get_total_items":var total=getTotalItems()
return(total);break;case "get_progress_time":var progressTime=g_owl.settings.autoplayTimeout/1000;return(progressTime);break;case "get_modified_progress_time":var progressTime=(g_owl.settings.autoplayTimeout-g_owl.settings.smartSpeed)/1000;return(progressTime);break;case 'get_num_current':var currentItem=g_owl.relative(g_owl.current());if(g_enableDebug===!0){trace("num current: "+currentItem)}
return(currentItem);break;case "get_total_text":var owlTotalItems=g_owlCarousel.find(".owl-item:not(.cloned)").length;if(owlTotalItems.toString().length<2){owlTotalItems="0"+owlTotalItems}
return(owlTotalItems);break;case "get_current_text":var owlCurrentItem=g_owl.relative(g_owl.current())+1;if(owlCurrentItem.toString().length<2){owlCurrentItem="0"+owlCurrentItem}
return(owlCurrentItem);break;case 'change_item':var total=getTotalItems()
var currentItem=g_owl.relative(g_owl.current());var slideNum=arg1;if(slideNum==currentItem)
return(!1);if(slideNum>=total)
slideNum=(total-1);else if(slideNum<0)
slideNum=0;g_owlCarousel.trigger('to.owl.carousel',[slideNum,null,!0]);resetAutoplay();break;case "unselect_items":break;default:throw new Error("Carousel API: Wrong action: "+action);break}}
this.onEvent=function(name,func){validateInited();switch(name){case "play":g_owlCarousel.on("play_autoplay.owl.carousel",func);break;case "pause":g_owlCarousel.on("stop_autoplay.owl.carousel",func);break;case "change":g_owlCarousel.on("changed.owl.carousel",func);break;case "transition_start":g_owlCarousel.on("translate.owl.carousel",func);break;case "transition_end":g_owlCarousel.on("translated.owl.carousel",func);break;case "refreshed":g_owlCarousel.on("refreshed.owl.carousel",func);break;default:console.error("Carousel API: Wrong event: "+name);throw new Error("Carousel API: Wrong event: "+name);break}}
this.getAPIType=function(){return("carousel")}
this.getElement=function(){return(g_owlCarousel)}
this.init=function(objParent){if(typeof ucRemoteDebugEnabled!="undefined")
g_enableDebug=!0;if(objParent.hasClass("owl-carousel")==!1)
throw new Error("owl-carousel class not found");g_owlCarousel=objParent;g_owl=g_owlCarousel.data("owl.carousel");g_owlCarousel.on("uc_ajax_refreshed",onAjaxRefreshed);if(!g_owl)
return(!1);g_isInited=!0;return(!0)}
function onAjaxRefreshed(){g_owl=g_owlCarousel.data("owl.carousel")}}
function UESyncObject(){var g_objApis={};var g_groupName,g_objIDs;var t=this;var g_vars={is_editor:!1,is_editor_func_started:!1,show_debug:!1};function trace(str){console.log(str)}
function validate(objAPI){if(g_objApis.length==0)
return(!1);var numItems=objAPI.doAction("get_total_items");for(var elID in g_objApis){var firstExistingAPI=g_objApis[elID];var numItemsExisting=firstExistingAPI.doAction("get_total_items");if(numItemsExisting!==numItems){var objElement=objAPI.getElement();var elementID=objElement.attr("id");trace("Sync failed "+elementID+" has "+numItems+" items and "+elID+" has "+numItemsExisting+" items");throw new Error("Sync failed, number of items should be the same. Now it's "+numItems+" and "+numItemsExisting)}
return(!1)}}
this.setOptions=function(groupName,isEditor){if(isEditor===!0)
g_vars.is_editor=!0;if(!g_groupName)
g_groupName=groupName}
function getElementID(objAPI){var objElement=objAPI.getElement();var elementID=objElement.attr("id");return(elementID)}
function mapAPIs(func,objElement){if(typeof ucRemoteDebugEnabled!="undefined")
g_vars.show_debug=!0;var elementID=null;if(objElement){var elementID=objElement.attr("id");if(g_objApis.length==1)
return(null)}
for(var elID in g_objApis){var api=g_objApis[elID];if(elementID&&elID==elementID)
continue;func(api)}}
function onItemChange(objAPI){var numCurrent=objAPI.doAction("get_num_current");var objElement=objAPI.getElement();if(g_vars.show_debug==!0){trace("sync onchange: "+numCurrent);trace(objElement);trace(g_objApis)}
mapAPIs(function(api){if(numCurrent<0)
api.doAction("unselect_items");else api.doAction("change_item",numCurrent)},objElement)}
function onPause(objAPI){var objElement=objAPI.getElement();mapAPIs(function(api){api.doAction("pause")},objElement)}
function trigger(action,params){var realAction="uc_remote_sync_"+g_groupName+"_action_"+action;jQuery("body").trigger(realAction,params)}
this.on=function(action,func){var realAction="uc_remote_sync_"+g_groupName+"_action_"+action;jQuery("body").on(realAction,func)}
this.getDebugText=function(objElement){var text="sync group: <b>"+g_groupName+"</b>, ";var textWidgets="";mapAPIs(function(api){var objElement=api.getElement();var widgetName=objElement.data("widgetname");var widgetID=objElement.attr("id");if(textWidgets)
textWidgets+=", ";textWidgets+="<a href='#"+widgetID+"' style='color:green;text-decoration:underline'><b>"+widgetName+"</b></a>"},objElement);if(textWidgets)
text+="sync with: "+textWidgets;return(text)}
function removeDeletedAPIs(){var objAPIsNew={};mapAPIs(function(api){var elementID=getElementID(api);var objElement=jQuery("#"+elementID);if(objElement.length==0)
return(!1);var parent=objElement.parent();objAPIsNew[elementID]=api});g_objApis=objAPIsNew}
function onEditorCheck(){removeDeletedAPIs();trigger("update_debug",g_groupName)}
this.getGroupName=function(){return(g_groupName)}
this.addAPI=function(objAPI){var id=getElementID(objAPI);if(g_objApis.hasOwnProperty(id))
return(!1);g_objApis[id]=objAPI;if(g_vars.is_editor==!0)
removeDeletedAPIs();validate(objAPI);var objElement=objAPI.getElement();trigger("update_debug",g_groupName);objAPI.onEvent("change",function(){onItemChange(objAPI)});objAPI.onEvent("pause",function(){onPause(objAPI)});if(g_vars.is_editor==!0&&g_vars.is_editor_func_started==!1){setInterval(onEditorCheck,700);g_vars.is_editor_func_started=!1}}
this.getElements=function(exceptID){if(!g_objApis)
return(null);var arrElements=[];for(var elID in g_objApis){if(exceptID&&exceptID==elID)
continue;var objApi=g_objApis[elID];var objElement=objApi.getElement();arrElements.push(objElement)}
if(arrElements.length==0)
return(null);return(arrElements)}}
function UERemoteWidgets(){var g_objParent,g_objWidget,g_parentID;var g_api,g_objSync,g_remoteConnection=window.ueRemoteConnection;var t=this;var g_vars={is_inited:!1,funcOnInit:null,is_editor:null,widget_id:null,init_options:null,is_parent_mode:!1,syncid:null,options_api:null,show_connection_debug:!1,debug_show_ids:!1,debug_show_widget:"",trace_debug:!1};var g_types={CAROUSEL:"carousel",GALLERY:"gallery",GENERAL:"general"};function trace(str){console.log(str)}
function getVal(obj,name,defaultValue){return window.ueRemoteConnection.getVal(obj,name,defaultValue)}
function _______INIT_________(){}
function initWidget(widgetID){g_objWidget=jQuery("#"+widgetID);if(g_objWidget.length==0)
throw new Error("Widget not found by id: "+widgetID);g_vars.widget_id=widgetID;var forceID=getVal(g_vars.init_options,"force_parentid");if(forceID)
g_parentID=forceID;else g_parentID=g_objWidget.data("parentid");if(!g_parentID)
throw new Error("Parent controlled ID not set")}
function getParentType(){if(!g_objParent||g_objParent.length==0)
throw new Error("getParentType: no parent found");if(g_objParent.hasClass("owl-carousel"))
return(g_types.CAROUSEL);var dataType=g_objParent.data("remote-type");switch(dataType){case "gallery":return g_types.GALLERY;break}
return(g_types.GENERAL)}
function getOffsetsDistance(offset1,offset2){var dx=offset2.left-offset1.left;var dy=offset2.top-offset1.top;return Math.sqrt(dx*dx+dy*dy)}
function getClosestByOffset(objParents,objElement){var objClosest=null;var minDiff=1000000;var elementOffset=objElement.offset();if(g_vars.trace_debug){trace("Widget Offset: ");trace(elementOffset)}
jQuery.each(objParents,function(index,parent){var objParent=jQuery(parent);var parentOffset=objParent.offset();if(parentOffset.top==0){var firstParent=getWidgetContainer(objParent);var parentOffset=firstParent.offset()}
var distance=getOffsetsDistance(parentOffset,elementOffset);if(g_vars.trace_debug){trace("Parent offset: ");trace(objParent);trace(parentOffset);trace("distance: "+distance)}
if(distance<minDiff){minDiff=distance;objClosest=objParent}});return(objClosest)}
function filterParentsBySection(objParents,objElement){var objSection=objElement.closest(".elementor-top-section");if(objSection.length==0)
return(objParents);var section=objSection[0];var objFiltered=objParents.filter(function(index,parent){var isContains=jQuery.contains(section,parent);return isContains});if(objFiltered.length)
return(objFiltered);return(objParents)}
function detectClosestParent(objParents){var objContainer=jQuery("body");var objTemplateHolder=g_objWidget.closest(".uc-template-holder");if(objTemplateHolder.length)
objContainer=objTemplateHolder;if(!objParents)
var objParents=objContainer.find(".uc-remote-parent").not(g_objWidget);if(g_vars.trace_debug){trace("detect closest start. group:");trace(objParents)}
var numParents=objParents.length;if(numParents==0)
return(null);if(numParents==1)
return(objParents);if(g_vars.trace_debug)
trace("filter auto");var objParentsFiltered=objParents.filter("[data-remoteid='"+g_parentID+"']");if(objParentsFiltered.length==1)
return(objParentsFiltered);if(g_vars.trace_debug){trace("filter by section")}
var objParents=filterParentsBySection(objParents,g_objWidget);if(g_vars.trace_debug){trace(objParents)}
if(objParents.length==1)
return(objParents);if(g_vars.trace_debug)
trace("get closest by parent");var objClosest=getClosestByOffset(objParents,g_objWidget);if(objClosest)
return(objClosest);if(g_vars.trace_debug)
trace("get first");var firstParent=jQuery(objParentsFiltered[0]);return(firstParent)}
function setParentObject(){var objForceParent=getVal(g_vars.init_options,"force_parent_obj");var widgetID=g_objWidget.attr("id");if(g_vars.trace_debug)
trace("start set parent for: "+widgetID+", parent name: "+g_parentID);if(objForceParent){g_objParent=objForceParent;if(g_vars.trace_debug){trace("set force parent");trace(g_objParent)}
return(!0)}
if(!g_parentID)
throw new Error("Parent controller ID not found");if(!g_objParent||g_objParent.length==0){if(g_parentID=="auto"){if(g_vars.trace_debug){trace("auto detect selected")}
g_objParent=detectClosestParent();if(g_vars.trace_debug){trace("detect closest");trace(g_objParent)}
if(!g_objParent)
throw new Error("Can't detect remote parent")}else{var objParents=jQuery(".uc-remote-parent[data-remoteid='"+g_parentID+"']").not(g_objWidget);if(g_vars.trace_debug)
trace("Detect from group: "+g_parentID);g_objParent=detectClosestParent(objParents);if(g_vars.trace_debug){trace("detected from group");trace(g_objParent)}
if(!g_objParent||g_objParent.length==0){var isAnotherTry=g_objWidget.data("uc_parent_detect_another_try");if(!isAnotherTry){g_objWidget.data("uc_parent_detect_another_try",!0);if(g_vars.trace_debug)
trace("Set another try for parent detect");return(!1)}
throw new Error("Parent widget with remote name: '"+g_parentID+"' not found")}}}
if(g_objParent&&g_objParent.length>1){g_objParent=jQuery(g_objParent[0])}
if(g_vars.trace_debug==!0){var parentID=g_objParent.attr("id");var widgetID=g_objWidget.attr("id");trace("widget: "+widgetID+" connected to: "+parentID)}
if(!g_objParent||g_objParent.length==0)
throw new Error("Remote parent not found");return(!0)}
function initAPI(){if(g_vars.trace_debug==!0){trace("start init api function")}
if(!g_api){var parentType=getParentType();if(!parentType){trace(g_objParent);throw new Error("No parent type found")}
if(g_vars.trace_debug==!0){trace("init api: "+parentType);trace(g_objParent)}
switch(parentType){case g_types.CAROUSEL:g_api=new UERemoteCarouselAPI();break;case g_types.GENERAL:g_api=new UERemoteGeneralAPI();break;case g_types.TABS:g_api=new UERemoteGeneralAPI();break;case g_types.GALLERY:g_api=new UERemoteGalleryAPI();break;default:throw new Error("Wrong parent type: "+parentType);break}}
var optionsFromData=g_objParent.data("uc-remote-options");var isEditor=isInsideEditor();if(optionsFromData)
g_vars.options_api=optionsFromData;var optionsAPI={};var optionsAPI=jQuery.extend({},g_vars.options_api);if(jQuery.isEmptyObject(g_vars.options_api)==!1)
jQuery.extend({},optionsAPI,g_vars.options_api);if(g_vars.trace_debug==!0){if(optionsAPI)
trace(optionsAPI);optionsAPI.trace_debug=!0}
var isInited=g_api.init(g_objParent,g_vars.options_api,isEditor);if(g_vars.trace_debug==!0){trace("inited: "+isInited)}
return(isInited)}
function initParent(){var isParentSet=setParentObject();if(isParentSet==!1)
return(!1);var isInited=initAPI();return(isInited)}
function initGlobal(widgetID,func){if(!g_objWidget)
initWidget(widgetID);var isDebug=g_objWidget.data("debug");if(isDebug===!0||typeof ucRemoteDebugEnabled!="undefined"){g_vars.trace_debug=!0;g_vars.show_connection_debug=!0}
if(g_vars.trace_debug){if(!widgetID)
widgetID=g_objWidget.attr("id");trace("Initing Remote Widget: "+widgetID)}
g_vars.is_inited=initParent();if(g_vars.is_inited==!1){if(!g_objParent){setTimeout(func,1000)}else{if(g_vars.trace_debug==!0){trace(g_objParent);trace("set object ready event")}
g_objParent.on("uc-object-ready",func)}}}
this.setAction=function(action,objElement,allowMultiple){if(g_vars.trace_debug==!0){trace("set action: "+action)}
if(g_vars.is_inited==!1)
throw new Error("Widget not inited");if(typeof objElement=="string"){var selector=objElement;objElement=g_objWidget.find(objElement);if(objElement.length==0)
throw new Error("Remote '"+action+"' action error: element: "+selector+" not found")}
if(!objElement||objElement.length==0)
throw new Error("Element not inited");if(!g_api)
throw new Error("API not inited!");var linkedAction=objElement.data("uc-action");if(allowMultiple!==!0)
if(linkedAction){trace("not allow multiple action: "+action);return(!1)}
objElement.data("uc-action",action);objElement.on("click",function(){var objElement=jQuery(this);if(objElement.hasClass("uc-disabled"))
return(!0);t.doAction(action)})}
function onWidgetReady(){checkWidgetDebug();var isEditorMode=isInsideEditor();if(isEditorMode==!0){hideErrorOnWidget();setInterval(checkWidgetInsideEditor,700)}}
function _______TEXT_ON_WIDGET_________(){}
function hideErrorOnWidget(){if(!g_objWidget||g_objWidget.length==0)
return(!1);var objParent=getWidgetContainer(g_objWidget);var objError=objParent.find('.uc-remote-error');if(objError.length==0)
return(!1);if(objError.is(":visible")==!1)
return(!1);objError.hide();g_objWidget.css({"border":"none"});checkWidgetDebug()}
function getWidgetContainer(objWidget){var objParent=objWidget.parents(".elementor-widget-container");if(objParent.length==0)
objParent=objWidget.parent();return(objParent)}
function addTextDiv(objWidget,type){var objParent=getWidgetContainer(objWidget);var isDebug=(type=="debug");var className="uc-remote-error";if(isDebug==!0)
className="uc-remote-debug";var divText="<div class='"+className+"'></div>";objParent.append(divText);var objError=objParent.find('.'+className+'');var css={"position":"absolute","color":"red","top":"-30px","left":"0px","z-index":"999999","background-color":"#ffffff"};if(isDebug==!0){css.color="green";css["z-index"]="999998"}
var objParentsBG=objParent.parents(".unlimited-elements-background-overlay");if(objParentsBG.length){css.top="0px"}
objError.css(css);var objError=objParent.find('.'+className+'');return(objError)}
function displayTextOnWidget(objWidget,message,type){var isDebug=(type=="debug");var className="uc-remote-error";if(isDebug==!0)
className="uc-remote-debug";var objParent=getWidgetContainer(objWidget);objText=objParent.find("."+className);if(objText.length==0){objText=addTextDiv(objWidget,type);if(isDebug==!1){var isInEditor=isInsideEditor();if(isInEditor==!0){setTimeout(function(){displayTextOnWidget(objWidget,message,type)},2000);return(!1)}}}
if(isDebug==!1){objWidget.css({"border":"2px solid red","position":"relative"})}
objText.show();objText.html(message)}
function displayErrorMessage(message){if(typeof g_ucRemoteHideErrors!=="undefined"&&g_ucRemoteHideErrors===!0){trace("UE Remote Error: "+message);return(!1)}
if(g_vars.is_parent_mode==!1){if(g_objWidget&&g_objWidget.length)
displayTextOnWidget(g_objWidget,message,"error")}else{displayTextOnWidget(g_objParent,message,"error")}}
function _______DEBUG_________(){}
function isDebugActive(objWidget){if(!objWidget)
objWidget=g_objWidget;var isActive=objWidget.data("debug_active");if(isActive===!0)
return(!0);return(!1)}
function removeDebugVisual(objWidget){if(!objWidget)
objWidget=g_objWidget;g_objWidget.data("debug_active",!1);g_objWidget.css({"border-style":"none"})}
function setDebugVisual(color,objWidget){if(!objWidget)
objWidget=g_objWidget;objWidget.data("debug_active",!0);objWidget.css({"border-style":"solid","border-width":"3px","border-color":color})}
function isParentDebugActive(objParent){var dataDebug=objParent.data("debug");var isDebug=(dataDebug===!0);return(isDebug)}
function checkWidgetDebugWork(objWidget,objParent){if(!objWidget)
objWidget=g_objWidget;if(!objParent)
objParent=g_objParent;var isDebug=isParentDebugActive(objParent);var isActive=isDebugActive(objWidget);if(isDebug==!1){if(isActive==!0)
removeDebugVisual(objWidget);return(!1)}
if(isActive==!1){var color=addParentDebug(objParent);setDebugVisual(color,objWidget)}}
function checkDebugConnectionText(){if(!g_objWidget)
return(!1);if(g_vars.show_connection_debug==!1)
return(!1);if(!g_objParent||g_objParent.length==0)
throw new Error("Not conneted to no parent");var widgetName=g_objParent.data("widgetname");var widgetID=g_objParent.attr("id");var text="connected to <a href='#"+widgetID+"' style='color:green;text-decoration:underline'><b>"+widgetName+"</b></a>";displayTextOnWidget(g_objWidget,text,"debug")}
function checkWidgetDebug(){var noDebugCheck=getVal(g_vars.init_options,"no_debug_check");if(noDebugCheck===!0)
return(!1);if(!g_objParent||g_vars.is_inited==!1){removeDebugVisual();return(!1)}
checkWidgetDebugWork();checkDebugConnectionText()}
this.onEvent=function(name,func){g_api.onEvent(name,func)}
function changeItemByAction(dir){var current=t.doAction("get_num_current");var total=t.doAction("get_total_items");switch(dir){case "next":var num=current+1;if(num>=total)
num=0;break;case "prev":var num=current-1;if(num<0)
num=total-1;break;default:throw new Error("wrong direction type: "+dir);break}
t.doAction("change_item",num)}
this.doAction=function(action,arg1,arg2){if(g_vars.trace_debug){var strAction=action;if(arg1)
strAction+=" "+arg1;if(arg2)
strAction+=" "+arg2;trace("Do Action: ");trace(strAction)}
if(!g_api){if(g_vars.trace_debug)
trace("empty g_api, exit");return(!1)}
switch(action){case "prev":case "next":var apiType=g_api.getAPIType();if(apiType=="carousel"){g_api.doAction(action);return(!1)}
changeItemByAction(action);return(!1);break}
var response=g_api.doAction(action,arg1,arg2);if(g_vars.trace_debug){trace("Response: ");trace(response)}
return(response)}
function addParentDebug(objParent){if(!objParent)
objParent=g_objParent;var color=g_objParent.data("uc-debug-color");if(color)
return(color);var objBody=jQuery("body");var dataColors="uc-remote-debug-colors";var objColors=objBody.data(dataColors);if(!objColors){objColors=["#ffeb00","blue","#808000","#d1e231","#01796f","#8e4585","#ff33cc","#436b95","#eaa221","#b86d29"]}
var color=objColors.pop();g_objParent.data("uc-debug-color",color);objBody.data(dataColors,objColors);g_objParent.css("border","3px solid "+color);return(color)}
function updateSyncDebug(event,syncID){if(g_vars.debug_show_ids==!0)
return(!1);try{if(syncID!=g_vars.syncid){var name=g_objParent.data("widgetname");throw new Error("Wrong sync group mishmash "+g_vars.syncid+" and "+syncID)}
var debugText=g_objSync.getDebugText(g_objParent);if(!debugText)
return(!1);displayTextOnWidget(g_objParent,debugText,"debug")}catch(error){displayErrorMessage(error)}}
function _______EDITOR_RELATED_________(){}
function isInsideEditor(){if(g_vars.is_editor!==null)
return g_vars.is_editor;if(typeof g_ucAdmin!=="undefined"){g_vars.is_editor=!0;return(!0)}
if(window.self!==window.top&&typeof window.parent.elementor!=="undefined"){g_vars.is_editor=!0;return!0}
g_vars.is_editor=!1;return!1}
function resetSettingsInsideEditor(){g_objParent=null;g_api=null;g_vars.is_inited=!1}
function checkWidgetInsideEditor(){try{hideErrorOnWidget();if(g_vars.is_inited==!0){if(g_objParent.is(":hidden")){resetSettingsInsideEditor()}}else{g_vars.is_inited=initParent();if(g_vars.is_inited==!0){g_vars.funcOnInit()}else if(g_vars.is_inited==!1){g_objParent.on("uc-object-ready",function(){g_vars.is_inited=!0;g_vars.funcOnInit()})}}
checkWidgetDebug()}catch(message){displayErrorMessage(message);return(!1)}}
this.onWidgetInit=function(widgetID,func,options){try{if(g_vars.is_inited==!0)
return(!1);if(g_vars.trace_debug==!0){trace("on widget init: "+widgetID)}
if(!g_vars.funcOnInit){if(typeof func!="function")
throw new Error("onWidgetInit error: the second parameter should be a function");g_vars.funcOnInit=func}
if(options&&g_vars.init_options==null)
g_vars.init_options=options;if(g_vars.debug_show_widget&&g_vars.debug_show_widget==widgetID)
g_vars.trace_debug=!0;initGlobal(widgetID,t.onWidgetInit);if(g_vars.is_inited==!1){if(g_vars.trace_debug==!0){trace(widgetID+" not inited yet, waiting for parent init")}
return(!1)}
if(g_vars.debug_show_ids==!0){trace("start debug show id's");displayTextOnWidget(g_objWidget,g_objWidget.attr("id"),"debug")}
if(g_vars.trace_debug==!0)
trace("start debug - show connect");if(g_objParent.length>1){trace(g_objWidget);trace(g_objParent);throw new Error("Remote widget can't connect to more then 1 parents")}
onWidgetReady();if(g_vars.funcOnInit){g_vars.is_inited=!0;g_vars.funcOnInit(g_objWidget)}}catch(message){displayErrorMessage(message);var isEditorMode=isInsideEditor();if(isEditorMode==!0)
setInterval(checkWidgetInsideEditor,700);return(!1)}}
function startParentSync(){var syncID=g_objParent.data("syncid");if(g_vars.trace_debug==!0){trace("Start parent sync");trace(g_objParent)}
if(!syncID){if(g_vars.trace_debug==!0){trace("no sync id")}
return(!1)}
var objSync=g_remoteConnection.getSyncObject(syncID);var isEditorMode=isInsideEditor();objSync.setOptions(syncID,isEditorMode);var isInited=initAPI();if(isInited==!1){var widgetID=g_objParent.attr("id");var parentType=getParentType();var message="Sync Error - can't init api for "+widgetID;if(parentType==g_types.CAROUSEL){message+=", please check that the owl carousel js file loading from unlimited elements plugin."}else{message+=", please check if the widget is inited and working."}
throw new Error(message)}
g_vars.syncid=syncID;if(g_vars.trace_debug===!0)
objSync.on("update_debug",updateSyncDebug);g_objSync=objSync;objSync.addAPI(g_api)}
this.onParentInit=function(objParent,optionsAPI){try{g_objParent=objParent;if(!g_objParent)
return(!1);if(g_objParent.length==0)
return(!1);g_vars.is_parent_mode=!0;var optionsFromData=g_objParent.data("uc-remote-options");if(optionsFromData)
optionsAPI=optionsFromData;if(optionsAPI)
g_vars.options_api=optionsAPI;var isDebug=g_objParent.data("debug");if(typeof ucRemoteDebugEnabled!="undefined")
isDebug=!0;g_vars.trace_debug=isDebug;if(isDebug===!0)
addParentDebug(objParent);var isSync=objParent.data("sync");if(isSync==!0)
startParentSync();if(g_vars.debug_show_ids==!0){displayTextOnWidget(g_objParent,g_objParent.attr("id"),"debug")}}catch(message){displayErrorMessage(message);return(!1)}}
this.showInfo=function(){trace("parent");trace(g_objParent);trace("current widget");trace(g_objWidget)}
this.getParent=function(){return(g_objParent)}}
function UERemoteConnection(){var t=this;this.getVal=function(obj,name,defaultValue){if(!defaultValue)
var defaultValue="";var val="";if(!obj||typeof obj!="object")
val=defaultValue;else if(obj.hasOwnProperty(name)==!1){val=defaultValue}else{val=obj[name]}
return(val)}
this.getSyncObject=function(syncID){var syncRealID="uc_sync_"+syncID;var objSync=t.getVal(window,syncRealID);if(objSync)
return(objSync);var objSync=new UESyncObject();window[syncRealID]=objSync;return(objSync)}
this.getSyncedElements=function(objElement){if(!objElement)
return(null);if(objElement.length==0)
return(null);if(objElement.hasClass("uc-remote-parent")==!1)
return(null);var isSync=objElement.data("sync");if(isSync!==!0)
return(null);var syncID=objElement.data("syncid");if(!syncID)
return(null);var objSync=t.getSyncObject(syncID);var currentID=objElement.attr("id");var arrElements=objSync.getElements(currentID);return(arrElements)}}
jQuery(document).on("uc-remote-parent-init",function(event,objParent,optionsAPI){var objRemote=new UERemoteWidgets();objRemote.onParentInit(objParent,optionsAPI)});window.ueRemoteConnection=new UERemoteConnection()